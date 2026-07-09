if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('Service Worker Registered'))
            .catch(err => console.log('Service Worker Failed', err));
    });
}

const iframe = document.getElementById('app-frame');
const loadingScreen = document.getElementById('loading-screen');

// When the Google Script finished loading, hide the splash screen
iframe.onload = function() {
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            iframe.style.display = 'block';
        }, 500);
    }, 1000);
};

// Emergency Fallback: If it takes too long (8 seconds), show the frame anyway
setTimeout(() => {
    if (loadingScreen.style.display !== 'none') {
        loadingScreen.style.display = 'none';
        iframe.style.display = 'block';
    }
}, 8000);
