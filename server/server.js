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

const axios = require("axios")
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
  });

/*   const axios = require("axios");
  const https = require("https");
  const fs = require('fs');
  const express = require('express');
  const app = express();
  const { Server } = require('socket.io');
  
  const options = {
    key: fs.readFileSync('./mykey.pem', 'utf8'),
    cert: fs.readFileSync('./mycsr.csr', 'utf8')
  };
  
  app.get('/', (req, res) => {
    res.send('Hello, World!');
  });
  
  const server = https.createServer(options, app);
  const io = new Server(server, {
    cors: {
      origin: "https://192.168.0.110:3000",
      methods: ["GET", "POST"]
    }
  });
  
  const instance = axios.create({
    httpsAgent: new https.Agent({ rejectUnauthorized: false })
  });
  
  io.on("connection", (socket) => {
    console.log("A user is connected");
    socket.on("sendOrder", async (data) => {
      console.log("Заказ создан:", data);
      io.emit("orderCreated", data);
  
      try {
        const response = await instance.post("https://localhost:3000/api/orders-data/create-order", data, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        console.log("Данные успешно отправлены в базу данных");
        console.log("Ответ от сервера:", response.data);
  
        const resPassenger = await instance.get(`https://localhost:3000/api/orders-data/accept-order/get-user-order?UserId=${data.UserId}`);
        const responseData = resPassenger.data;
        await instance.post(`https://localhost:3000/api/orders-data/accept-order/update-active-order?UserId=${data.UserId}`, {
          "ActiveOrder": responseData[0].id
        });
      } catch (error) {
        console.error("Ошибка отправки данных в базу данных:", error);
      }
    });
  
    socket.on("orderUpdate", () => {
      console.log("Обновление заказа");
      io.emit("orderUpdatedByDriver");
    });
    //
    socket.on("joinOrder", (orderId) => {
      socket.join(`order_${orderId}`);
      console.log(`Driver joined order room: order_${orderId}`);
    });

    socket.on("joinOrderClient", (orderId) => {
      socket.join(`order_${orderId}`);
      console.log(`Client joined order room: order_${orderId}`)
    });

    socket.on("sendGeoResToClient", (orderId, pos) => {
      socket.to(`order_${orderId}`).emit("driverPosition", pos);
      console.log("Gotcha", pos)
    }); 
  });
  
  server.listen(3001, () => {
    console.log('Secured server listening on port 3001');
  });
  
   */