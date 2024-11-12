// Check if service workers are supported
if ('serviceWorker' in navigator) {
    let deferredPrompt;
    const installNotification = document.getElementById('install-notification');
    const installButton = document.getElementById('install');
    const updateNotification = document.getElementById('update-notification');

    // Ensure we are not on localhost
    if (window.location.hostname !== '127.0.0.1' || window.location.port !== '5500') {

        window.addEventListener('load', () => {
            // Run service worker registration after 100ms delay
            setTimeout(() => {
                // Register the service worker
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('Service Worker registered with scope:', registration.scope);

                        // Check if there's an update available
                        registration.addEventListener('updatefound', () => {
                            const newWorker = registration.installing;

                            newWorker.addEventListener('statechange', () => {
                                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                    // New or updated content is available
                                    showUpdateNotification();
                                }
                            });
                        });
                    })
                    .catch(error => {
                        console.log('Service Worker registration failed:', error);
                    });
            }, 100); // Delay of 100 milliseconds
        });
    }

    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent the default prompt
        e.preventDefault();
        // Save the event for later
        deferredPrompt = e;

        // Show the install notification if necessary
        if (window.location.hostname !== '127.0.0.1' || window.location.port !== '5500') {
            installNotification.classList.add('show');
        }
    });

    installButton.addEventListener('click', () => {
        if (deferredPrompt) {
            installNotification.classList.remove('show');
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the A2HS prompt');
                } else {
                    console.log('User dismissed the A2HS prompt');
                }
                deferredPrompt = null;
            });
        }
    });

    function showUpdateNotification() {
        updateNotification.classList.add('show');

        document.getElementById('refresh').addEventListener('click', () => {
            updateNotification.classList.remove('show');
            window.location.reload();
        });

        document.getElementById('later').addEventListener('click', () => {
            updateNotification.classList.remove('show');
        });
    }
}
