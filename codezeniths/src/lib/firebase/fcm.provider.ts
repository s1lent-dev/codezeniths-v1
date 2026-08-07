"use client";

import { useEffect } from 'react';
import { useFcmListener, requestPushPermission } from './client';
import { notificationQueryService } from '@/lib/tanstack/services/notification.query-service';
import { userQueryService } from '@/lib/tanstack/services/user.query-service';
import { useAuth } from '@/lib/auth/auth';
import { useToast } from '@codezeniths/modules';

/**
 * Mount ONCE in the root layout, alongside <ClientSideServiceWorker />.
 * Not tied to the onboarding form or settings page — it needs to outlive
 * both so it can catch FID rotation whenever it happens during the app
 * session, not just at the moment the user first opts in.
 *
 * Handles:
 * 1. Background FID registration & rotation (when permission is granted).
 * 2. Multi-device permission prompt when user enabled pushes on account but
 *    hasn't granted permission on the current browser/device yet.
 */
export default function FcmListenerProvider() {
  const upsertDeviceToken = notificationQueryService.upsertDeviceToken();
  const { isAuthenticated } = useAuth();
  const toast = useToast();

  // 1. Silent FCM registration & rotation listener
  useFcmListener({
    onFidRegistered: (fid) => {
      upsertDeviceToken.mutate({ fid, platform: 'web' });
    },
  });

  // 2. Fetch user settings (only enabled when authenticated)
  const { data: settingsData } = userQueryService.getSettings({}, { enabled: isAuthenticated });

  // 3. Multi-device permission prompt: if account pref is ON, but device permission is default
  useEffect(() => {
    if (!isAuthenticated || !settingsData?.preferences?.pushNotifications) return;

    if (typeof window === 'undefined' || !('Notification' in window)) return;

    if (Notification.permission === 'default') {
      const promptDismissedKey = 'fcm_prompt_dismissed';
      const lastDismissed = localStorage.getItem(promptDismissedKey);
      
      // Do not re-prompt within 24 hours of dismissal
      if (lastDismissed && Date.now() - parseInt(lastDismissed, 10) < 24 * 60 * 60 * 1000) {
        return;
      }

      toast.info(
        'Enable Push Notifications',
        'Push notifications are enabled on your account. Allow them on this device to receive alerts here too.',
        {
          duration: 10000,
          action: {
            label: 'Enable',
            onClick: async () => {
              const res = await requestPushPermission();
              if (res === 'denied') {
                localStorage.setItem(promptDismissedKey, Date.now().toString());
              }
            },
          },
        }
      );
    }
  }, [isAuthenticated, settingsData?.preferences?.pushNotifications]);

  return null; // Zero UI representation
}
