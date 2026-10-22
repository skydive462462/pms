// Service worker for push alerts (Firebase Cloud Messaging).
// Keep this file in the SAME folder as index.html on GitHub Pages.
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCGOOMCav0We0qowk-9NBDSWzYn0rrPzKo",
  authDomain: "securityfix-1e746.firebaseapp.com",
  projectId: "securityfix-1e746",
  storageBucket: "securityfix-1e746.firebasestorage.app",
  messagingSenderId: "312289265846",
  appId: "1:312289265846:web:819676da7008d15546fe17"
});

const messaging = firebase.messaging();

// The server sends DATA-ONLY messages (title/body/tag/urgent live in payload.data),
// so the browser never shows its own copy and this is the only place that
// displays the notification: no duplicates.
messaging.onBackgroundMessage((payload) => {
  const d = payload.data || {};

  return self.registration.showNotification(d.title || 'Patient monitor alert', {
    body: d.body || '',
    tag: d.tag || 'vitals',          // same tag = a repeat replaces the previous one
    renotify: true,                  // ...but still alerts again
    requireInteraction: d.urgent === '1'  // emergencies stay on screen until dismissed
  });
});

// Tapping the notification opens (or focuses) the dashboard.
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if ('focus' in client) {
          return client.focus();
        }
      }
      return self.clients.openWindow(self.registration.scope);
    })
  );
});
