/**
 * Loading UI Components for Know-It-All Game Data Lazy Loading
 * Provides visual feedback during data loading operations
 * 
 * @version 1.0.0
 */

window.LoadingUI = (function() {
    'use strict';

    // Loading UI state
    let activeLoaders = new Set();
    let loadingContainer = null;

    /**
     * Initialize the loading UI system
     */
    function init() {
        createLoadingContainer();
        setupEventListeners();
        console.log('✅ LoadingUI initialized');
    }

    /**
     * Create the main loading container
     */
    function createLoadingContainer() {
        loadingContainer = document.createElement('div');
        loadingContainer.id = 'data-loading-container';
        loadingContainer.className = 'data-loading-container';
        loadingContainer.innerHTML = `
            <div class="loading-backdrop"></div>
            <div class="loading-content">
                <div id="loading-main" class="loading-card main-loader" style="display: none;">
                    <div class="loading-spinner"></div>
                    <div class="loading-text">Loading game data...</div>
                    <div class="loading-progress">
                        <div class="progress-bar">
                            <div class="progress-fill"></div>
                        </div>
                        <div class="progress-text">0%</div>
                    </div>
                </div>
                <div id="loading-categories" class="category-loaders"></div>
            </div>
        `;
        
        document.body.appendChild(loadingContainer);
        
        // Add CSS if not already present
        if (!document.getElementById('loading-ui-styles')) {
            addLoadingStyles();
        }
    }

    /**
     * Add CSS styles for loading UI
     */
    function addLoadingStyles() {
        const style = document.createElement('style');
        style.id = 'loading-ui-styles';
        style.textContent = `
            .data-loading-container {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 10000;
                display: none;
                align-items: center;
                justify-content: center;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }

            .data-loading-container.active {
                display: flex;
            }

            .loading-backdrop {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(4px);
            }

            .loading-content {
                position: relative;
                max-width: 400px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                z-index: 1;
            }

            .loading-card {
                background: white;
                border-radius: 12px;
                padding: 24px;
                margin-bottom: 16px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                text-align: center;
                opacity: 0;
                transform: translateY(20px);
                animation: slideInUp 0.3s ease forwards;
            }

            .loading-card.main-loader {
                border: 2px solid #1a73e8;
            }

            .loading-card.category-loader {
                border-left: 4px solid #009688;
                background: #f8f9fa;
            }

            .loading-card.error {
                border-left-color: #d32f2f;
                background: #ffebee;
            }

            .loading-card.success {
                border-left-color: #388e3c;
                background: #e8f5e8;
            }

            @keyframes slideInUp {
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .loading-spinner {
                width: 40px;
                height: 40px;
                margin: 0 auto 16px;
                border: 3px solid #e0e0e0;
                border-top: 3px solid #1a73e8;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }

            .category-loader .loading-spinner {
                width: 24px;
                height: 24px;
                border-width: 2px;
                margin-bottom: 8px;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            .loading-text {
                font-size: 16px;
                font-weight: 500;
                color: #333;
                margin-bottom: 16px;
            }

            .category-loader .loading-text {
                font-size: 14px;
                margin-bottom: 8px;
            }

            .loading-progress {
                margin-top: 16px;
            }

            .progress-bar {
                width: 100%;
                height: 8px;
                background: #e0e0e0;
                border-radius: 4px;
                overflow: hidden;
                margin-bottom: 8px;
            }

            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #1a73e8, #009688);
                border-radius: 4px;
                width: 0%;
                transition: width 0.3s ease;
            }

            .progress-text {
                font-size: 12px;
                color: #666;
                font-weight: 500;
            }

            .category-icon {
                font-size: 24px;
                margin-bottom: 8px;
                display: block;
            }

            .success-icon {
                color: #388e3c;
                font-size: 20px;
                margin-right: 8px;
            }

            .error-icon {
                color: #d32f2f;
                font-size: 20px;
                margin-right: 8px;
            }

            .retry-button {
                background: #1a73e8;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 6px;
                font-size: 12px;
                font-weight: 500;
                cursor: pointer;
                margin-top: 8px;
                transition: background 0.2s ease;
            }

            .retry-button:hover {
                background: #1557b0;
            }

            .close-button {
                position: absolute;
                top: 8px;
                right: 8px;
                background: none;
                border: none;
                font-size: 20px;
                color: #666;
                cursor: pointer;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background 0.2s ease;
            }

            .close-button:hover {
                background: #f0f0f0;
            }

            /* Mobile responsive */
            @media (max-width: 480px) {
                .loading-content {
                    width: 95%;
                    max-width: none;
                }
                
                .loading-card {
                    padding: 20px;
                    margin-bottom: 12px;
                }
                
                .loading-text {
                    font-size: 14px;
                }
            }
        `;
        
        document.head.appendChild(style);
    }

    /**
     * Setup event listeners for data loading events
     */
    function setupEventListeners() {
        window.addEventListener('dataLoaderEvent', handleDataLoaderEvent);
        
        // Close loading UI when clicking backdrop
        document.addEventListener('click', event => {
            if (event.target.classList.contains('loading-backdrop')) {
                hideLoadingUI();
            }
        });
    }

    /**
     * Handle data loader events
     */
    function handleDataLoaderEvent(event) {
        const { category, type, data } = event.detail;
        
        switch (type) {
            case 'loading':
                showCategoryLoader(category);
                break;
            case 'progress':
                updateCategoryProgress(category, data);
                break;
            case 'loaded':
                showCategorySuccess(category, data);
                setTimeout(() => hideCategoryLoader(category), 1500);
                break;
            case 'error':
                showCategoryError(category, data);
                break;
        }
    }

    /**
     * Show main loading UI
     */
    function showMainLoader(text = 'Loading game data...', showProgress = true) {
        if (!loadingContainer) {
            init();
        }
        
        const mainLoader = document.getElementById('loading-main');
        const loadingText = mainLoader.querySelector('.loading-text');
        const progressContainer = mainLoader.querySelector('.loading-progress');
        
        loadingText.textContent = text;
        progressContainer.style.display = showProgress ? 'block' : 'none';
        
        mainLoader.style.display = 'block';
        loadingContainer.classList.add('active');
        
        activeLoaders.add('main');
        
        console.log('🔄 LoadingUI: Main loader shown');
    }

    /**
     * Update main loader progress
     */
    function updateMainProgress(progress, text = null) {
        const mainLoader = document.getElementById('loading-main');
        const progressFill = mainLoader.querySelector('.progress-fill');
        const progressText = mainLoader.querySelector('.progress-text');
        const loadingText = mainLoader.querySelector('.loading-text');
        
        if (progressFill) {
            progressFill.style.width = `${Math.min(100, Math.max(0, progress))}%`;
        }
        
        if (progressText) {
            progressText.textContent = `${Math.round(progress)}%`;
        }
        
        if (text && loadingText) {
            loadingText.textContent = text;
        }
    }

    /**
     * Hide main loader
     */
    function hideMainLoader() {
        const mainLoader = document.getElementById('loading-main');
        mainLoader.style.display = 'none';
        
        activeLoaders.delete('main');
        
        if (activeLoaders.size === 0) {
            loadingContainer.classList.remove('active');
        }
        
        console.log('✅ LoadingUI: Main loader hidden');
    }

    /**
     * Show category loader
     */
    function showCategoryLoader(categoryName) {
        if (!loadingContainer) {
            init();
        }
        
        const categoryContainer = document.getElementById('loading-categories');
        let categoryLoader = document.getElementById(`loader-${categoryName}`);
        
        if (!categoryLoader) {
            categoryLoader = createCategoryLoader(categoryName);
            categoryContainer.appendChild(categoryLoader);
        }
        
        categoryLoader.className = 'loading-card category-loader';
        categoryLoader.innerHTML = getCategoryLoaderHTML(categoryName, 'loading');
        
        loadingContainer.classList.add('active');
        activeLoaders.add(categoryName);
        
        console.log(`🔄 LoadingUI: ${categoryName} loader shown`);
    }

    /**
     * Create category loader element
     */
    function createCategoryLoader(categoryName) {
        const loader = document.createElement('div');
        loader.id = `loader-${categoryName}`;
        loader.className = 'loading-card category-loader';
        return loader;
    }

    /**
     * Get category loader HTML
     */
    function getCategoryLoaderHTML(categoryName, state, data = {}) {
        const icons = {
            countries: '🌍',
            movies: '🎬',
            sports: '🏈',
            companies: '🏢'
        };
        
        const icon = icons[categoryName] || '📊';
        const displayName = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
        
        switch (state) {
            case 'loading':
                return `
                    <span class="category-icon">${icon}</span>
                    <div class="loading-spinner"></div>
                    <div class="loading-text">Loading ${displayName}...</div>
                    <div class="loading-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: 0%"></div>
                        </div>
                        <div class="progress-text">0%</div>
                    </div>
                `;
            
            case 'success':
                const itemCount = data.items ? Object.keys(data.items).length : 0;
                const promptCount = data.prompts ? data.prompts.length : 0;
                return `
                    <span class="category-icon">${icon}</span>
                    <span class="success-icon">✅</span>
                    <div class="loading-text">${displayName} loaded!</div>
                    <div class="progress-text">${itemCount} items, ${promptCount} challenges</div>
                `;
            
            case 'error':
                return `
                    <span class="category-icon">${icon}</span>
                    <span class="error-icon">❌</span>
                    <div class="loading-text">Failed to load ${displayName}</div>
                    <div class="progress-text">${data.error || 'Unknown error'}</div>
                    <button class="retry-button" onclick="LoadingUI.retryCategory('${categoryName}')">
                        Retry
                    </button>
                `;
            
            default:
                return '';
        }
    }

    /**
     * Update category progress
     */
    function updateCategoryProgress(categoryName, data) {
        const loader = document.getElementById(`loader-${categoryName}`);
        if (!loader) return;
        
        const progressFill = loader.querySelector('.progress-fill');
        const progressText = loader.querySelector('.progress-text');
        
        if (progressFill && data.progress !== undefined) {
            progressFill.style.width = `${data.progress}%`;
        }
        
        if (progressText && data.loaded && data.total) {
            const kbLoaded = Math.round(data.loaded / 1024);
            const kbTotal = Math.round(data.total / 1024);
            progressText.textContent = `${kbLoaded}KB / ${kbTotal}KB`;
        }
    }

    /**
     * Show category success
     */
    function showCategorySuccess(categoryName, data) {
        const loader = document.getElementById(`loader-${categoryName}`);
        if (!loader) return;
        
        loader.className = 'loading-card category-loader success';
        loader.innerHTML = getCategoryLoaderHTML(categoryName, 'success', data);
        
        console.log(`✅ LoadingUI: ${categoryName} success shown`);
    }

    /**
     * Show category error
     */
    function showCategoryError(categoryName, data) {
        const loader = document.getElementById(`loader-${categoryName}`);
        if (!loader) return;
        
        loader.className = 'loading-card category-loader error';
        loader.innerHTML = getCategoryLoaderHTML(categoryName, 'error', data);
        
        console.log(`❌ LoadingUI: ${categoryName} error shown`);
    }

    /**
     * Hide category loader
     */
    function hideCategoryLoader(categoryName) {
        const loader = document.getElementById(`loader-${categoryName}`);
        if (loader) {
            loader.remove();
        }
        
        activeLoaders.delete(categoryName);
        
        if (activeLoaders.size === 0) {
            loadingContainer.classList.remove('active');
        }
        
        console.log(`✅ LoadingUI: ${categoryName} loader hidden`);
    }

    /**
     * Hide all loading UI
     */
    function hideLoadingUI() {
        if (loadingContainer) {
            loadingContainer.classList.remove('active');
        }
        
        activeLoaders.clear();
        
        // Clear all category loaders
        const categoryContainer = document.getElementById('loading-categories');
        if (categoryContainer) {
            categoryContainer.innerHTML = '';
        }
        
        console.log('✅ LoadingUI: All loaders hidden');
    }

    /**
     * Retry loading a category
     */
    function retryCategory(categoryName) {
        hideCategoryLoader(categoryName);
        
        // Trigger retry through DataLoader
        if (window.DataLoader) {
            window.DataLoader.loadCategory(categoryName).catch(error => {
                console.error(`Failed to retry ${categoryName}:`, error);
            });
        }
    }

    /**
     * Show a simple toast message
     */
    function showToast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `loading-toast ${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#d32f2f' : type === 'success' ? '#388e3c' : '#1a73e8'};
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            z-index: 10001;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
            max-width: 300px;
        `;
        
        document.body.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(0)';
        }, 10);
        
        // Animate out and remove
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    // Public API
    return {
        init,
        showMainLoader,
        updateMainProgress,
        hideMainLoader,
        showCategoryLoader,
        updateCategoryProgress,
        showCategorySuccess,
        showCategoryError,
        hideCategoryLoader,
        hideLoadingUI,
        retryCategory,
        showToast
    };
})();

// Auto-initialize when script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.LoadingUI.init());
} else {
    window.LoadingUI.init();
}

console.log('🎨 LoadingUI module loaded - ready for initialization');