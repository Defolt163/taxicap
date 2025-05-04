self.addEventListener('push', function (event) {
    let data = {};
    try {
      if (event.data) data = event.data.json();
    } catch (e) {
      data = { body: event.data.text() || 'Default message' };
    }
  
    const options = {
      body: data.body,
      icon: data.icon || '/logo/white-short-logo.png',
      badge: '/logo/white-short-logo.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: '2',
      },
    };
  
    event.waitUntil(
      self.registration.showNotification(data.title || 'Notification', options)
    );
  });
  
  self.addEventListener('notificationclick', function (event) {
    console.log('Notification click received.');
    event.notification.close();
    event.waitUntil(clients.openWindow('https://192.168.0.100'));
  });
  