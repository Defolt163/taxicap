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
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });
  io.on("connection", (socket) => {
    console.log("A user is connected");
    socket.on("sendOrder", async (data) => {
      console.log("Заказ создан:", data);
      io.emit("orderCreated", data); // Отправляем данные о созданном заказе всем подключенным клиентам
  
      try {
        const response = await axios.post("http://localhost:3000/api/orders-data/create-order",
        JSON.stringify({ 
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
            "CustomerImage": data.CustomerImage
          })
        );
        console.log("Данные успешно отправлены в базу данных");
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
    socket.on("orderUpdate", () => {
      console.log("Обновление заказа");
      io.emit("orderUpdatedByDriver");
    });
  });