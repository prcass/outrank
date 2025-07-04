// ULTRA SIMPLE TEST - Just make the page work
console.log("=== ULTRA SIMPLE TEST STARTING ===");

// Make a simple global test function immediately
window.testBasic = function() {
    alert("Basic function works!");
    console.log("testBasic called successfully");
};

console.log("testBasic function defined");

// Make sure we can access DOM elements
window.checkDOM = function() {
    var titleScreen = document.getElementById('titleScreen');
    var allScreens = document.querySelectorAll('.screen');
    
    console.log("titleScreen found:", !!titleScreen);
    console.log("Number of screens found:", allScreens.length);
    
    if (titleScreen) {
        alert("DOM elements found! titleScreen exists.");
    } else {
        alert("PROBLEM: titleScreen not found!");
    }
};

console.log("checkDOM function defined");

// Simple screen switching
window.showScreen = function(screenId) {
    console.log("showScreen called for:", screenId);
    
    try {
        // Hide all screens
        var screens = document.querySelectorAll('.screen');
        screens.forEach(function(screen) {
            screen.classList.remove('active');
        });
        
        // Show target screen
        var target = document.getElementById(screenId);
        if (target) {
            target.classList.add('active');
            console.log("Successfully switched to:", screenId);
            alert("Switched to " + screenId);
        } else {
            console.error("Screen not found:", screenId);
            alert("ERROR: Screen " + screenId + " not found!");
        }
    } catch (error) {
        console.error("showScreen error:", error);
        alert("ERROR in showScreen: " + error.message);
    }
};

console.log("showScreen function defined");

// Simple game functions that match your HTML buttons
window.simulateQRScan = function() {
    console.log("simulateQRScan called");
    alert("Demo game function works!");
};

window.startRealQRScan = function() {
    console.log("startRealQRScan called");
    alert("QR scan function works!");
};

window.addPlayer = function() {
    console.log("addPlayer called");
    alert("Add player function works!");
};

console.log("Game functions defined");

// Initialize when page loads
function initPage() {
    console.log("=== INITIALIZING PAGE ===");
    
    try {
        // Check what we can find
        var titleScreen = document.getElementById('titleScreen');
        var allScreens = document.querySelectorAll('.screen');
        var allButtons = document.querySelectorAll('button');
        
        console.log("Found titleScreen:", !!titleScreen);
        console.log("Found screens:", allScreens.length);
        console.log("Found buttons:", allButtons.length);
        
        // Try to show title screen
        if (titleScreen) {
            // Hide all screens first
            allScreens.forEach(function(screen) {
                screen.classList.remove('active');
            });
            
            // Show title screen
            titleScreen.classList.add('active');
            console.log("Title screen should now be visible");
        } else {
            console.error("Cannot find title screen!");
        }
        
        // List all screens found
        allScreens.forEach(function(screen, index) {
            console.log("Screen " + index + ":", screen.id, "active:", screen.classList.contains('active'));
        });
        
    } catch (error) {
        console.error("Initialization error:", error);
    }
}

// Try multiple ways to initialize
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOMContentLoaded - initializing");
    setTimeout(initPage, 100);
});

window.addEventListener('load', function() {
    console.log("Window load - initializing");
    setTimeout(initPage, 100);
});

// Also try immediate initialization if DOM is already ready
if (document.readyState === 'loading') {
    console.log("Document still loading, waiting...");
} else {
    console.log("Document already loaded, initializing immediately");
    setTimeout(initPage, 100);
}

console.log("=== ULTRA SIMPLE TEST LOADED ===");

// Test that functions are really defined
setTimeout(function() {
    console.log("Testing function definitions:");
    console.log("window.testBasic exists:", typeof window.testBasic);
    console.log("window.checkDOM exists:", typeof window.checkDOM);
    console.log("window.showScreen exists:", typeof window.showScreen);
    console.log("window.simulateQRScan exists:", typeof window.simulateQRScan);
}, 500);
