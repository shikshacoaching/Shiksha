// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('Service Worker Registered'))
            .catch(err => console.log('Service Worker Failed', err));
    });
}

// Handle Iframe Loading
const iframe = document.getElementById('app-frame');
const loadingScreen = document.getElementById('loading-screen');

iframe.onload = function() {
    // Small delay for smooth transition
    setTimeout(() => {
        loadingScreen.style.display = 'none';
        iframe.style.display = 'block';
    }, 500);
};

// Prevent accidental pulldown refresh on mobile
window.addEventListener('load', function() {
    document.body.addEventListener('touchmove', function(e) {
        if (e.touches.length > 1) e.preventDefault();
    }, {passive: false});
});
