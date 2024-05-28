'use client'
import { useEffect, useRef, useState } from 'react';
import ReactMapGL, { Source, Layer, Map, Marker } from "react-map-gl"
import 'maplibre-gl/dist/maplibre-gl.css';
import './style.sass'
import carIco from '/public/ico/car.png'
import cashIco from '/public/ico/cash-ico.svg'
import SearchCarIco from '/public/image/carAndMap.svg'
import userIco from '/public/ico/man-user.svg'
import Image from 'next/image';
import Link from 'next/link';
import Cookies from 'js-cookie'

export default function NavMap2(){
  // Получение sessionId из кук
  const [sessionKey, setSessionKey] = useState('')
  function myHandler() {
      const cookieValue = Cookies.get('UserData'); // Замените cookieName на имя необходимой вам cookie
      const userData = JSON.parse(cookieValue)
      setSessionKey(userData.session_key)
    }
  
  useEffect(()=>{
      myHandler()
  }, [])
  const {MAP_API_KEY} = process.env
  const [addressFrom, setAddressFrom] = useState("")
  const [addressTo, setAddress] = useState("")

  //Открытие - Закрытие Окна выбора тарифа
  const [togglerPriceBlock, setTogglerPriceBlock] = useState("")

    
  const encodedAddressFrom = encodeURIComponent(addressFrom)
  const encodedAddressTo = encodeURIComponent(addressTo)


  // Получение адреса
  const [addressToCoordinate, setAddressToCoordinate] = useState([54.4374232,51.4637213])
  const [addressFromCoordinate, setAddressFromCoordinate] = useState([54.4374232,51.4637213])


  // Получение статуса аккаунта
  const [driverMode, setDriverMode] = useState(0)
  const [userData, setUserData] = useState([])
  const [userName, setUserName] = useState('')
  function getUsersAccountType(){
    fetch(`api/account-data/user-data?sessionId=${sessionKey}`,{
        method: 'GET'
    }).then((result)=>{
        console.log("OKAY")
        return result.json()
    }).then((res)=>{
      setUserName(res[0].UserName.split(' ')[0])
      setUserData(res[0])
    })
    .catch(error =>{
        console.log(error)
    })
  }
  useEffect(()=>{
      getUsersAccountType()
  }, [sessionKey])

  //Построение маршрута
  async function getAddress(){
    if(addressTo !== ""){
      await fetch(`https://api.geoapify.com/v1/geocode/search?text=${encodedAddressFrom}&filter=rect:51.25456616016618,54.330347902222314,51.629709692889264,54.5140980931572&format=json&apiKey=3f92ee1c9c6946c59edce5b1227a9078`)
      .then(response => response.json())
      .then((result)=>{
        setAddressToCoordinate([result.results[0].lat,result.results[0].lon])
        console.log(`To: ${result.results[0].lat, result.results[0].lon}`)
      })
      .catch(error => console.log('Ошибка получения адреса', error));
    }if(addressFrom !== ""){
      await fetch(`https://api.geoapify.com/v1/geocode/search?text=${encodedAddressTo}&filter=rect:51.25456616016618,54.330347902222314,51.629709692889264,54.5140980931572&format=json&apiKey=3f92ee1c9c6946c59edce5b1227a9078`)
      .then(response => response.json())
      .then((result)=>{
        setAddressFromCoordinate([result.results[0].lat,result.results[0].lon])
        console.log(`From: ${result.results[0].lat,result.results[0].lon}`)
      })
      .catch(error => console.log('Ошибка получения адреса', error));
    }
      handleNextStep()
  }
  
  // Построение маршрута
  const [geoRes, setGeoRes] = useState([])
  const [geoJSONRoute, setGeoJSONRoute] = useState([])
  const [routePrice, setRoutePrice] = useState(0)
  const [routeDistance, setRouteDistance] = useState(0) // Дистанция в км
  //убрать коммент
  async function requestOptions(){
    await fetch(`https://api.geoapify.com/v1/routing?waypoints=${userData.DriverMode === 1 ? [orderItem.LatFrom,orderItem.LonFrom] : addressFromCoordinate}|${userData.DriverMode === 1 ? [orderItem.LatTo,orderItem.LonTo] :addressToCoordinate}&mode=drive&apiKey=3f92ee1c9c6946c59edce5b1227a9078`)
    .then(response => response.json())
    .then((routeResult) =>{
        setGeoRes(routeResult.features[0].geometry.coordinates[0])
        setRoutePrice(routeResult.features[0].properties.distance * 0.045)
        setRouteDistance(routeResult.features[0].properties.distance / 1000)
        console.log(routeResult)
    })
    .catch(error => console.log('Ошибка установки маршрута', error));
  };
  
  useEffect(()=>{
      requestOptions()
  },[addressToCoordinate, addressFromCoordinate])
  useEffect(()=>{
      function createGeoJSON(coordinates) {
          return {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: coordinates[0]
            }
          };
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
  };
  ///////////////////////////////
  // Маркер пользователя Не готово
  const userPosition = {
    type: 'FeatureCollection',
    features: [
      { type: 'Feature', geometry: { type: 'Point', coordinates: [51.4637213,54.4374232] } }
    ]
  };
  const markerUserStyle = {
    id: 'point',
    type: 'symbol',
    'layout': {
      'icon-image': 'https://api.geoapify.com/v1/icon/?type=material&color=red&icon=cloud&iconType=awesome&apiKey=3f92ee1c9c6946c59edce5b1227a9078',
      'icon-anchor': 'bottom',
      'icon-offset': [0, 5],
      'icon-allow-overlap': true
    }
  };

  //Шаги оформления заказа
  const [step, setStep] = useState(0)
  function handleNextStep(){
    setStep(step + 1);
  };

  function handlePrevStep(){
      setStep(step - 1);
  };

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
                    <div className='PaymentMethodItem'>
                      <div className='PaymentMethodItemIcoWrapper'>
                        <Image className='PaymentMethodItemIco' alt='cashIco' src={cashIco}/>
                      </div>
                      <div className='PaymentMethodItemText'>Наличные</div>
                    </div>
                  </div>
                  <div className='Button' onClick={()=>{[handleNextStep(), openOrder(), checkOrder()]}}>Подтвердить</div>
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
              <h3 className='ItemsHeader ItemsHeader__center'>Водитель прибудет через <br/> 5 минут</h3>
              <div className='AccountBlock'>
                <Image className='AccountIco' src={userIco} alt="user ico"/>
                <div className='AccountBlockInfo'>
                  <h4 className='AccountName'>{orderItem !== undefined ? orderItem.DriverName : null}</h4>
                  <div className='CarInfo'>
                    <div className='CarModel'>{orderItem !== undefined ? orderItem.VehicleColor : null} {orderItem !== undefined ? orderItem.VehicleBrand : null} {orderItem !== undefined ? orderItem.VehicleModel : null} <br/> <strong>{orderItem !== undefined ? orderItem.VehicleNumber : null}</strong></div>
                  </div>
                </div>
                <Link href='tel:123' className='CallUser'><i className="fa-solid fa-phone"></i></Link>
              </div>
              <div className='AddressOrderBlock'>
                <div className='AddressOrderItem'>
                  <i className="fa-solid AddressInputIco fa-angles-down"></i>
                  <div className='AddressOrderText'>{orderItem !== undefined ? deliveryAddressTo : null}</div>
                </div>
                <div className='AddressOrderItem'>
                  <i className="fa-solid AddressInputIco fa-check"></i>
                  <div className='AddressOrderText'>{orderItem !== undefined ? deliveryAddressFrom : null}</div>
                </div>
              </div>
              <div className='Payment'>
                <div className='PaymentItem'>
                  <div className='PaymentHeader'>Способ оплаты:</div>
                  <h4 className='PaymentInfo'>Наличные</h4>
                </div>
                <div className='PaymentItem'>
                  <div className='PaymentHeader'>Стоимость:</div>
                  <h4 className='PaymentInfo'>{orderItem !== undefined ? orderItem.Price : null} ₽</h4>
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
                  <Image className='AccountIco' src={userIco} alt="user ico"/>
                  <div className='AccountBlockInfo'>
                    <h4 className='AccountName'>{orderItem !== undefined ? orderItem.CustomerName : null}</h4>
                    <div className='OrderInfoBlock'>
                      <div className='OrderInfo'>Дистанция: {orderItem !== undefined ? Math.round(routeDistance * 10)/10 : 0}км</div>
                      <div className='OrderInfo'>Стоимость: {orderItem !== undefined ? orderItem.Price : 0}₽</div>
                      <div className='OrderInfo'>Способ оплаты: Наличные</div>
                    </div>
                  </div>
                  <Link href={`tel:${orderItem !== undefined ? orderItem.CustomerPhone : null}`} className='CallUser'><i className="fa-solid fa-phone"></i></Link>
                </div>
                <div className='OrderAddress'>
                  <div className='OrderAddressItem'>
                    <h3 className='AddressHeader'>От</h3>
                    <div className='Address'>{orderItem !== undefined ? deliveryAddressTo : null}</div> {/* Направление ОТ */}
                  </div>
                  <div className='OrderAddressItem'>
                    <h3 className='AddressHeader'>До</h3>
                    <div className='Address'>{orderItem !== undefined ? deliveryAddressFrom : null}</div> {/* Направление До */}
                  </div>
                </div>
                <div className={`OrderActions ${togglerOpenOrder}`}>
                  <div className='OrderAction' onClick={()=>{setIterationOrderItem(iterationOrderItem + 1)}}>
                    <i className="fa-solid fa-xmark"></i>
                  </div>
                  <div className='OrderAction' onClick={()=>{acceptOrder()}}>
                    <i className="fa-solid fa-check"></i>
                  </div>
                </div>
                <div className={`Button ${togglerOpenOrder}`} onClick={()=>{endOrder()}}>Завершить поездку</div>
              </div>
            </div>
          )
      }}
  // Сообщения об ошибках не введенных инпутов
  const [togglerPopup, setTogglerPopup] = useState("")
  const [togglerPopupOrderClose, setTogglerPopupOrderClose] = useState('')
  // Получение списка заказов
  const [orderData, setOrderData] = useState([])
  const [orderItem, setOrderItem] = useState()
  function getOrders(){
    if(userData.DriverMode === 1){
      setInterval(() => {
        fetch(`api/orders-data/get-orders`, {
          method: 'GET'
        }).then((result) => {
          console.log("Заказы получены")
          return result.json()
        }).then((res) => {
          if(res.length !== 0){
            setStep(1)
            setOrderData(res)
            setOrderItem(res[0])
            setAddressToCoordinate([res[0].LatFrom, res[0].LonFrom])
            setAddressFromCoordinate([res[0].LatTo, res[0].LonTo])
          }
        }).catch(error => {
          console.log(error)
        })
      }, 3000)
    }
  }
  
  const [iterationOrderItem, setIterationOrderItem] = useState(0)
  function updateOrderItem(){
    if (orderData.length > 0){
      setOrderItem(orderData[iterationOrderItem])
      setAddressToCoordinate([orderData[iterationOrderItem].LatFrom,orderData[iterationOrderItem].LonFrom])
      setAddressFromCoordinate([orderData[iterationOrderItem].LatTo,orderData[iterationOrderItem].LonTo])
    }
  }
  // Обратное геокодирование
  const [deliveryAddressFrom, setDeliveryAddressFrom] = useState('')
  const [deliveryAddressTo, setDeliveryAddressTo] = useState('')
  async function getOrderAddress(){
      await fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${orderItem.LatFrom}&lon=${orderItem.LonFrom}&format=json&apiKey=3f92ee1c9c6946c59edce5b1227a9078`,{
        method: 'GET'
      }).then(response => response.json()).
      then((result)=>{
        setDeliveryAddressFrom(result.results[0].address_line1)
      }).catch(error =>{
        console.log(error)
      })
      await fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${orderItem.LatTo}&lon=${orderItem.LonTo}&format=json&apiKey=3f92ee1c9c6946c59edce5b1227a9078`,{
        method: 'GET'
      }).then(response => response.json()).
      then((result)=>{
        setDeliveryAddressTo(result.results[0].address_line1)
      }).catch(error =>{
        console.log(error)
      })
  }
  
  useEffect(()=>{
    updateOrderItem()
  },[orderData, iterationOrderItem])

  useEffect(()=>{
    getOrders()
  }, [userData, sessionKey])
  useEffect(()=>{
    if(orderItem !== undefined){
      getOrderAddress()
      requestOptions()
    }
  }, [orderItem])
  // Принятие заказа
  const [togglerOpenOrder, setTogglerOpenOrder] = useState('')
  async function acceptOrder(){
    await fetch(`api/orders-data/accept-order?id=${orderItem.id}`,{
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          "DriverName": userData.UserName,
          "DriverId": userData.UserId,
          "DriverPhone": userData.UserPhone,
          "VehicleBrand": userData.VehicleBrand,
          "VehicleModel": userData.VehicleModel,
          "VehicleColor": userData.VehicleColor,
          "VehicleNumber": userData.VehicleNumber,
          "OrderStatus": "active"
        }),
    }).then(()=>{
        console.log("Saved!")
        setTogglerOpenOrder('order-active')
    })
    .catch(error =>{
        console.log(error)
    })
  }
  async function endOrder(){
    await fetch(`api/orders-data/accept-order?id=${orderItem.id}`,{
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          "DriverName": userData.UserName,
          "DriverId": userData.UserId,
          "DriverPhone": userData.UserPhone,
          "VehicleBrand": userData.VehicleBrand,
          "VehicleModel": userData.VehicleModel,
          "VehicleColor": userData.VehicleColor,
          "VehicleNumber": userData.VehicleNumber,
          "OrderStatus": "archived"
        }),
    }).then(()=>{
        setTogglerOpenOrder('')
        setTogglerPopupOrderClose("popup-open")
        setStep(0)
        setDeliveryAddressFrom('')
        setDeliveryAddressTo('')
    })
    .catch(error =>{
        console.log(error)
    })
  }
  // Создание заказа
  async function openOrder() {
    await fetch('/api/orders-data/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([{ 
        "CustomerPhone": userData.UserPhone,
        "UserId": userData.UserId,
        "OrderStatus": "created",
        "CustomerName": userData.UserName,
        "LatFrom": addressFromCoordinate[0],
        "LonFrom": addressFromCoordinate[1],
        "LatTo": addressToCoordinate[0],
        "LonTo": addressToCoordinate[1],
        "Price": routePrice
      }]),
    })
    .catch(error => {
      console.log("Error", error);
      alert("Произошла ошибка регистрации, повторите снова");
    });
  }
  // Отслеживание заказа
  const [openOrderCheck, setOpenOrderCheck] = useState()
  async function checkOrder() {
    try {
      const response = await fetch(`api/orders-data/check-order?userId=${userData.UserId}`, {
        method: 'GET'
      });
  
      if (response.ok) {
        const data = await response.json();
        const createdOrders = data.filter((item) => item.OrderStatus === 'created');
        setOpenOrderCheck(createdOrders[0])
      } else {
        throw new Error("Failed to fetch order data");
      }
    } catch (error) {
      console.error("Error", error);
      alert("Произошла ошибка при получении данных о заказе");
    }
  }
  // Отмена Заказа
  async function deleteOrder() {
    try {
      const response = await fetch(`api/orders-data/check-order?orderId=${openOrderCheck.id}`, {
        method: 'DELETE'
      });
  
      if (response.ok) {
        console.log("Element deleted successfully");
      } else {
        throw new Error("Failed to delete element");
      }
    } catch (error) {
      console.error("Error", error);
      alert("Произошла ошибка при удалении элемента");
    }
  }
  // Проверка статуса заказа
  const [orderStatus, setOrderStatus] = useState('')
  const [prevOrderStatus, setPrevOrderStatus] = useState('')
  async function checkOrderStatusActive() {
    try {
      const response = await fetch(`api/orders-data/check-order?userId=${userData.UserId}`, {
        method: 'GET'
      });
  
      const result = await response.json();
  
      const createdOrders = result.filter((item) => item.OrderStatus === 'active');
  
      if (createdOrders.length > 0) {
        setOrderStatus(createdOrders[0]);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function checkOrderStatusArchived() {
    try {
      const response = await fetch(`api/orders-data/check-order/update-info?orderId=${orderStatus.id}`, {
        method: 'GET'
      });
      const result = await response.json();
      const createdOrders = result.filter((item) => item.OrderStatus === 'archived');
  
      if (createdOrders.length > 0) {
        setOrderStatus(createdOrders[0]);
      }
    } catch (error) {
      console.log(error);
    }
  }
  const activeOrderStatusInterval = useRef(null);
  const archivedOrderStatusInterval = useRef(null);
  const [togglerPopupDriverCloseOrder, setTogglerPopupDriverCloseOrder] = useState('')
  //Убрать коммент
  useEffect(() => {
    if (userData.DriverMode !== 1) {
      activeOrderStatusInterval.current = setInterval(() => {
        checkOrderStatusActive();
      }, 3000);
      setPrevOrderStatus(orderStatus);
      if (orderStatus.OrderStatus === 'active' && orderStatus.id === prevOrderStatus.id) {
        setStep(3);
        archivedOrderStatusInterval.current = setInterval(() => {
          checkOrderStatusArchived();
        }, 3000);
      }
      if (orderStatus.OrderStatus === 'archived' && orderStatus.id === prevOrderStatus.id) {
        setTogglerPopupDriverCloseOrder('popup-open')
        setStep(0);
      }
      return () => {
        clearInterval(activeOrderStatusInterval.current);
        clearInterval(archivedOrderStatusInterval.current);
      };
    }
  }, [orderStatus, prevOrderStatus, userData.DriverMode]);
  
  useEffect(() => {
    if (userData.DriverMode !== 1 && orderStatus.OrderStatus === 'active' && orderStatus.id === prevOrderStatus.id) {
      getActiveOrderInfo();
    }
  }, [userData.DriverMode, orderStatus.OrderStatus, orderStatus.id, prevOrderStatus.id]);
  
  // Обновление статуса заказа в приложениие
  async function getActiveOrderInfo(){
    if(userData.DriverMode !== 1){
      if (!orderStatus || !orderStatus.id) {
        return;
      }
      await fetch(`api/orders-data/check-order/update-info?orderId=${orderStatus.id}`,{
        method: 'GET'
      }).then(response => response.json())
      .then((result)=>{
        setOrderItem(result[0])
      }).catch(error =>{
        console.log(error)
      })
    }
  }
  
  return (
      <div className="Map">
          <div className={`MapUi ${togglerPriceBlock}`}>
            {userData.DriverMode === 1 ? renderStepDriver() : renderStepClient()}
          </div>
          <Map
              className="MapWrapper"
              initialViewState={{
                  longitude: 51.466315,
                  latitude: 54.433658,
                  zoom: 13
              }}
              style={{width: '100vw', height: '100vh'}}
              mapStyle="https://maps.geoapify.com/v1/styles/osm-bright/style.json?apiKey=3f92ee1c9c6946c59edce5b1227a9078"
          >
            {/* <Source id="user-marker" type="geojson" data={userPosition}><Layer {...markerUserStyle} /></Source> */}
              <Source id="my-data" type="geojson" data={geoJSONRoute}>
                <Layer {...layerStyle} />
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
      </div>
    );
  };