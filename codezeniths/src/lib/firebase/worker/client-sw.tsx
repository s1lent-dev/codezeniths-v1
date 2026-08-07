"use client";

import { useEffect } from 'react';
import { registerServiceWorker } from './register-sw';

/**
 * A lightweight client component that mounts on layout load to automatically
 * trigger the registration of the FCM Service Worker.
 */
export default function ClientSideServiceWorker() {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return null; // Zero UI representation
}
