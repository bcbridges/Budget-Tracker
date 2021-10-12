const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/styles.css",
  "/index.js",
  "/mainifest.webmanifest",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
];

// need version control
const CACHE_NAME = "pwabudgetapp-static-cache-v1";
const DATA_CACHE_NAME = "pwabudgetapp-data-cache-v1";

// need to cache files upon install
self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Your files were cached");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});
