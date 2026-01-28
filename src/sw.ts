/// <reference lib="webworker" />

const CACHE_NAME = 'ppl-erp-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/manifest.json',
    '/favicon.svg',
    '/logo.svg'
];

const sw = self as unknown as ServiceWorkerGlobalScope;

sw.addEventListener('install', (event: ExtendableEvent) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

sw.addEventListener('fetch', (event: FetchEvent) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        }) as Promise<Response>
    );
});

sw.addEventListener('notificationclick', (event: NotificationEvent) => {
    event.notification.close();
    const url = event.notification.data?.url || '/';

    event.waitUntil(
        sw.clients.matchAll({ type: 'window' }).then((clientList) => {
            for (const client of clientList) {
                if (client.url === url && 'focus' in client) {
                    return (client as WindowClient).focus();
                }
            }
            if (sw.clients.openWindow) {
                return sw.clients.openWindow(url);
            }
        }) as Promise<any>
    );
});

sw.addEventListener('periodicsync', (event: any) => {
    if (event.tag === 'check-notifications') {
        // Background evaluation logic
    }
});
