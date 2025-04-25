'use client'
import { useEffect, useRef, useState } from 'react'
import ReactMapGL, { Source, Layer, Map, Marker } from "react-map-gl"
import 'maplibre-gl/dist/maplibre-gl.css'
import './style.sass'
import carIco from '/public/ico/car.png'
import cashIco from '/public/ico/cash-ico.svg'
import SearchCarIco from '/public/image/carAndMap.svg'
import scooterIco from '/public/image/scooter.png'
import userIco from '/public/ico/man-user.svg'
import Image from 'next/image'
import Link from 'next/link'
import Cookies from 'js-cookie'
import io from 'socket.io-client'
import { useRouter } from 'next/navigation'
import { Howl } from 'howler'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
const crypto = require('crypto');
import { useData } from '../DataContext'
import useSocket from "../useSocket";
import {
  registerPassengerHandlers,
  registerDriverHandlers
} from "../socketHandlers";

//import defaultUserIco from '/public/ico/man-user.svg'

//const socket = io("http://localhost:3001")
const mapApiKey = process.env.NEXT_PUBLIC_MAP_API_KEY
const localHostApi = process.env.NEXT_PUBLIC_MYSQL_API

export default function NavMap(){
  const [geoRes, setGeoRes] = useState([])
  //Хранение заказов
  const [orders, setOrders] = useState([])
  const [hasAccepted, setHasAccepted] = useState(false) // Переменная для условия для лечения цикла
  async function decryptData(encodedMessage, messageIv) {
    // Преобразуем ключ и IV из шестнадцатеричного формата
    const key = Buffer.from('16cf126a9dc4e39e405a03ad0fb2f31d91f6b73342c7d7647772e104aa8d7e39', 'hex'); // Ключ AES-256
    const iv = Buffer.from(messageIv, 'hex'); // IV (инициализационный вектор)
    // Преобразуем зашифрованные данные в Buffer
    const encryptedBuffer = Buffer.from(encodedMessage, 'hex');

    // Создаем расшифровщик
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

    // Расшифровка данных
    let decrypted = decipher.update(encryptedBuffer, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    let parsedData = JSON.parse(decrypted)
    if(parsedData.length !== 0){
      setOrders(parsedData)
      setStep(1)
      orderCreatedSound?.play(); // звуковое уведомление
    }else{
      setStep(0)
      setGeoRes([])
    }
}
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null; // Если куки нет
}
  const { userData, loadingStatus, setUserData } = useData()
  const [driverPos, setDriverPos] = useState([])

  const [mapInfo, setMapInfo] = useState()
  useEffect(()=>{
    fetch('https://maps.geoapify.com/v1/styles/osm-bright/style.json?apiKey=3f92ee1c9c6946c59edce5b1227a9078',{
      method: 'GET'
    }).then((result)=>{
      return result.json()
    }).then((res)=>{
      setMapInfo(res);
    })
  },[])
  
  // Открытие веб сокета
  const socketRef = useSocket(); // подключение
  const socket = socketRef.current;
  useEffect(() => {

    if (!socket || !userData) return;

    if (userData.DriverMode === 0) {
      registerPassengerHandlers(socket, userData.UserId, setHasAccepted, setDriverPos);
    } else {
      registerDriverHandlers(socket, fetchOrders, checkDriverOrders, orderCreatedSound);
    }

    return () => {
      socket.off("orderCreated");
      socket.off("orderUpdatedByDriver");
      socket.off("driverPosition");
    };
  }, [userData]);
  


  

  const [addressFrom, setAddressFrom] = useState("")
  const [addressTo, setAddress] = useState("")

  //Открытие - Закрытие Окна выбора тарифа
  const [togglerPriceBlock, setTogglerPriceBlock] = useState("")
  // Тогглеры
  const [togglerPopupDriverCloseOrder, setTogglerPopupDriverCloseOrder] = useState('') // водитель завершил заказ
  const [togglerOpenOrder, setTogglerOpenOrder] = useState('')
  const [togglerPopupPassengerCloseOrder, setTogglerPopupPassengerCloseOrder] = useState('')
  const [togglerPopupVehicleNotFound, setTogglerPopupVehicleNotFound] = useState('')

  // Открытие вебсокета
  const [orderIteration, setOrderIteration] = useState(0)
  function handleOrderIteration(){
    setOrderIteration(orderIteration + 1)
    if(orderIteration >= orders.length-1){
      setOrders([])
      setOrderIteration(0)
    }
  }

  // Функция получения заказов для водителя
  function fetchOrders(){
    const token = getCookie('token');
    if(userData && userData.DriverMode === 1){
      if(userData.VehicleBrand !== null){
        fetch(`/api/orders-data/get-orders`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
          },
        }).then((result) => {
          return result.json()
        }).then((res) => {
          if(res.length !== 0){
            decryptData(res.orders.encryptedData, res.orders.iv)
            setTogglerOpenOrder('')
          }
        }).catch(error => {
          console.log(error)
        })
      }else if(userData.VehicleBrand === null){
        setTogglerPopupVehicleNotFound('popup-open')
      }
    }
  }
  useEffect(() => {
    // Получение заказов для водителя из бд
    if(orders.length <= 0){
      fetchOrders()
    }
  }, [userData])

  const [orderCreatedSound, setOrderCreatedSound] = useState(null)
  const [activeOrderId, setActiveOrderId] = useState(0)

  useEffect(() => {
    setOrderCreatedSound(
      new Howl({
        src: '/songs/order-created.mp3',
        volume: 1,
      })
    )
  }, [])
  useEffect(() => {
    const socket = socketRef.current;
  
    if (!socket || !userData) return;
  
    if (userData.DriverMode === 1) {
      const handleOrderCreated = () => {
        if(userData.ActiveOrder === 0){
          fetchOrders();
        }
      };
      
      const handleOrderAccepted = () => {
        if(userData.ActiveOrder === 0){
          fetchOrders();
        }
      };
  
      socket.on("orderCreated", handleOrderCreated);
      socket.on("orderAccepted", handleOrderAccepted);
  
      return () => {
        socket.off("orderCreated", handleOrderCreated);
        socket.off("orderAccepted", handleOrderAccepted);
      };
    }
  }, [userData]);
  useEffect(() => {
    const socket = socketRef.current;
  
    if (!socket || !userData) return;
  
    if (userData.DriverMode === 0) {
      const handleOrderAccepted = (incomingUserId) => {
        if (incomingUserId === userData.UserId) {
          checkOrderPassenger()
        }
      };
      const handleOrderCompleted = (incomingUserId) => {
        if (incomingUserId === userData.UserId) {
          successfullyPopups()
        }
      };
      socket.on("orderAccepted", handleOrderAccepted);
      socket.on("orderCompleted", handleOrderCompleted);
  
      return () => {
        socket.off("orderAccepted", handleOrderAccepted);
        socket.off("orderCompleted", handleOrderCompleted);
      };
    }
  }, [userData]);

  useEffect(()=>{
    if(orders.length > 0 && userData.DriverMode === 1){
      setStep(1)
    }
  }, [orders])

  // Создание заказа по вебсокету
  const [activeOrder, setActiveOrder] = useState([])
  const [paymentMethodValue, setPaymentMethodValue] = useState("Наличные");

  function openOrder(){
    const token = getCookie('token');
    const data = {
      "token": token,
      "CustomerPhone": userData.UserPhone,
      "UserId": userData.UserId,
      "OrderStatus": "created",
      "CustomerName": userData.UserName,
      "LatFrom": addressFromCoordinate[0],
      "LonFrom": addressFromCoordinate[1],
      "LatTo": addressToCoordinate[0],
      "LonTo": addressToCoordinate[1],
      "AddressFrom": addressFrom,
      "AddressTo": addressTo,
      "Price": routePrice,
      "PaymentMethod": paymentMethodValue,
      "CustomerImage": userData.UserImage
    }
    setActiveOrder([data])
    socket.emit("sendOrder", data)
  }
  // Принятие заказа
  async function acceptOrder(){
    const token = getCookie('token');
    await fetch(`/api/orders-data/accept-order?id=${orders[orderIteration].id}`,{
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          "DriverName": userData.UserName,
          "DriverPhone": userData.UserPhone,
          "VehicleBrand": userData.VehicleBrand,
          "VehicleModel": userData.VehicleModel,
          "VehicleColor": userData.VehicleColor,
          "VehicleNumber": userData.VehicleNumber,
          "OrderStatus": "active",
          "DriverImage": userData.UserImage
        }),
    }).then(()=>{
      setUserData({
        ...userData,
        ActiveOrder: orders[orderIteration].id,
      });
      setTogglerOpenOrder('order-active')
      setActiveOrderId(orders[orderIteration].id)
      socket.emit("acceptOrder", orders[orderIteration].UserId)
    }).catch(error =>{
        console.log(error)
    })
  }
  // Проверка активных заказов для водителя
  function checkDriverOrders(){
    const token = getCookie('token');
    if(userData && userData.DriverMode === 1){
      if(userData.ActiveOrder !== 0){
        fetch(`/api/orders-data/accept-order/update-active-order?id=${userData.ActiveOrder}`, {
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }).then((result) => {
          return result.json()
        }).then((res) => {
          if(res.length !== 0){
            setOrders(res)
            setStep(1)
            setTogglerOpenOrder('order-active')
            socket.emit("joinOrderRoom", res[0].id)
          }
        }).catch(error => {
          console.log(error)
        })
      }else if(userData.ActiveOrder === 0){
        fetchOrders()
      }
    }
  }
  useEffect(()=>{
    checkDriverOrders()
  },[userData])
  // Проверка заказа для пассажира
 /// NEW VERSION ////
  function checkOrderPassenger(){
    const token = getCookie('token');
    if(userData && userData.DriverMode === 0){
        fetch(`/api/orders-data/check-order`, {
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }).then((result) => {
          return result.json()
        })
        .then((res) => {
          if(res.length !== 0){
              let checkOrderStatus = res[0]
              if(checkOrderStatus.OrderStatus === 'created'){
                setStep(2)
                setActiveOrder(res)
              }else if(checkOrderStatus.OrderStatus === 'active'){
                  setActiveOrder(res)
                  setStep(3)
                  setActiveOrderId(res.id)
                  const socket = socketRef.current
                  socket.emit("joinOrderRoom", res[0].id)
              }else if(checkOrderStatus.length <= 0 && userData.ActiveOrder !== 0){
                  setTogglerPopupDriverCloseOrder('popup-open')
                  setUserData({
                    ...userData,
                    ActiveOrder: 0
                  });
                  setActiveOrderId(0)
                  setGeoRes([])
                  setDriverPos([1.1,1.1])
                  socket.disconnect("joinOrderClient")
            }
          }
        }).catch(error => {
          console.log(error)
        })
    }
  }
  useEffect(()=>{
    checkOrderPassenger()
  }, [userData])

  const[driverTimeToPassenger, setDriverTimeToPassenger] = useState(0)
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
      setRemainingTime(driverTimeToPassenger)
          
          const countdownInterval = setInterval(() => {
              setRemainingTime(prevTime => {
                  if (prevTime > 0) {
                      return prevTime - 1; 
                  } else {
                      clearInterval(countdownInterval);
                      return 1;
                  }
              });
          }, 60000)
          return () => clearInterval(countdownInterval);
  }, [driverTimeToPassenger]);

  useEffect(()=>{
    if(activeOrder.length !== 0){
      setDriverTimeToPassenger(Math.ceil(activeOrder[0].DriverTime / 60))
    }
  }, [activeOrder])

  // Удаление заказа по таймеру
  const [closeOrderText, setCloseOrderText] = useState('')
  function orderTimeOut(){
    if(userData && userData.DriverMode === 0){
      fetch(`/api/orders-data/check-order?userId=${userData.UserId}`, {
        method: 'GET'
      }).then((result) => {
        return result.json()
      }).then((res) => {
        if(res.length !== 0){
          let checkOrderStatus = res.filter((item) => item.OrderStatus === 'created')
          if(checkOrderStatus.length > 0){
            fetch(`/api/orders-data/delete-order?id=${checkOrderStatus[0].id}`,{
              method: 'DELETE'
            }).then(()=>{
              setActiveOrder([])
              const socket = socketRef.current
              socket.emit("orderUpdate")
              setStep(0)
              setCloseOrderText('К сожалению мы не нашли водителя')
              setTogglerPopupPassengerCloseOrder('popup-open')
            }).catch(error =>{
              console.log(error)
            })
          }
        }
      }).catch(error => {
        console.log(error)
      })
    }
  }
  // Удаление заказа по кнопке
  function deleteOrder(){
    if(userData && userData.DriverMode === 0){
      const token = getCookie('token')
      const socket = socketRef.current
      fetch(`/api/orders-data/delete-order`,{
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        method: 'DELETE'
      }).then(() =>{
        socket.emit("acceptOrder")
        setStep(0)
        setCloseOrderText('Заказ отменен')
        setTogglerPopupPassengerCloseOrder('popup-open')
        setGeoRes([])
        setGeoJSONRoute([])
      }).catch(error =>{
        console.log(error)
      })
    }
  }
  /////NEW VERSION/////
  function orderCompletion(){
    const token = getCookie('token')
    if(userData && userData.DriverMode === 1){
      fetch(`/api/orders-data/accept-order?id=${orders[orderIteration].id}`,{
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          "DriverName": userData.UserName,
          "DriverPhone": userData.UserPhone,
          "VehicleBrand": userData.VehicleBrand,
          "VehicleModel": userData.VehicleModel,
          "VehicleColor": userData.VehicleColor,
          "VehicleNumber": userData.VehicleNumber,
          "OrderStatus": "completed"
        }),
      }).then(()=>{
        socket.emit("completeOrder", orders[orderIteration].UserId)
        setUserData({
          ...userData,
          ActiveOrder: 0,
        });
        successfullyPopups()
      })
      .catch(error =>{
          console.log(error)
      })
    }
  }
  //success order
  function successfullyPopups(){
    if(userData.DriverMode === 0){
      setTogglerPopupDriverCloseOrder('popup-open')
      setGeoJSONRoute([])
    }else if(userData.DriverMode === 1){
      setTogglerPopupOrderClose('popup-open')
    }
    setGeoJSONRoute([])
    setGeoRes([])
    setStep(0)
    setOrders([])
    setActiveOrderId(0)
    setActiveOrder([])
  }
    
  // кодирование значения в html
  const encodedAddressFrom = encodeURIComponent(addressFrom)
  const encodedAddressTo = encodeURIComponent(addressTo)


  // Получение адреса
  const [addressToCoordinate, setAddressToCoordinate] = useState([1.1,1.1])
  const [addressFromCoordinate, setAddressFromCoordinate] = useState([1.1,1.1])

  // Начальный адрес по координатам браузера
  const [location, setLocation] = useState();

  useEffect(()=>{
    if('geolocation' in navigator) {
      // Retrieve latitude & longitude coordinates from `navigator.geolocation` Web API
      navigator.geolocation.watchPosition(({ coords }) => {
          const { latitude, longitude } = coords;
          setLocation({ latitude, longitude });
      })
    }
  })

  useEffect(()=>{
    console.log("LOCATSIA:", location)
    if(location !== undefined){
      fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${location.latitude}&lon=${location.longitude}&format=json&apiKey=${mapApiKey}`)
      .then(response => response.json())
      .then(result => 
        setAddressFrom(result.results[0].address_line1)
      )
      .catch(setAddressFrom(""));
    }
  },[location])
  // Маркер пользователя Не готово
  const userPositionFrom = {
    type: 'FeatureCollection',
    features: [
      { type: 'Feature', 
        geometry: {
          type: 'Point', 
          coordinates: location !== undefined ? [location.longitude,location.latitude] : null,
        }
      }
    ]
  }

  // Быстрый доступ
  function getFastAddress(coords, address) {
    const isInZone =
    location.latitude >= 54.330347902222314  && location.latitude <= 54.5140980931572 &&
    location.longitude >= 51.25456616016618 && location.longitude <= 51.629709692889264;

    if (!isInZone) {
      alert("Извините, но мы пока не можем подать машину так далеко :(");
      return;
    }
    setAddressToCoordinate(coords); // Точка назначения (например, клик на карте)
    setAddress(address); // Текстовый адрес
    setAddressFromCoordinate([location.latitude, location.longitude]); // Откуда подавать
    handleNextStep();
  }  

  // Геопозиция водителей
  // Сторона водителей
  function driverGeo(){
    socket.emit("sendDriverLocation", activeOrderId, location)
  }

  useEffect(()=>{
    if(activeOrderId !== 0){
      driverGeo()
    }
  }, [location])
  // Сторона клиента (Пассажир)
  
  useEffect(() => {
    const socket = socketRef.current;
  
    if (userData && userData.DriverMode === 0 && activeOrderId !== 0) {
      const handleDriverLocation = (pos) => {
        console.log("ПОЗИЦИЯ", pos);
        if (pos?.longitude !== null) {
          setDriverPos([pos.longitude, pos.latitude]);
        }
      };
  
      socket.on("driverLocation", handleDriverLocation);
  
      return () => {
        socket.off("driverLocation", handleDriverLocation);
      };
    }
  }, [userData, activeOrderId]);
  

  //Построение маршрута
  async function getAddress() {
    if (addressTo !== "") {
      await fetch(`https://api.geoapify.com/v1/geocode/search?text=${encodedAddressFrom}&filter=rect:51.25456616016618,54.330347902222314,51.629709692889264,54.5140980931572&format=json&apiKey=${mapApiKey}`)
        .then(response => response.json())
        .then((result) => {
          if (result.results[0].lat !== addressToCoordinate[0] || result.results[0].lon !== addressToCoordinate[1]) {
            setAddressFromCoordinate([result.results[0].lat, result.results[0].lon])
          }
        })
        .catch(error => console.log('Ошибка получения адреса', error))
    }
    if (addressFrom !== "") {
      await fetch(`https://api.geoapify.com/v1/geocode/search?text=${encodedAddressTo}&filter=rect:51.25456616016618,54.330347902222314,51.629709692889264,54.5140980931572&format=json&apiKey=${mapApiKey}`)
        .then(response => response.json())
        .then((result) => {
          if (result.results[0].lat !== addressFromCoordinate[0] || result.results[0].lon !== addressFromCoordinate[1]) {
            setAddressToCoordinate([result.results[0].lat, result.results[0].lon])
          }
        })
        .catch(error => console.log('Ошибка получения адреса', error))
    }
    handleNextStep()
  }
  
  
  // Построение маршрута
  const [geoJSONRoute, setGeoJSONRoute] = useState([])
  const [routePrice, setRoutePrice] = useState(0)
  const [routeDistance, setRouteDistance] = useState(0) // Дистанция в км
  const [routeStart, setRouteStart] = useState([0,0]) // Стартовая точка
  const [routeFinish, setRouteFinish] = useState([0,0]) // Конечная точка
  useEffect(()=>{
    setRouteStart(geoRes[0])
    //let lastItem = geoRes[geoRes.length - 1];
    setRouteFinish(geoRes[geoRes.length - 1])
  }, [geoRes])
  useEffect(()=>{
    console.log('routeFinish', routeFinish)
    console.log('routeFinishS', routeStart)
  }, [routeFinish])
  //убрать коммент
  // Графическое построение
  function requestOptions(){
    if(orders && userData && userData.DriverMode === 1 && orders.length > 0 && hasAccepted === false){
      fetch(`https://api.geoapify.com/v1/routing?waypoints=${
      userData.DriverMode === 1 ? (orders.length >= 2 && orderIteration <= orders.length-1 ? [orders[orderIteration].LatFrom,orders[orderIteration].LonFrom] : [orders[0].LatFrom,orders[0].LonFrom]) : 
      (userData.DriverMode === 0 && activeOrder.length > 0 ? [activeOrder[0].LatFrom,activeOrder[0].LonFrom] : addressFromCoordinate)}|${
        userData.DriverMode === 1 ? (orders.length >= 2 && orderIteration <= orders.length-1 ? [orders[orderIteration].LatTo,orders[orderIteration].LonTo] : [orders[0].LatTo,orders[0].LonTo] ) :
        (userData.DriverMode === 0 && activeOrder.length > 0 ? [activeOrder[0].LatTo,activeOrder[0].LonTo] : addressToCoordinate)}&mode=drive&apiKey=${mapApiKey}`)
      .then(response => response.json())
      .then((routeResult) =>{
        setHasAccepted(false)
        if(routeResult.features[0].geometry.coordinates[0] !== geoRes){
          setGeoRes(routeResult.features[0].geometry.coordinates[0])
          setRoutePrice(routeResult.features[0].properties.distance * 0.045 + 45)
          setRouteDistance(routeResult.features[0].properties.distance / 1000)
          console.log("ROUTE", routeResult)
          fetch(`https://api.geoapify.com/v1/routing?waypoints=${[location.latitude,location.longitude]}|${[orders[0].LatFrom,orders[0].LonFrom]}&mode=drive&apiKey=${mapApiKey}`)
          .then(res => res.json())
          .then((routeDriverResult) =>{
            if(routeDriverResult && routeDriverResult.features && routeDriverResult.features.length > 0 && routeDriverResult.features[0].geometry && routeDriverResult.features[0].geometry.coordinates && routeDriverResult.features[0].geometry.coordinates.length > 0 && routeDriverResult.features[0].geometry.coordinates[0] !== geoRes){
              fetch(`/api/orders-data/set-time?id=${orders[0].id}`,{
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  "DriverTime": routeDriverResult.features[0].properties.legs[0].time
                })
              })
            }})
        }
      })
      .catch(error => console.log('Ошибка установки маршрута', error))         /* Здлесь скобки */
    }if(userData && userData.DriverMode === 0 && (addressFromCoordinate.length !== 0 || (activeOrder.length !== 0 && hasAccepted === false))){
      fetch(`https://api.geoapify.com/v1/routing?waypoints=${userData.DriverMode === 0 && activeOrder.length > 0 ? [activeOrder[0].LatFrom,activeOrder[0].LonFrom] : addressFromCoordinate}|${userData.DriverMode === 0 && activeOrder.length > 0 ? [activeOrder[0].LatTo,activeOrder[0].LonTo] : addressToCoordinate}&mode=drive&apiKey=${mapApiKey}`)
      .then(response => response.json())
      .then((routeResult) =>{
        if(routeResult && routeResult.features && routeResult.features.length > 0 && routeResult.features[0].geometry && routeResult.features[0].geometry.coordinates && routeResult.features[0].geometry.coordinates.length > 0 && routeResult.features[0].geometry.coordinates[0] !== geoRes){
          setHasAccepted(false)
          setGeoRes(routeResult.features[0].geometry.coordinates[0])
          console.log("GEO RESOURSES", routeResult.features[0].geometry.coordinates[0])
          setRoutePrice(routeResult.features[0].properties.distance * 0.045 + 45)
          setRouteDistance(routeResult.features[0].properties.distance / 1000)
        }
      })
    }
  }
  
  useEffect(()=>{
    requestOptions()
  },[addressToCoordinate, addressFromCoordinate, activeOrder])

  // маршрут от водителя до клиента
  function setAddressFromDriverToClient(){
    if(orders.length !== 0){
      fetch(`https://api.geoapify.com/v1/routing?waypoints=${location.longitude,location.latitude}|${[orders[0].LatFrom,orders[0].LonFrom]}&mode=drive&apiKey=${mapApiKey}`)
      .then(response => response.json())
      .then((routeResult) =>{
        if(routeResult && routeResult.features && routeResult.features.length > 0 && routeResult.features[0].geometry && routeResult.features[0].geometry.coordinates && routeResult.features[0].geometry.coordinates.length > 0 && routeResult.features[0].geometry.coordinates[0] !== geoRes){
          setHasAccepted(false)
          setGeoRes(routeResult.features[0].geometry.coordinates[0])
          setRoutePrice(routeResult.features[0].properties.distance * 0.045 + 45)
          setRouteDistance(routeResult.features[0].properties.distance / 1000)
        }
      }).catch(error => console.log(error))
    }
  }
  /* useEffect(()=>{
    //setAddressFromDriverToClient()
  }, orders) */

  useEffect(()=>{
      function createGeoJSON(coordinates) {
          return {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: coordinates[0]
            }
          }
      }
      setGeoJSONRoute(createGeoJSON([geoRes]))
  }, [geoRes])

  const layerStyle = {
      id:"route",
        type:"line",
        paint:{
          'line-color': '#2196F3',
          'line-width': 5,
        }
  }

  // Изменения здесь
  useEffect(()=>{
    if(orders.length !== 0 ){
      requestOptions()
    }
  }, [orders])

  // Маркер пассажира стили
  const passengerImage = userData && userData?.UserImage;
  const fallbackPassengerImage = userData?.UserName?.[0] || 'U';

  const markerUserImageUrl = passengerImage || `https://ui-avatars.com/api/?name=${fallbackPassengerImage}&background=2196F3&color=ffff&rounded=true&size=128`;
  const markerUserFromStyle1 = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Point",
          coordinates:  location !== undefined ? [location.longitude,location.latitude] : null, // Пример координат
        },
      },
    ],
  };
  const markerUserFromStyle = {
    id: 'passenger-marker-layer',
    type: 'symbol',
    layout: {
      'icon-image': 'passenger-marker', // Имя изображения
      'icon-size': 0.25,              // Размер изображения
      'icon-allow-overlap': true,    // Позволяем перекрытие иконок
    },
  };
  /* const markerUserFromStyle = {
    id: 'point',
    type: 'circle',
    paint: {
      'circle-radius': 10,
      'circle-color': '#000'
    }
  } */
  // Маркер водителя
    const markerImageUrl = '/ico/driver-car.png'
    const markerDriverStyle1 = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {},
          geometry: {
            type: "Point",
            coordinates: driverPos, // Пример координат
          },
        },
      ],
    };
    const markerDriverStyle = {
      id: 'driver-marker-layer',
      type: 'symbol',
      layout: {
        'icon-image': 'driver-marker', // Имя изображения
        'icon-size': 0.08,              // Размер изображения
        'icon-allow-overlap': true,    // Позволяем перекрытие иконок
      },
    };
  // Маркер финиша
  const markerFinish = '/ico/finish-mark.png';
  const markerFinishStyle1 = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Point",
          coordinates:  routeFinish,
        },
      },
    ],
  };
  const markerFinishStyle = {
    id: 'finish-marker-layer',
    type: 'symbol',
    layout: {
      'icon-image': 'finish-marker', // Имя изображения
      'icon-size': 0.08,              // Размер изображения
      'icon-allow-overlap': true,    // Позволяем перекрытие иконок
    },
  };
  // Маркер старта
  const markerStart = '/ico/start-mark.png';
  const markerStartStyle1 = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Point",
          coordinates:  routeStart,
        },
      },
    ],
  };
  const markerStartStyle = {
    id: 'start-marker-layer',
    type: 'symbol',
    layout: {
      'icon-image': 'start-marker', // Имя изображения
      'icon-size': 0.03,              // Размер изображения
      'icon-allow-overlap': true,    // Позволяем перекрытие иконок
    },
  };
  //Шаги оформления заказа
  const [step, setStep] = useState(0)
  function handleNextStep(){
    setStep(step + 1)
  }

  function handlePrevStep(){
    setStep(step - 1)
  }

  const renderStepClient = () => {
    switch (step) {
      case 0:
        return(
          <>
            <div className={`AddressInputBlock`}>
                <h3 className='PopupHeader PopupAddressHeader'>Куда едем?</h3>
                <div className='AddressInputBlockItem'>
                    <label className='AddressInputLabel' htmlFor="input-from"><i className="fa-solid AddressInputIco fa-angles-down"></i></label>
                    <input className='InputUiMap' placeholder='Текущий адрес' id='input-from' value={addressFrom} onChange={(e)=>setAddressFrom(e.target.value)}/>
                </div>
                <div className='AddressInputBlockItem AddressFuckedInputBlockItem'>
                    <label className='AddressInputLabel' htmlFor="input-to"><i className="fa-solid AddressInputIco fa-shop"></i></label>
                    <input className='InputUiMap' placeholder='Куда поедете?' id='input-to' value={addressTo} onChange={(e)=>setAddress(e.target.value)}/>
                </div>
                <div className='AdvancedMenu'>
                  <div className='FastAddressBlock'>
                    <div className='FastAddressBlockItem' onClick={()=>{getFastAddress([54.423565,51.484111],"Больница")}}>
                      <i className="fa-solid fa-hospital FastAddressBlockItemIco"></i>
                      <div className='FastAddressBlockItemHeader'>Больница</div>
                      <div className='FastAddressBlockItemSubHeader'>Больничная ул. 4</div>
                    </div>
                    <div className='FastAddressBlockItem' onClick={()=>{getFastAddress([54.431643,51.466389], "МФЦ")}}>
                    <i className="fa-regular fa-flag FastAddressBlockItemIco"></i>
                      <div className='FastAddressBlockItemHeader'>МФЦ</div>
                      <div className='FastAddressBlockItemSubHeader'>Советская ул. 11</div>
                    </div>
                  </div>
                  {/* <div className='EatBlock'>
                    <Link className='FastAddressBlockItem' href={'/delivery-meal'}>
                      <Image src={scooterIco} alt="scooter"/>
                      <div className='text-center'><strong>Еда</strong></div>
                    </Link>
                  </div> */}
                </div>
                <div className='Button' onClick={()=>{addressFrom === "" || addressTo === "" ? setTogglerPopup('popup-open') : getAddress()}}>Поиск</div>
              </div>
          </>
        )
      case 1:
        return(
          <>
            <div className={`AddressInputBlock CarVariant`}>
                <div className='AddressInputBlockReturn' onClick={()=>{handlePrevStep()}}>
                  <i className="fa-solid fa-chevron-left"></i>
                </div>
                <h3 className='PopupHeader PopupAddressHeader'>Можем предложить...</h3>
                <div className='CarVariantBlock'>
                  <div className='CarVariantBlockItem'>
                    <div className='CarVariantBlockItemWrapper'>
                      <Image src={carIco} alt='car'/>
                      <div className='CarVariantBlockItemDescr'>
                        <div className='CarVariantBlockItemHeader'>Эконом</div>
                        <div className='CarVariantBlockItemPlaces'>3 Места</div>
                      </div>
                    </div>
                    <div className='CarVariantBlockItemPrice'>{Math.round(routePrice)}₽</div>
                  </div>
                  <div className='PaymentMethod'>
                    <h4>Способ оплаты</h4>
                    <Select value={paymentMethodValue} onValueChange={setPaymentMethodValue}>
                      <SelectTrigger className="w-[100%] PaymentSelectedMethodItem">
                        <SelectValue aria-label={paymentMethodValue}/>
                      </SelectTrigger>
                      <SelectContent style={{zIndex: 9999}}>
                        <SelectItem className='PaymentMethodItem ' value="Наличные" defaultOpen>
                          <div className='PaymentMethodItemIcoWrapper'>
                            <Image className='PaymentMethodItemIco' alt='cashIco' src={cashIco}/>
                          </div>
                          <div className='PaymentMethodItemText'>Наличные</div>
                        </SelectItem>
                        <SelectItem className='PaymentMethodItem' value="Перевод">
                          <div className='PaymentMethodItemIcoWrapper'>
                            <i className="PaymentMethodItemIco fa-solid fa-money-bill-transfer"></i>
                          </div>
                          <div className='PaymentMethodItemText'>Перевод</div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className='Button' onClick={()=>{[handleNextStep(), openOrder()]}}>Подтвердить</div>
                </div>
              </div>
          </>
        )
      case 2:
        return(
          <>
            <div className={`AddressInputBlock SearchCar`}>
              <Image src={SearchCarIco} className='SearchCarIco' alt="CarAndMap"/>
              <div className='SearchCarDetail'>
                <div className='SearchCarDetailLoading'></div>
                <div className='SearchCarDetailDescr'>Пожалуйста, подождите! Мы ищем ближайшего водителя</div>
              </div>
              <div className='Button' onClick={()=>{[deleteOrder(), handlePrevStep()]}}>Отменить</div>
            </div>
          </>
        )
      case 3:
        return(
          <>
            <div className='AddressInputBlock DriveActive'>
              <h3 className='ItemsHeader ItemsHeader__center'>Водитель прибудет через <br/> {remainingTime} минут</h3>
              <div className='AccountBlock'>
                {/* <div className='AccountIco' style={{backgroundImage: `url(${activeOrder !== undefined ? activeOrder[0].DriverImage : '/ico/man-user.svg'})`}}></div> */}
                <div className='AccountBlockInfo'>
                  <Avatar className='AccountIco'>
                    <AvatarImage src={activeOrder[0].DriverImage} />
                    <AvatarFallback>{activeOrder[0].DriverName[0]}</AvatarFallback>
                  </Avatar>
                  <div className='AccountDescrBlock'>
                    <h4 className='AccountName'>{activeOrder !== undefined ? activeOrder[0].DriverName : null}</h4>
                    <div className='CarInfo'>
                      <div className='CarModel'>{activeOrder !== undefined ? activeOrder[0].VehicleColor : null} {activeOrder !== undefined ? activeOrder[0].VehicleBrand : null} {activeOrder !== undefined ? activeOrder[0].VehicleModel : null} <br/> <strong>{activeOrder !== undefined ? activeOrder[0].VehicleNumber : null}</strong></div>
                    </div>
                </div>
                </div>
                <Link href='tel:123' className='CallUser'><i className="fa-solid fa-phone"></i></Link>
              </div>
              <div className='AddressOrderBlock'>
                <div className='AddressOrderItem'>
                  <i className="fa-solid AddressInputIco fa-angles-down"></i>
                  <div className='AddressOrderText'>{activeOrder !== undefined ? activeOrder[0].AddressFrom : null}</div>
                </div>
                <div className='AddressOrderItem'>
                  <i className="fa-solid AddressInputIco fa-check"></i>
                  <div className='AddressOrderText'>{activeOrder !== undefined ? activeOrder[0].AddressTo : null}</div>
                </div>
              </div>
              <div className='Payment'>
                <div className='PaymentItem'>
                  <div className='PaymentHeader'>Способ оплаты:</div>
                  <h4 className='PaymentInfo'>{activeOrder !== undefined ? activeOrder[0].PaymentMethod : null}</h4>
                </div>
                <div className='PaymentItem'>
                  <div className='PaymentHeader'>Стоимость:</div>
                  <h4 className='PaymentInfo'>{activeOrder !== undefined ? activeOrder[0].Price : null} ₽</h4>
                </div>
              </div>
            </div>
          </>
        )
    }}
    // Аккаунт водителя
    function renderStepDriver(){
      switch (step) {
        case 0:
          return(
            <>
              <div className={`AddressInputBlock SearchCar`}>
                <Image src={SearchCarIco} className='SearchCarIco' alt="CarAndMap"/>
                <div className='SearchCarDetail'>
                  <div className='SearchCarDetailLoading'></div>
                  <div className='SearchCarDetailDescr'>Поиск пассажира</div>
                </div>
              </div>
          </>
          )
        case 1:
          return(
            <div className='OrderDriver'>
                  <div className='OrderWrapper'>
                    <div className='AccountBlock'>
                      {/* <div className='AccountIco' style={{backgroundImage: `url(${orders[orderIteration].CustomerImage !== null ? orders[orderIteration].CustomerImage : '/ico/man-user.svg'})`}}></div> */}
                      <Avatar className='AccountIco'>
                        <AvatarImage src={orders && orders?.[orderIteration]?.CustomerImage || orders?.CustomerImage} />
                        <AvatarFallback>{orders && orders?.[orderIteration]?.CustomerName[0] || orders?.CustomerName?.[0]}</AvatarFallback>
                      </Avatar>
                      <div className='AccountBlockInfo'>
                        <div className='OrderInfoBlock'>
                          <h4 className='AccountName'>{orders && userData && orders !== undefined ? orders?.[orderIteration]?.CustomerName : "Загрузка"}</h4>
                          <div className='OrderInfo'>Дистанция: {userData && orders !== undefined ? Math.round(routeDistance * 10)/10 : 'Загрузка'}км</div>
                          <div className='OrderInfo'>Стоимость: {userData && orders !== undefined ? Math.round(orders?.[orderIteration]?.Price) : 0}₽</div>
                          <div className='OrderInfo'>Способ оплаты: {userData && orders !== undefined ? orders?.[orderIteration]?.PaymentMethod : "Загрузка"}</div>
                        </div>
                      </div>
                      <Link href={`tel:${userData && orders !== undefined ? orders[orderIteration]?.CustomerPhone : null}`} className='CallUser'><i className="fa-solid fa-phone"></i></Link>
                    </div>
                    <div className='OrderAddress'>
                      <div className='OrderAddressItem'>
                        <h3 className='AddressHeader'>От</h3>
                        <div className='Address'>{userData && orders !== undefined ? orders[orderIteration]?.AddressFrom : 'Загрузка'}</div> {/* Направление ОТ */}
                      </div>
                      <div className='OrderAddressItem'>
                        <h3 className='AddressHeader'>До</h3>
                        <div className='Address'>{userData && orders !== undefined ? orders[orderIteration]?.AddressTo : 'Загрузка'}</div> {/* Направление До */}
                      </div>
                    </div>
                    <div className={`OrderActions ${togglerOpenOrder}`}>
                      <div className='OrderAction' onClick={()=>{handleOrderIteration()}}>
                        <i className="fa-solid fa-xmark"></i>
                      </div>
                      <div className='OrderAction' onClick={()=>{acceptOrder()}}>
                        <i className="fa-solid fa-check"></i>
                      </div>
                    </div>
                    <div className={`Button ${togglerOpenOrder}`} onClick={()=>{orderCompletion()}}>Завершить поездку</div>
                  </div>
            </div>
          )
      }}
  // Сообщения об ошибках не введенных инпутов
  const [togglerPopup, setTogglerPopup] = useState("")
  const [togglerPopupOrderClose, setTogglerPopupOrderClose] = useState('')
  if (loadingStatus) {
    return <div>
      <div className={`popup-background popup-open`}></div>
      <div className={`popup popup-input-error popup-open`}>
          <h3 className='popup-input-error__text'>Загрузка</h3>
      </div>
      <div className={`popup-background popup-open`}></div>
    </div>;
  } else{
    return (
      <div className="Map">
          <div className={`MapUi ${togglerPriceBlock}`}>
            {userData && userData.DriverMode === 1 ? renderStepDriver() : renderStepClient()}
          </div>
          <Map
              className="MapWrapper"
              initialViewState={{
                  longitude: 51.466315,
                  latitude: 54.433658,
                  zoom: 13
              }}
              style={{width: '100vw', height: '100vh'}}
              mapStyle={mapInfo}
              onLoad={(event) => {
              const map = event.target;

              // Загружаем изображение для маркера
              map.loadImage(markerImageUrl, (error, image) => {
                if (error) throw error;
                map.addImage('driver-marker', image); // Добавляем изображение под именем 'driver-marker'
              });
              map.loadImage(markerFinish, (error, image) => {
                if (error) throw error;
                map.addImage('finish-marker', image); // Добавляем изображение под именем 'driver-marker'
              });
              if(userData && userData.DriverMode == 1){
                map.loadImage(markerStart, (error, image) => {
                  if (error) throw error;
                  map.addImage('start-marker', image); // Добавляем изображение под именем 'passenger-marker'
                });
              }
              if(userData && userData.DriverMode == 0){
                // Загружаем изображение для маркера пассажира
                map.loadImage(markerUserImageUrl, (error, image) => {
                  if (error) throw error;
                  map.addImage('passenger-marker', image); // Добавляем изображение под именем 'passenger-marker'
                });
              }
            }}
          >
              <Source id="my-data" type="geojson" data={geoJSONRoute}>
                <Layer {...layerStyle} />
              </Source>
              {routeStart && userData && userData.DriverMode == 1 && routeStart.length == 2 && (
                <Source id="start-data" type="geojson" data={markerStartStyle1}>
                  <Layer {...markerStartStyle}/>
                </Source>
              )}
              {routeFinish && routeFinish.length === 2 && (
                <Source id="finish-data" type="geojson" data={markerFinishStyle1}>
                  <Layer {...markerFinishStyle}/>
                </Source>
              )}
              <Source id="user-data-from" type="geojson" data={markerUserFromStyle1}>
                <Layer {...markerUserFromStyle}/>
              </Source>
              <Source id="driver-data" type="geojson" data={markerDriverStyle1}>
                <Layer {...markerDriverStyle}/>
              </Source>
          </Map>
          <div className={`popup popup-input-error ${togglerPopup}`}>
            <h3 className='popup-input-error__text'>{
                addressFrom === "" && addressTo === "" ? 'Откуда и Куда вы направляетесь?' :
                addressFrom === "" ? "Откуда вы направляетесь?" : 
                addressTo === "" ? 'Куда вы направляетесь?' : "Ошибка"
              }</h3>
            <div className='Button PopupButton' onClick={()=>{setTogglerPopup('')}}>Закрыть</div>
          </div>
          {/* попап о завершении заказа */}
          <div className={`popup-background ${togglerPopupOrderClose}`}></div>
          <div className={`popup popup-input-error ${togglerPopupOrderClose}`}>
            <h3 className='popup-input-error__text'>Заказ выполнен!</h3>
            <div className='Button PopupButton' onClick={()=>{setTogglerPopupOrderClose('')}}>Закрыть</div>
          </div>
          <div className={`popup-background ${togglerPopupOrderClose}`}></div>
          {/* попап о завершении заказа водителем */}
          <div className={`popup-background ${togglerPopupDriverCloseOrder}`}></div>
          <div className={`popup popup-input-error ${togglerPopupDriverCloseOrder}`}>
            <h3 className='popup-input-error__text'>Водитель завершил заказ!</h3>
            <div className='Button PopupButton' onClick={()=>{setTogglerPopupDriverCloseOrder('')}}>Закрыть</div>
          </div>
          <div className={`popup-background ${togglerPopupDriverCloseOrder}`}></div>
          {/* попап об отмене заказа */}
          <div className={`popup-background ${togglerPopupPassengerCloseOrder}`}></div>
          <div className={`popup popup-input-error ${togglerPopupPassengerCloseOrder}`}>
            <h3 className='popup-input-error__text'>{closeOrderText}</h3>
            <div className='Button PopupButton' onClick={()=>{setTogglerPopupPassengerCloseOrder('')}}>Закрыть</div>
          </div>
          <div className={`popup-background ${togglerPopupPassengerCloseOrder}`}></div>
          {/* попап о пустом значении транспорта */}
          <div className={`popup-background ${togglerPopupVehicleNotFound}`}></div>
          <div className={`popup popup-input-error ${togglerPopupVehicleNotFound}`}>
            <h3 className='popup-input-error__text'>Для продолжения, добавьте автомобиль</h3>
            <Link className='Button PopupButton' href='/mobile/my-account'>Добавить</Link>
          </div>
          <div className={`popup-background ${togglerPopupVehicleNotFound}`}></div>
      </div>
    )
  }
  
  }