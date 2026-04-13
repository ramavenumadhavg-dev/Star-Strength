// ── STEP 1: Replace these with YOUR Firebase project config values ──────────
// Get these from: Firebase Console → Project Settings → General → Your apps
var FIREBASE_CONFIG = {
  apiKey:            "AIzaSyBAMCLQxhsuF05WqwTOiAmf1bgz3cJPLAY",
  authDomain:        "star-strength.firebaseapp.com",
  projectId:         "star-strength",
  storageBucket:     "star-strength.firebasestorage.app",
  messagingSenderId: "774592264076",
  appId:             "1:774592264076:web:9a5c90c2644632cd72c8a9"
};
// ────────────────────────────────────────────────────────────────────────────

importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

firebase.initializeApp(FIREBASE_CONFIG);
var messaging = firebase.messaging();

// Handle background notifications (when app is closed or in background)
messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Background message received:', payload);

  var notificationTitle = payload.notification.title || '🌙 Today\'s Tarabalam';
  var notificationOptions = {
    body:  payload.notification.body  || 'Check your star strength for today!',
    icon:  '/icon-192.png',   // your app icon path
    badge: '/icon-192.png',
    tag:   'tarabalam-daily', // replaces old notification so only one shows
    data:  payload.data || {},
    actions: [
      { action: 'open', title: 'View Tarabalam' }
    ]
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// When user taps the notification, open the app
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      // If app is already open, focus it
      for (var i = 0; i < clientList.length; i++) {
        var client = clientList[i];
        if (client.url && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise open a new window
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});
