// WORKING FOUNDATION - Building up from what works
console.log("JavaScript is loading...");

// Test function that we know works
window.test = function() {
    alert("IT WORKS!");
};

// Simple screen switching function
window.showScreen = function(screenId) {
    console.log("Switching to:", screenId);
    
    // Hide all screens
    var screens = document.querySelectorAll('.screen');
    for (var i = 0; i < screens.length; i++) {
        screens[i].classList.remove('active');
    }
    
    // Show target screen
    var target = document.getElementById(screenId);
    if (target) {
        target.classList.add('active');
        console.log("Switched to:", screenId);
    } else {
        console.log("Screen not found:", screenId);
    }
};

// Game functions for the buttons in your HTML
window.simulateQRScan = function() {
    alert("Demo game starting!");
    console.log("Demo game function called");
};

window.startRealQRScan = function() {
    alert("QR scan feature coming soon!");
};

// Player management functions
window.addPlayer = function() {
    alert("Add player clicked!");
};

window.removePlayer = function(num) {
    alert("Remove player " + num + " clicked!");
};

// Navigation functions  
window.goToPlayerScreen = function() {
    showScreen('playerScreen');
};

window.goToScoresScreen = function() {
    showScreen('scoresScreen');
};

window.goBackHome = function() {
    showScreen('titleScreen');
};

// Initialize the page - make title screen visible
function initPage() {
    console.log("Initializing page...");
    
    // Make sure title screen is visible
    setTimeout(function() {
        showScreen('titleScreen');
        console.log("Title screen should be visible now");
    }, 100);
}

// Set up page when DOM loads
document.addEventListener('DOMContentLoaded', initPage);

// Also try when window loads
window.addEventListener('load', initPage);

console.log("Foundation script loaded successfully!");
