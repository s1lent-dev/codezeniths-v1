// firebase-messaging-sw.js
//
// Registered with { type: 'module' } from register-sw.ts, so we can use
// native ES module `import` instead of the legacy `importScripts()` +
// namespaced `firebase.*` global API. This talks to the SW-specific modular
// build Firebase publishes on gstatic.
//
// Pin this version to match the `firebase` package version in package.json
// (client SDK, not firebase-admin) — mismatches between the app bundle's
// Firebase version and this CDN version are a common source of silent
// background-message failures.
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import { getMessaging, onBackgroundMessage } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-messaging-sw.js";

// Extract configuration from the registration URL's query parameters
// (see worker/register-sw.ts) — keeps secrets out of this static file.
const params = new URLSearchParams(self.location.search);

const firebaseConfig = {
  apiKey: params.get("apiKey") || "",
  authDomain: params.get("authDomain") || "",
  projectId: params.get("projectId") || "",
  storageBucket: params.get("storageBucket") || "",
  messagingSenderId: params.get("messagingSenderId") || "",
  appId: params.get("appId") || "",
  measurementId: params.get("measurementId") || "",
};

if (firebaseConfig.apiKey) {
  const app = initializeApp(firebaseConfig);
  const messaging = getMessaging(app);

  onBackgroundMessage(messaging, (payload) => {
    console.log("[firebase-messaging-sw.js] Received background message:", payload);

    const link = payload.fcmOptions?.link || payload.data?.link;
    const notificationTitle = payload.notification?.title || "New Notification";
    
    let actions = [];
    if (payload.data?.actions) {
      try {
        actions = JSON.parse(payload.data.actions);
      } catch (e) {
        console.error("Failed to parse actions:", e);
      }
    }

    const notificationOptions = {
      body: payload.notification?.body || "",
      icon: payload.notification?.icon || "/icon.svg", 
      badge: payload.data?.badge || "/icon.svg",
      image: payload.notification?.image || payload.data?.image,
      vibrate: payload.data?.vibrate ? JSON.parse(payload.data.vibrate) : [200, 100, 200],
      sound: payload.data?.sound || "/sounds/notification-chime.mp3",
      tag: payload.data?.tag || payload.notification?.tag,
      renotify: payload.data?.renotify === 'true' || true,
      data: { url: link },
      actions: actions,
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  });
} else {
  console.warn(
    "[firebase-messaging-sw.js] Service worker was registered without dynamic Firebase configuration query params."
  );
}

self.addEventListener("notificationclick", (event) => {
  console.log("[firebase-messaging-sw.js] Notification click received.");

  event.notification.close();

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        let url = event.notification.data?.url;

        if (event.action) {
          console.log("[firebase-messaging-sw.js] Action clicked:", event.action);
          if (url) {
            const urlObj = new URL(url, self.location.origin);
            urlObj.searchParams.set('action', event.action);
            url = urlObj.toString();
          } else {
            url = '/' + event.action;
          }
        }

        if (!url) return;

        // If the tab is already open with the URL, focus it
        for (const client of clientList) {
          if (client.url === url && "focus" in client) {
            return client.focus();
          }
        }

        // Otherwise open a new tab
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});