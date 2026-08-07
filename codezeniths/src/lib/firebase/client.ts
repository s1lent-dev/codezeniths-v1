"use client";

import { useEffect, useRef, useState } from 'react';
import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import {
  getMessaging as getFirebaseMessaging,
  register,
  onRegistered,
  Messaging,
  isSupported,
  onMessage,
  Unsubscribe,
} from 'firebase/messaging';
import { ENV_CONFIG } from '@/config/config';
import { useRouter } from 'next/navigation';
import { useToast } from '@codezeniths/modules';
import { registerServiceWorker } from './worker/register-sw';

/**
 * Singleton service for managing the Client-side Firebase Cloud Messaging SDK operations.
 * Lazily initializes Firebase App and Messaging to be safe for SSR/next.js environments.
 *
 * Requires firebase (client SDK) >= 12.14.0 (messaging >= 0.13.0).
 *
 * IMPORTANT — two separate concerns, deliberately split:
 *  - useFcmListener()      -> mount ONCE, globally (root layout). Listens for
 *                             FID registration + rotation for the app's whole
 *                             session. Never prompts for permission.
 *  - requestPushPermission() -> call from a user-initiated action anywhere
 *                             (onboarding step, settings toggle). Prompts for
 *                             permission and triggers register(). Does NOT
 *                             return the FID itself — whichever useFcmListener()
 *                             instance is mounted (the global one) receives it.
 */
class FcmClientService {
  private static instance: FcmClientService;
  private app: FirebaseApp | null = null;
  private messagingInstance: Messaging | null = null;

  private constructor() {}

  public static getInstance(): FcmClientService {
    if (!FcmClientService.instance) {
      FcmClientService.instance = new FcmClientService();
    }
    return FcmClientService.instance;
  }

  public getFirebaseApp(): FirebaseApp | null {
    if (typeof window === 'undefined') return null;

    if (!this.app) {
      const firebaseConfig = {
        apiKey: ENV_CONFIG.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: ENV_CONFIG.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: ENV_CONFIG.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: ENV_CONFIG.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: ENV_CONFIG.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: ENV_CONFIG.NEXT_PUBLIC_FIREBASE_APP_ID,
        measurementId: ENV_CONFIG.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
      };

      this.app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    }

    return this.app;
  }

  public async getMessagingInstance(): Promise<Messaging | null> {
    if (typeof window === 'undefined') return null;

    const supported = await isSupported();
    if (!supported) {
      console.warn('FCM is not supported in this browser.');
      return null;
    }

    if (!this.messagingInstance) {
      const app = this.getFirebaseApp();
      if (app) {
        this.messagingInstance = getFirebaseMessaging(app);
      }
    }

    return this.messagingInstance;
  }

  private async registerFcm(): Promise<void> {
    const messaging = await this.getMessagingInstance();
    if (!messaging) return;

    const swRegistration = await registerServiceWorker();

    await register(messaging, {
      vapidKey: ENV_CONFIG.NEXT_PUBLIC_FIREBASE_FCM_VAPID_KEY,
      ...(swRegistration ? { serviceWorkerRegistration: swRegistration } : {}),
    });
  }

  /**
   * Call this from a user-initiated action — the onboarding form's
   * "enable push notifications" step, a settings toggle, etc. Safe to
   * call multiple times / from multiple places; it's a no-op once
   * permission is already 'granted' and registration has happened
   * (register() is idempotent — Firebase just confirms the existing FID
   * or issues a fresh one if needed).
   *
   * Returns the resulting permission state so the caller can update its
   * own UI (e.g. show "denied, enable in browser settings").
   */
  public requestPushPermission = async (): Promise<NotificationPermission> => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'denied';
    }

    let permission = Notification.permission;

    if (permission === 'default') {
      permission = await Notification.requestPermission();
    }

    if (permission === 'granted') {
      try {
        await this.registerFcm();
      } catch (error) {
        console.error('FCM registration failed after permission was granted:', error);
      }
    }

    return permission;
  };

  /**
   * Mount ONCE, at the root layout (alongside <ClientSideServiceWorker />).
   * Listens for the whole app session:
   *  - the FID from the first successful register() (wherever it was
   *    triggered from — onboarding, settings, doesn't matter)
   *  - FID rotation (periodic refresh, storage cleared, pushsubscriptionchange)
   *  - foreground push messages
   *
   * `onFidRegistered` fires every time — first registration AND every
   * rotation — wire it straight to your upsert mutation; upserting an
   * unchanged FID is a harmless no-op that just bumps lastUsedAt.
   */
  public useFcmListener = (options?: { onFidRegistered?: (fid: string) => void | Promise<void> }) => {
    const router = useRouter();
    const toast = useToast();
    const [fid, setFid] = useState<string | null>(null);
    const [notificationPermissionStatus, setNotificationPermissionStatus] = useState<NotificationPermission | null>(null);
    const onFidRegisteredRef = useRef(options?.onFidRegistered);
    onFidRegisteredRef.current = options?.onFidRegistered;

    // Registration + rotation listener — stays alive for the app session.
    useEffect(() => {
      if (typeof window === 'undefined' || !('Notification' in window)) return;
      let unsubscribeReg: Unsubscribe | null = null;

      const setupRegisteredListener = async () => {
        const messaging = await this.getMessagingInstance();
        if (!messaging) return;

        unsubscribeReg = onRegistered(messaging, (installationId) => {
          setFid(installationId);
          setNotificationPermissionStatus(Notification.permission);
          void onFidRegisteredRef.current?.(installationId);
        });
      };

      setupRegisteredListener();

      return () => {
        if (unsubscribeReg) unsubscribeReg();
      };
    }, []);

    // Foreground message listener
    useEffect(() => {
      let unsubscribe: Unsubscribe | null = null;

      const setupListener = async () => {
        if (!fid) return;

        const messaging = await this.getMessagingInstance();
        if (!messaging) return;

        unsubscribe = onMessage(messaging, (payload) => {
          if (Notification.permission !== 'granted') return;

          const link = payload.fcmOptions?.link || payload.data?.link;

          const title = payload.notification?.title || 'Notification';
          const description = payload.notification?.body || '';

          let actions: Array<{ title: string; action: string }> = [];
          if (payload.data?.actions) {
            try {
              actions = JSON.parse(payload.data.actions);
            } catch (e) {}
          }

          const toastOptions: any = {
            className: 'backdrop-blur-md bg-white/30 dark:bg-black/30 border border-white/20 shadow-2xl rounded-xl !bg-gradient-to-br from-indigo-500/10 to-purple-500/10',
          };

          if (actions.length > 0) {
            toastOptions.action = {
              label: actions[0].title,
              onClick: () => router.push(link ? `${link}?action=${actions[0].action}` : `/${actions[0].action}`),
            };
            if (actions.length > 1) {
              toastOptions.cancel = {
                label: actions[1].title,
                onClick: () => router.push(link ? `${link}?action=${actions[1].action}` : `/${actions[1].action}`),
              };
            }
          } else if (link) {
            toastOptions.action = {
              label: 'View',
              onClick: () => router.push(link),
            };
          }

          toast.info(title, description, toastOptions);

          try {
            const n = new Notification(
              payload.notification?.title || 'New Message',
              {
                body: payload.notification?.body || '',
                data: link ? { url: link } : undefined,
              }
            );

            n.onclick = (event) => {
              event.preventDefault();
              const targetUrl = (event.target as Notification)?.data?.url;
              if (targetUrl) router.push(targetUrl);
            };
          } catch (error) {
            console.error('Failed to trigger HTML5 notification overlay:', error);
          }
        });
      };

      setupListener();

      return () => {
        if (unsubscribe) unsubscribe();
      };
    }, [fid, router]);

    return { fid, notificationPermissionStatus };
  };
}

export const fcmClientService = FcmClientService.getInstance();

/** Mount once at root layout. */
export const useFcmListener = fcmClientService.useFcmListener;

/** Call from a user-initiated opt-in action anywhere in the app. */
export const requestPushPermission = fcmClientService.requestPushPermission;