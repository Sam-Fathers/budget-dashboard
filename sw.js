// Minimal offline app-shell cache for Budget Dashboard.
// Deliberately never caches Supabase requests - your financial data must
// always come from the network, never a stale cached copy.
const CACHE_NAME = 'budget-dashboard-v1';
const ASSETS = ['./budget_dashboard.html', './icon-192.png', './icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = event.request.url;
  // Always hit the network for Supabase - never serve budget data from cache.
  if (url.includes('supabase.co') || url.includes('supabase.com')) return;
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
