/**
 * Know-It-All Game Core Data Structure
 * Lightweight replacement for the 464KB data.js file
 * Provides minimal structure and lazy loading integration
 * 
 * @version 1.0.0 - Lazy Loading Edition
 * @author Claude Code Assistant
 */

console.log('📦 Loading Know-It-All Core Data Structure v1.0.0...');

// Initialize the minimal game data structure
window.GAME_DATA = {
    meta: {
        version: "5.2-lazy",
        timestamp: "2025-07-28T00:00:00Z",
        loadingMode: "lazy",
        originalSize: "464KB",
        coreSize: "~5KB",
        categories: ["countries", "movies", "sports", "companies"],
        loadedCategories: [],
        totalSize: 0
    },
    
    categories: {
        countries: {
            name: "Countries",
            icon: "🌍",
            prompts: [],
            items: {},
            meta: {
                expectedItems: 40,
                expectedPrompts: 20,
                dataSize: "72KB",
                status: "not_loaded"
            }
        },
        
        movies: {
            name: "Movies", 
            icon: "🎬",
            prompts: [],
            items: {},
            meta: {
                expectedItems: 40,
                expectedPrompts: 15,
                dataSize: "78KB",
                status: "not_loaded"
            }
        },
        
        sports: {
            name: "Sports Teams",
            icon: "🏈", 
            prompts: [],
            items: {},
            meta: {
                expectedItems: 124,
                expectedPrompts: 22,
                dataSize: "161KB",
                status: "not_loaded"
            }
        },
        
        companies: {
            name: "Companies",
            icon: "🏢",
            prompts: [],
            items: {},
            meta: {
                expectedItems: 40,
                expectedPrompts: 25,
                dataSize: "140KB", 
                status: "not_loaded"
            }
        }
    }
};

// Enhanced utility function for lazy loading compatibility
window.getRandomItems = function(category, count) {
    const categoryData = window.GAME_DATA.categories[category];
    
    if (!categoryData || !categoryData.items) {
        console.warn(`⚠️ Category ${category} not found or not loaded`);
        return [];
    }
    
    const items = Object.values(categoryData.items);
    
    if (items.length === 0) {
        console.warn(`⚠️ No items available for category ${category}`);
        
        // If not loaded yet, try to trigger loading
        if (window.DataLoader && categoryData.meta.status === 'not_loaded') {
            console.log(`🔄 Auto-loading ${category} data...`);
            window.DataLoader.loadCategory(category).catch(error => {
                console.error(`❌ Auto-load failed for ${category}:`, error);
            });
        }
        
        return [];
    }
    
    // Shuffle and return requested count
    const shuffled = items.slice().sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
};

// Enhanced category loading status functions
window.isCategoryLoaded = function(category) {
    const categoryData = window.GAME_DATA.categories[category];
    return categoryData && 
           categoryData.meta.status === 'loaded' &&
           Object.keys(categoryData.items).length > 0;
};

window.getCategoryStatus = function(category) {
    const categoryData = window.GAME_DATA.categories[category];
    if (!categoryData) return 'unknown';
    
    return {
        status: categoryData.meta.status || 'not_loaded',
        itemCount: Object.keys(categoryData.items).length,
        promptCount: categoryData.prompts.length,
        expectedItems: categoryData.meta.expectedItems,
        expectedPrompts: categoryData.meta.expectedPrompts
    };
};

// Load category with UI feedback
window.loadCategoryWithUI = async function(category) {
    try {
        // Show loading UI
        if (window.LoadingUI) {
            window.LoadingUI.showCategoryLoader(category);
        }
        
        // Load the data
        if (window.DataLoader) {
            const data = await window.DataLoader.loadCategory(category);
            
            // Show success
            if (window.LoadingUI) {
                window.LoadingUI.showCategorySuccess(category, data);
            }
            
            return data;
        } else {
            throw new Error('DataLoader not available');
        }
        
    } catch (error) {
        console.error(`❌ Failed to load ${category}:`, error);
        
        // Show error
        if (window.LoadingUI) {
            window.LoadingUI.showCategoryError(category, { error: error.message });
        }
        
        throw error;
    }
};

// Preload popular categories
window.preloadPopularCategories = async function() {
    const popularCategories = ['countries', 'movies']; // Most commonly used first
    
    if (window.LoadingUI) {
        window.LoadingUI.showMainLoader('Preloading popular categories...', true);
    }
    
    try {
        let completed = 0;
        const total = popularCategories.length;
        
        for (const category of popularCategories) {
            try {
                await window.loadCategoryWithUI(category);
                completed++;
                
                if (window.LoadingUI) {
                    const progress = (completed / total) * 100;
                    window.LoadingUI.updateMainProgress(progress, `Loaded ${category}...`);
                }
                
            } catch (error) {
                console.warn(`⚠️ Preload failed for ${category}:`, error.message);
                completed++; // Continue with others
            }
        }
        
        if (window.LoadingUI) {
            window.LoadingUI.hideMainLoader();
            window.LoadingUI.showToast(`Preloaded ${completed}/${total} categories`, 'success');
        }
        
    } catch (error) {
        console.error('❌ Preload process failed:', error);
        
        if (window.LoadingUI) {
            window.LoadingUI.hideMainLoader();
            window.LoadingUI.showToast('Preload failed', 'error');
        }
    }
};

// Smart category loading based on user interaction
window.smartLoadCategory = async function(category) {
    // Check if already loaded
    if (window.isCategoryLoaded(category)) {
        console.log(`✅ Category ${category} already loaded`);
        return window.GAME_DATA.categories[category];
    }
    
    // Check if currently loading
    const status = window.getCategoryStatus(category);
    if (status.status === 'loading') {
        console.log(`⏳ Category ${category} already loading...`);
        return null;
    }
    
    // Load with UI feedback
    return await window.loadCategoryWithUI(category);
};

// Initialize lazy loading hints
window.setupLazyLoadingHints = function() {
    // Add loading hints to category buttons
    const categoryButtons = document.querySelectorAll('[data-category]');
    
    categoryButtons.forEach(button => {
        const category = button.dataset.category;
        
        button.addEventListener('mouseenter', () => {
            // Preload on hover (with a small delay)
            setTimeout(() => {
                if (!window.isCategoryLoaded(category)) {
                    console.log(`🔄 Preloading ${category} on hover...`);
                    window.smartLoadCategory(category).catch(error => {
                        console.warn(`⚠️ Hover preload failed for ${category}:`, error.message);
                    });
                }
            }, 500);
        });
        
        button.addEventListener('click', async (event) => {
            // Ensure category is loaded before proceeding
            if (!window.isCategoryLoaded(category)) {
                event.preventDefault();
                
                try {
                    await window.smartLoadCategory(category);
                    // Retry the original action
                    button.click();
                } catch (error) {
                    console.error(`❌ Failed to load ${category} on click:`, error);
                    if (window.LoadingUI) {
                        window.LoadingUI.showToast(`Failed to load ${category}`, 'error');
                    }
                }
            }
        });
    });
    
    console.log('✅ Lazy loading hints setup complete');
};

// Performance monitoring
window.getDataLoadingStats = function() {
    const stats = {
        coreLoaded: true,
        categories: {},
        totalLoadedSize: 0,
        loadedCount: 0
    };
    
    Object.keys(window.GAME_DATA.categories).forEach(category => {
        const categoryData = window.GAME_DATA.categories[category];
        const status = window.getCategoryStatus(category);
        
        stats.categories[category] = {
            loaded: status.status === 'loaded',
            itemCount: status.itemCount,
            promptCount: status.promptCount,
            sizeEstimate: categoryData.meta.dataSize
        };
        
        if (status.status === 'loaded') {
            stats.loadedCount++;
            // Estimate loaded size (rough calculation)
            const sizeKB = parseInt(categoryData.meta.dataSize.replace('KB', ''));
            stats.totalLoadedSize += sizeKB;
        }
    });
    
    stats.savingsPercent = Math.round((1 - (stats.totalLoadedSize / 464)) * 100);
    
    return stats;
};

// Console output for verification
console.log('✅ Know-It-All Core Data v1.0.0 loaded successfully');
console.log('📊 Categories initialized:', Object.keys(window.GAME_DATA.categories).length);
console.log('💾 Core structure size: ~5KB (was 464KB)');
console.log('🚀 Ready for lazy loading!');

// Auto-setup lazy loading hints when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(window.setupLazyLoadingHints, 1000);
    });
} else {
    setTimeout(window.setupLazyLoadingHints, 1000);
}