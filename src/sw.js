workbox.skipWaiting();
workbox.clientsClaim();

// Precache files
workbox.precaching.precacheAndRoute(self.__precacheManifest || []);
workbox.routing.registerNavigationRoute('/index.html');

// Enable offline Google Analytics.
workbox.googleAnalytics.initialize();

// Cache the Google Fonts stylesheets
workbox.routing.registerRoute(
  /^https:\/\/fonts\.googleapis\.com/,
  workbox.strategies.staleWhileRevalidate({
    cacheName: 'google-fonts-stylesheets',
  })
);

// Cache the underlying font files
workbox.routing.registerRoute(
  /^https:\/\/fonts\.gstatic\.com/,
  workbox.strategies.cacheFirst({
    cacheName: 'google-fonts-webfonts',
    plugins: [
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      }),
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60 * 60 * 24 * 365,
        maxEntries: 30,
      }),
    ],
  })
);

// Cache images
workbox.routing.registerRoute(
  /\.(?:png|gif|jpg|jpeg|svg)$/,
  workbox.strategies.cacheFirst({
    cacheName: 'images',
    plugins: [
      new workbox.expiration.Plugin({
        maxAgeSeconds: 60, // Temp very short
        maxEntries: 60,
      }),
    ],
  })
);
