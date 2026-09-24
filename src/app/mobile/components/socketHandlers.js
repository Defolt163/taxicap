// socketHandlers.js
/* export function registerPassengerHandlers(socket, userId, setHasAccepted) {
    socket.on("orderUpdatedByDriver", (incomingUserId) => {
      if (incomingUserId === userId) {
        setHasAccepted(true);
      }
    });
  
    socket.on("driverPosition", (pos) => {
      if (pos.longitude !== null) {
        setDriverPos([pos.longitude, pos.latitude]);
      }
    });
  }
  
  export function registerDriverHandlers(socket, fetchOrders, checkDriverOrders, orderCreatedSound) {
    socket.on("orderCreated", () => {
      fetchOrders();
      orderCreatedSound?.play();
    });
  
    socket.on("orderUpdatedByDriver", () => {
      fetchOrders();
      checkDriverOrders?.();
    });
  }
   */

// Регистрация обработчиков для пассажира
export function registerPassengerHandlers(stompClient, userId, orderId, setHasAccepted, setDriverPos) {
  if (!stompClient || !stompClient.connected) return;

  // Подписываемся на обновления заказа для конкретного пользователя
  const subscription1 = stompClient.subscribe(`/queue/complete/${userId}`, (message) => {
    const orderId = JSON.parse(message.body);
    console.log(`Order ${orderId} completed`);
    setHasAccepted(true);
  });

  // Подписываемся на геопозицию водителя
  const subscription2 = stompClient.subscribe(`/topic/order/${orderId}/location`, (message) => {
    const location = JSON.parse(message.body);
    if (location.lon !== null && location.lat !== null) {
      setDriverPos([location.lon, location.lat]); // [longitude, latitude]
    }
  });

  // Возвращаем функции для отписки
  return () => {
    subscription1.unsubscribe();
    subscription2.unsubscribe();
  };
}

// Регистрация обработчиков для водителя
export function registerDriverHandlers(stompClient, fetchOrders, checkDriverOrders, orderCreatedSound) {
  if (!stompClient || !stompClient.connected) return;

  // Подписываемся на новые заказы
  const subscription1 = stompClient.subscribe("/topic/orders", (message) => {
    const newOrder = JSON.parse(message.body);
    console.log("New order received:", newOrder);
    fetchOrders();
    orderCreatedSound?.play();
  });

  // Подписываемся на принятые заказы
  const subscription2 = stompClient.subscribe("/topic/orderAccepted", (message) => {
    const orderId = JSON.parse(message.body);
    console.log("Order accepted:", orderId);
    fetchOrders();
    checkDriverOrders?.();
  });

  // Возвращаем функции для отписки
  return () => {
    subscription1.unsubscribe();
    subscription2.unsubscribe();
  };
}

// Отправка событий от пассажира
export const sendOrder = (clientRef, data) => {
  const client = clientRef.current;
  if (!client || !client.connected) return;

  console.log(data)

  client.publish({
    destination: "/app/sendOrder",
    body: JSON.stringify(data),
  });
};

export const cancelOrder = (clientRef, orderId) => {
  const client = clientRef.current;
  if (!client || !client.connected) return;

  client.publish({
    destination: "/app/cancelOrder",
    body: JSON.stringify(orderId),
  });
};

export const cancelOrderByDriver = (clientRef, orderId) => {
    const client = clientRef.current;
    if (!client || !client.connected) {
        console.log("❌ Socket not connected");
        return;
    }
    
    client.publish({
        destination: "/app/cancelOrderByDriver",
        body: JSON.stringify(orderId)
    });
    
    console.log("✅ Cancel order by driver sent:", orderId);
};

// Отправка событий от водителя
export const acceptOrder = (clientRef, orderId) => {
    const client = clientRef.current;
    console.log("📤 Sending acceptOrder:", { orderId });
    
    if (!client || !client.connected) return;
    
    const body = JSON.stringify({ orderId });
    console.log("📤 Body:", body); // Должно быть: {"orderId":123}
    
    client.publish({
        destination: "/app/acceptOrder",
        body: body
    });
};

/* export const completeOrder = (stompClient, userId, orderId) => {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination: "/app/completeOrder",
      body: JSON.stringify({ userId, orderId })
    });
    console.log("✅ Order completed for user:", userId);
  }
}; */

export const completeOrder = (clientRef, orderId) => {
    const client = clientRef.current;
    if (!client || !client.connected) {
        console.log("❌ Socket not connected");
        return;
    }
    
    client.publish({
        destination: "/app/completeOrder",
        body: JSON.stringify(orderId)  // ✅ Просто ID
    });
    
    console.log("✅ Complete order sent:", orderId);
};

export const sendDriverLocation = (clientRef, orderId, lat, lon) => {
  const client = clientRef.current;

    if (!client || !client.connected) {
        console.log("NOT CONNECTED");
        return;
    }

    console.log("SENDING LOCATION");

  client.publish({
    destination: "/app/sendDriverLocation",
    body: JSON.stringify({
      orderId,
      lat,
      lon,
    }),
  });
};

/* export const workOrder = (stompClient, userId, orderId) => {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination: "/app/inTime",
      body: JSON.stringify({ userId, orderId })
    });
    console.log("✅ Order started for user:", userId);
  }
}; */
export const workOrder = (clientRef, orderId) => {
    const client = clientRef.current;
    
    if (!client || !client.connected) {
        console.log("❌ Socket not connected");
        return;
    }
    
    client.publish({
        destination: "/app/inTime",
        body: JSON.stringify({ orderId })
    });
    
    console.log("✅ workOrder sent for order:", orderId);
};

export const joinOrderRoom = (stompClient, orderId) => {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination: "/app/joinOrderRoom",
      body: JSON.stringify(orderId)
    });
    console.log("🟢 Joined room for order:", orderId);
  }
};