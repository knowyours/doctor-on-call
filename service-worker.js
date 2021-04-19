const cacheName = "v1";

// Install Event
self.addEventListener("install", (e) => {
    console.log("Service Worker INSTALLED");
});

// Activate Event
self.addEventListener("activate", (e) => {
    console.log("Service Worker ACTIVATED");
});

// Fetch Event
self.addEventListener("fetch", (e) => {
    console.log("Fetching From Source");
    e.respondWith(
        fetch(e.request)
            .then((res) => {
                // Clone the Response - since put() will consume it and nothing will be left to respond
                const resClone = res.clone();
                // Open Cache
                caches
                    .open(cacheName)
                    .then((cache) => {
                        // Add Request/Response pair to cache
                        cache.put(e.request, resClone);
                    })
                    .catch((err) => console.error(err));
                // Return with Response
                return res;
            })
            .catch((err) => {
                console.log(
                    "Error Occurred in Fetch --> Responding from Cache"
                );
                // Find appropriate cached response for this request
                caches.match(e.request).then((res) => {
                    return res;
                });
            })
    );
});
