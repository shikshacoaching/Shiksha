if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js');
    });
}

const iframe = document.getElementById('app-frame');
const loadingScreen = document.getElementById('loading-screen');

// When iframe loads
iframe.onload = function() {
    hideSplash();
};

// If iframe is blocked or fails, still hide splash after 5 seconds
setTimeout(() => {
    hideSplash();
}, 5000);

function hideSplash() {
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            iframe.style.display = 'block';
        }, 500);
    }
}
