// v2 : la v1 mettait TOUT en cache-first, y compris /api/* — un visiteur qui revient sur le site
// (donc avec le service worker déjà actif) aurait vu le statut de sa commande figé sur "en
// attente" indéfiniment, le polling de confirmation de paiement recevant toujours la première
// réponse mise en cache plutôt que l'état réel. Voir PaymentResult / getOrderClient.
const CACHE_NAME = "mouslih-academy-v2";
const STATIC_ASSETS = ["/manifest.json", "/icon-192.svg", "/icon-512.svg"];

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      caches
        .keys()
        .then((names) => Promise.all(names.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name)))),
      self.clients.claim(),
    ])
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Jamais de cache pour les appels API : les données de commande, paiement et progression
  // doivent toujours venir du réseau.
  if (url.pathname.startsWith("/api/")) return;

  if (STATIC_ASSETS.includes(url.pathname)) {
    event.respondWith(caches.match(request).then((cached) => cached || fetch(request)));
    return;
  }

  // Pages et autres assets : réseau d'abord (contenu toujours à jour), cache en repli seulement
  // hors-ligne.
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});
