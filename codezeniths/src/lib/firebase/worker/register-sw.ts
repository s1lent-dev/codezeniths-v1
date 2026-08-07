import { ENV_CONFIG } from '@/config/config';

/**
 * Registers the Firebase Messaging Service Worker using client configuration
 * from ENV_CONFIG. Credentials are passed as query parameters so the config
 * doesn't need to be hardcoded into the static `/firebase-messaging-sw.js`
 * file.
 *
 * Registered with `type: 'module'` because firebase-messaging-sw.js now
 * imports the modular Firebase SDK directly (`import ... from`) instead of
 * `importScripts()` with the legacy namespaced compat build. Module service
 * workers are supported in all current evergreen browsers; if you need to
 * support a browser that doesn't support module SW yet, you'll need to
 * bundle firebase-messaging-sw.js as a classic script instead.
 */
export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    console.warn('Service Workers or Notifications are not supported in this browser environment.');
    return null;
  }

  try {
    const queryParams = new URLSearchParams({
      apiKey: ENV_CONFIG.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: ENV_CONFIG.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: ENV_CONFIG.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: ENV_CONFIG.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: ENV_CONFIG.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: ENV_CONFIG.NEXT_PUBLIC_FIREBASE_APP_ID,
      measurementId: ENV_CONFIG.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || '',
    });

    const swUrl = `/firebase-messaging-sw.js?${queryParams.toString()}`;
    const registration = await navigator.serviceWorker.register(swUrl, {
      scope: '/',
      type: 'module',
    });

    console.log('FCM Service Worker registered successfully with scope:', registration.scope);
    return registration;
  } catch (error) {
    console.error('FCM Service Worker registration failed:', error);
    return null;
  }
};