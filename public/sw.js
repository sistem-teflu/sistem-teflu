self.addEventListener('push', function (event) {
    if (event.data) {
        const data = event.data.json()
        
            const options = {
            body: data.body,
            icon: '/icon-192.png', // Asegúrate de tener un icono en public
            badge: '/badge.png',
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: '2',
                url: data.url // Link a donde ir al hacer click
            }
        }
        
        event.waitUntil(
        self.registration.showNotification(data.title, options)
        )
    }
})

self.addEventListener('notificationclick', function (event) {
    console.log('Notificación clickeada')
    event.notification.close()
    
    event.waitUntil(
        clients.openWindow(event.notification.data.url || '/')
    )
})