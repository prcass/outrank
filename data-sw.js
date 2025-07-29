/**
 * Service Worker for Know-It-All Game Data Lazy Loading
 * Provides offline support and intelligent caching for data chunks
 * 
 * @version 1.0.0
 */

const CACHE_NAME = 'know-it-all-data-v1.0.0';
const CORE_CACHE_NAME = 'know-it-all-core-v1.0.0';

// Resources to cache immediately
const CORE_RESOURCES = [
    './',
    './index.html',
    './game.js',
    './data-loader.js',
    './styles.css',
    './data/core.json'
];

// Data files that can be cached on-demand
const DATA_PATTERNS = [
    /\/data\/.*\.json$/,
    /\/data\/.*-production\.json$/,
    /\/data\/.*-40\.json$/,
    /\/data\/.*-200\.json$/
];

// Cache strategies
const CACHE_STRATEGIES = {
    core: 'cache-first',
    data: 'network-first',
    fallback: 'cache-only'
};

self.addEventListener('install', event => {
    console.log('🔧 Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(CORE_CACHE_NAME)
            .then(cache => {
                console.log('📦 Service Worker: Caching core resources');
                return cache.addAll(CORE_RESOURCES);
            })
            .then(() => {
                console.log('✅ Service Worker: Core resources cached');
                self.skipWaiting();
            })
            .catch(error => {
                console.error('❌ Service Worker: Core caching failed', error);
            })
    );
});

self.addEventListener('activate', event => {
    console.log('🚀 Service Worker: Activating...');
    
    event.waitUntil(
        Promise.all([
            // Clean up old caches
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== CACHE_NAME && cacheName !== CORE_CACHE_NAME) {
                            console.log('🗑️ Service Worker: Deleting old cache', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            }),
            // Take control of all clients
            self.clients.claim()
        ])
    );
});

self.addEventListener('fetch', event => {
    const request = event.request;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Handle different types of requests
    if (isCoreResource(url.pathname)) {
        event.respondWith(handleCoreRequest(request));
    } else if (isDataResource(url.pathname)) {
        event.respondWith(handleDataRequest(request));
    } else {
        event.respondWith(handleGenericRequest(request));
    }
});

/**
 * Check if the resource is a core resource
 */
function isCoreResource(pathname) {
    return CORE_RESOURCES.some(resource => {
        if (resource === './') return pathname === '/';
        return pathname.includes(resource.replace('./', ''));
    });
}

/**
 * Check if the resource is a data resource
 */
function isDataResource(pathname) {
    return DATA_PATTERNS.some(pattern => pattern.test(pathname));
}

/**
 * Handle core resource requests (cache-first strategy)
 */
async function handleCoreRequest(request) {
    try {
        const cache = await caches.open(CORE_CACHE_NAME);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            console.log('📦 Service Worker: Core resource from cache', request.url);
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
            console.log('🌐 Service Worker: Core resource from network + cached', request.url);
        }
        
        return networkResponse;
        
    } catch (error) {
        console.error('❌ Service Worker: Core request failed', error);
        
        // Try to return cached version as fallback
        const cache = await caches.open(CORE_CACHE_NAME);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            console.log('🔄 Service Worker: Fallback to cached core resource', request.url);
            return cachedResponse;
        }
        
        throw error;
    }
}

/**
 * Handle data resource requests (network-first strategy)
 */
async function handleDataRequest(request) {
    try {
        // Try network first for data files to get latest version
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
            console.log('🌐 Service Worker: Data from network + cached', request.url);
            return networkResponse;
        }
        
        throw new Error(`Network response not ok: ${networkResponse.status}`);
        
    } catch (error) {
        console.warn('⚠️ Service Worker: Network failed for data, trying cache', error.message);
        
        // Fallback to cache
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            console.log('📦 Service Worker: Data from cache (offline)', request.url);
            return cachedResponse;
        }
        
        // Return offline fallback
        console.error('❌ Service Worker: No cached data available', request.url);
        return createOfflineFallback(request);
    }
}

/**
 * Handle generic requests
 */
async function handleGenericRequest(request) {
    try {
        return await fetch(request);
    } catch (error) {
        console.warn('⚠️ Service Worker: Generic request failed', request.url);
        return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
    }
}

/**
 * Create offline fallback response for data requests
 */
function createOfflineFallback(request) {
    const url = new URL(request.url);
    const filename = url.pathname.split('/').pop();
    
    // Create minimal fallback data structure
    let fallbackData = {
        prompts: [],
        items: {},
        meta: {
            offline: true,
            message: 'This data is currently unavailable offline',
            timestamp: new Date().toISOString()
        }
    };
    
    // Add category-specific fallback if possible
    if (filename.includes('countries')) {
        fallbackData.meta.category = 'countries';
        fallbackData.meta.icon = '🌍';
    } else if (filename.includes('movies')) {
        fallbackData.meta.category = 'movies';
        fallbackData.meta.icon = '🎬';
    } else if (filename.includes('sports')) {
        fallbackData.meta.category = 'sports';
        fallbackData.meta.icon = '🏈';
    } else if (filename.includes('companies')) {
        fallbackData.meta.category = 'companies';
        fallbackData.meta.icon = '🏢';
    }
    
    return new Response(JSON.stringify(fallbackData), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
            'X-Offline-Fallback': 'true'
        }
    });
}

// Listen for messages from the main thread
self.addEventListener('message', event => {
    const { type, payload } = event.data;
    
    switch (type) {
        case 'CACHE_DATA':
            handleCacheDataRequest(payload, event.ports[0]);
            break;
        case 'GET_CACHE_STATUS':
            handleGetCacheStatus(event.ports[0]);
            break;
        case 'CLEAR_CACHE':
            handleClearCache(event.ports[0]);
            break;
        default:
            console.warn('🤷‍♂️ Service Worker: Unknown message type', type);
    }
});

/**
 * Handle cache data request from main thread
 */
async function handleCacheDataRequest(payload, port) {
    try {
        const { urls } = payload;
        const cache = await caches.open(CACHE_NAME);
        
        const results = await Promise.allSettled(
            urls.map(async url => {
                const response = await fetch(url);
                if (response.ok) {
                    await cache.put(url, response.clone());
                    return { url, success: true };
                }
                throw new Error(`Failed to fetch ${url}`);
            })
        );
        
        const successful = results.filter(r => r.status === 'fulfilled').length;
        
        port.postMessage({
            success: true,
            cached: successful,
            total: urls.length
        });
        
    } catch (error) {
        port.postMessage({
            success: false,
            error: error.message
        });
    }
}

/**
 * Handle cache status request
 */
async function handleGetCacheStatus(port) {
    try {
        const coreCache = await caches.open(CORE_CACHE_NAME);
        const dataCache = await caches.open(CACHE_NAME);
        
        const coreKeys = await coreCache.keys();
        const dataKeys = await dataCache.keys();
        
        port.postMessage({
            success: true,
            coreCache: coreKeys.length,
            dataCache: dataKeys.length,
            totalCached: coreKeys.length + dataKeys.length
        });
        
    } catch (error) {
        port.postMessage({
            success: false,
            error: error.message
        });
    }
}

/**
 * Handle clear cache request
 */
async function handleClearCache(port) {
    try {
        await Promise.all([
            caches.delete(CACHE_NAME),
            caches.delete(CORE_CACHE_NAME)
        ]);
        
        port.postMessage({
            success: true,
            message: 'All caches cleared'
        });
        
    } catch (error) {
        port.postMessage({
            success: false,
            error: error.message
        });
    }
}

console.log('📡 Service Worker: Script loaded and ready');