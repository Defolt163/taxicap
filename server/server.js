/* const io = require("socket.io")(3001, {
    cors: {
        origin: "http://localhost:3000", 
        methods: ["GET", "POST"]
    }
})

const orders = [];

io.on("connection", (socket) => {
  console.log("A user is connected");

  socket.on("sendOrder", (data) => {
    console.log("Заказ создан:", data);
    orders.push(data); // сохраняем созданный заказ
    socket.emit("orderCreated", data); // отправляем заказ обратно на клиентскую сторону
  });
}); */
////////////////////////////////////////
/* const axios = require("axios")
const io = require("socket.io")(3001, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });
  console.log("Server started")
  io.on("connection", (socket) => {
    console.log("A user is connected");
    socket.on("sendOrder", async (data) => {
      console.log("Заказ создан:", data);
  
      try {
        const response = await axios.post("http://localhost:3000/api/orders-data/create-order",
        JSON.stringify({ 
            "OrderKey": data.OrderKey,
            "CustomerPhone": data.CustomerPhone,
            "UserId": data.UserId,
            "OrderStatus": data.OrderStatus,
            "CustomerName": data.CustomerName,
            "LatFrom": data.LatFrom,
            "LonFrom": data.LonFrom,
            "LatTo": data.LatTo,
            "LonTo": data.LonTo,
            "AddressFrom": data.AddressFrom,
            "AddressTo": data.AddressTo,
            "Price": data.Price,
            "PaymentMethod": data.PaymentMethod,
            "CustomerImage": data.CustomerImage
          })
        );
        console.log("Данные успешно отправлены в базу данных");
        io.emit("orderCreated", data); // Отправляем данные о созданном заказе всем подключенным клиентам
        console.log("Ответ от сервера:", response.data);
        const resPassenger = axios.get(`http://localhost:3000/api/orders-data/accept-order/get-user-order?UserId=${data.UserId}`);
        const responseData = resPassenger.data
        axios.post(`http://localhost:3000/api/orders-data/accept-order/update-active-order?UserId=${data.UserId}`,
        JSON.stringify({
          "ActiveOrder": responseData[0].id
        })
        )
      } catch (error) {
        console.error("Ошибка отправки данных в базу данных:", error);
      }
    });
    socket.on("orderUpdate", (userId) => {
      console.log("Обновление заказа", userId);
      io.emit("orderUpdatedByDriver", userId);
    });
    //
    socket.on("joinOrder", (orderId) => {
      if(orderId !== null || orderId !== 0){
        socket.join(`order_${orderId}`);
        console.log(`Driver joined order room: order_${orderId}`);
      }
    });

    socket.on("joinOrderClient", (orderId) => {
      if(orderId !== null || orderId !== 0){
        socket.join(`order_${orderId}`);
        console.log(`Passenger joined order room: order_${orderId}`);
      }
    });

    socket.on("sendGeoResToClient", (orderId, pos) => {
      socket.to(`order_${orderId}`).emit("driverPosition", pos);
      console.log("Gotcha", pos)
    });  
  }); */

/////////////////////////////

const axios = require("axios");
const { headers } = require('next/headers');
const io = require("socket.io")(3001, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

console.log("Socket server started");

io.on("connection", (socket) => {
  console.log("✅ User connected");

  // 1. Пассажир создал заказ
  socket.on("sendOrder", (data) => {
    try {
      const response = axios.post("http://localhost:3000/api/orders-data/create-order",
        {
          OrderKey: data.OrderKey,
          CustomerPhone: data.CustomerPhone,
          UserId: data.UserId,
          OrderStatus: data.OrderStatus,
          CustomerName: data.CustomerName,
          LatFrom: data.LatFrom,
          LonFrom: data.LonFrom,
          LatTo: data.LatTo,
          LonTo: data.LonTo,
          AddressFrom: data.AddressFrom,
          AddressTo: data.AddressTo,
          Price: data.Price,
          PaymentMethod: data.PaymentMethod,
          CustomerImage: data.CustomerImage,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${data.token}`,
          },
        }
      );
      console.log("Данные успешно отправлены в базу данных");
      //io.emit("orderCreated", data); // Отправляем данные о созданном заказе всем подключенным клиентам
      console.log("Ответ от сервера:", response.data);
      /* const resPassenger = axios.get(`http://localhost:3000/api/orders-data/accept-order/get-user-order?UserId=${data.UserId}`);
      const responseData = resPassenger.data */
      /* axios.post(`http://localhost:3000/api/orders-data/accept-order/update-active-order?UserId=${data.UserId}`,
      JSON.stringify({
        "ActiveOrder": responseData[0].id
      })
      ) */
      console.log("📦 Order created:", data);
      io.emit("orderCreated", data); // Все водители
    } catch (error) {
      console.error("Ошибка отправки данных в базу данных:", error);
    }
  });

  // 2. Водитель принял заказ
  socket.on("acceptOrder", (orderId) => {
    console.log("🚗 Order accepted:", orderId);
    socket.broadcast.emit("orderAccepted", orderId); // Остальные водители
  });

  // 3. Пассажир отменил заказ
  socket.on("cancelOrder", (orderId) => {
    console.log("❌ Order canceled:", orderId);
    io.emit("orderCanceled", orderId); // Все водители
  });

  // 4. Водитель завершил заказ
  socket.on("completeOrder", (userId) => {
    console.log("✅ Order completed by driver for:", userId);
    io.emit("orderCompleted", userId); // Пассажир (по userId можно фильтровать на клиенте)
  });

  // 5. Геопозиция водителя
  socket.on("sendDriverLocation", (orderId, position) => {
    console.log("📍 Driver position update:", orderId, position);
    socket.to(`order_${orderId}`).emit("driverLocation", position);
  });

  // Присоединение к комнате
  socket.on("joinOrderRoom", (orderId) => {
    if (orderId) {
      socket.join(`order_${orderId}`);
      console.log(`🟢 Joined room order_${orderId}`);
    }
  });
});
