importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js');

const { registerRoute } = workbox.routing;
const { NetworkFirst, CacheFirst, StaleWhileRevalidate } = workbox.strategies;

// NOTE: precacheAndRoute is intentionally omitted — this project does not use
// workbox-cli or vite-plugin-pwa to inject __WB_MANIFEST at build time.

// Route for API calls (Network First, falling back to cache if offline)
registerRoute(
    ({url}) => url.pathname.startsWith('/api/'),
    new NetworkFirst({
        cacheName: 'api-cache',
    })
);

// Route for assets (Cache First)
registerRoute(
    ({request}) => request.destination === 'image' || request.destination === 'audio',
    new CacheFirst({
        cacheName: 'assets-cache',
    })
);

// Default route for pages
registerRoute(
    ({request}) => request.destination === 'document' || request.destination === 'script' || request.destination === 'style',
    new StaleWhileRevalidate({
        cacheName: 'app-shell',
    })
);

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});
