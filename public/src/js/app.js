const manifest = {
        "name": "Progressive Selfies",
        "short_name": "PWA Selfies",
        "icons": [
            {
                "src": "src/images/icons/app-icon-48x48.png",
                "type": "image/png",
                "sizes": "48x48"
            },
            {
                "src": "src/images/icons/app-icon-512x512.png",
                "type": "image/png",
                "sizes": "512x512"
            }
        ],
        // "start_url": "/index.html",
        // "scope": ".",
        "display": "standalone",
        "orientation": "portrait-primary",
        "background_color": "#fff",
        "theme_color": "#3f51b5",
        "description": "Take selfies PWA style.",
        "dir": "ltr",
        "lang": "en-US"
    }
;
// Replace { ... } with the content of the manifest.json file and remove the "start_url" and "scope” !!! window.addEventListener('load', () => {
window.addEventListener('load', () => {
    const base = document.querySelector('base');
    let baseUrl = base && base.href || '';
    if (!baseUrl.endsWith('/')) {
        baseUrl = `${baseUrl}/`;
    }
    manifest['start_url'] = `${baseUrl}index.html`;
    manifest.icons.forEach(icon => {
        icon.src = `${baseUrl}${icon.src}`;
    });
    const stringManifest = JSON.stringify(manifest);
    const blob = new Blob([stringManifest], {type: 'application/json'});
    const manifestURL = URL.createObjectURL(blob);
    document.querySelector('#manifestPlaceholder').setAttribute('href', manifestURL);

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register(`${baseUrl}sw.js`)
            .then(registration => {
                // Registration was successful
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            })
            .catch(err => {
                // registration failed :(
                console.log('ServiceWorker registration failed: ', err);
            });
    }
});

const CACHE_STATIC_NAME = 'static';
const URLS_TO_PRECACHE = [
    '/',
    'index.html',
    'src/js/app.js',
    'src/js/feed.js',
    'src/lib/material.min.js',
    'src/css/app.css',
    'src/css/feed.css',
    'src/images/main-image.jpg',
    'https://fonts.googleapis.com/css?family=Roboto:400,700', 'https://fonts.googleapis.com/icon?family=Material+Icons',
    // 'https://code.getmdl.io/1.3.0/material.indigo-deep_orange.min.css"'
];
self.addEventListener('install', event => {
    console.log('[Service Worker] Installing Service Worker ...', event);
    event.waitUntil(
        caches.open(CACHE_STATIC_NAME).then(cache => {
            console.log('[Service Worker] Precaching App Shell');
            cache.addAll(URLS_TO_PRECACHE);
        })
            .then(() => {
                console.log('[ServiceWorker] Skip waiting on install');
                return self.skipWaiting();
            }));
});
