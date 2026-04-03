self.addEventListener("fetch", (event) => {

  // 🌦️ Tratamento da API
  if (event.request.url.includes("api.open-meteo.com")) {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // 🔥 Retorna resposta válida mesmo offline
          return new Response(
            JSON.stringify({
              erro: "Sem conexão",
              current_weather: null
            }),
            {
              headers: { "Content-Type": "application/json" }
            }
          );
        })
    );
    return;
  }

  // 📦 Cache normal
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
      .catch(() => {
        return caches.match("/index.html");
      })
  );
});

const CACHE_NAME = "clima-app-v2";

const urlsToCache = [
  "/",
  "/index.html",
  "/css/style.css",
  "/js/script.js",
  "/img/image.png"
];

// Instalação
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Ativação
self.addEventListener("activate", () => {
  console.log("Service Worker ativo");
});

// Intercepta requisições
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Se tiver no cache → usa
        if (response) {
          return response;
        }

        // Senão tenta buscar na internet
        return fetch(event.request)
          .then((networkResponse) => {
            return networkResponse;
          })
          .catch(() => {
            // Fallback (quando offline)
            if (event.request.destination === "document") {
              return caches.match("/index.html");
            }
          });
      })
  );
});

