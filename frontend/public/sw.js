/* MediHelp Service Worker v1.5.0 */
const CACHE_NAME = 'medihelp-v1.5.0';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/src/main.tsx',
  '/src/index.css',
  '/src/App.tsx'
];

// Install Event - Pre-cache core application shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[MediHelp Service Worker] Pre-caching Core App Shell');
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[MediHelp Service Worker] Pre-cache partial failure:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate Event - Clean up stale cache versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[MediHelp Service Worker] Removing Stale Cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Hybrid Caching Strategy (NetworkFirst with Cache Fallback)
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests or browser extension requests
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Cache successful HTTP responses for offline availability
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(async () => {
        console.log('[MediHelp Service Worker] Network failure, attempting offline cache fallback for:', event.request.url);
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }

        // Fallback to index.html for navigation requests when offline
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html') || caches.match('/');
        }

        return new Response('MediHelp Offline: Requested resource unavailable', {
          status: 533,
          statusText: 'Service Unavailable Offline'
        });
      })
  );
});

// Background Sync Event - Sync offline pending actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-medihelp-offline-queue') {
    console.log('[MediHelp Service Worker] Background sync triggered for offline queue');
    event.waitUntil(
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({ type: 'EXECUTE_OFFLINE_SYNC' });
        });
      })
    );
  }
});

// Web Push Notification Listener
self.addEventListener('push', (event) => {
  let data = { title: 'MediHelp Health Alert', body: 'You have a medication dose reminder.' };
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: '/assets/icon-192.png',
    badge: '/assets/icon-192.png',
    vibrate: [200, 100, 200],
    data: data.url || '/',
    actions: [
      { action: 'open', title: 'Open MediHelp' },
      { action: 'dismiss', title: 'Dismiss' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification Click Handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow(event.notification.data || '/')
    );
  }
});
