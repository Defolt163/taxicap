'use client'
import Image from 'next/image'
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
import { useEffect, useRef, useState } from 'react'
import './style.sass'
import carIco from '/public/ico/car.png'
import cashIco from '/public/ico/cash-ico.svg'
import SearchCarIco from '/public/image/carAndMap.svg'
import Link from 'next/link'
import { usePopup } from '../PopupContext'
import useSocket from "../useSocket";
const crypto = require('crypto');
import {
  registerPassengerHandlers,
  registerDriverHandlers,
  sendOrder, cancelOrder,
  acceptOrder,
  sendDriverLocation,
  workOrder,
  cancelOrderByDriver,
  completeOrder
} from "../socketHandlers";
import { useData } from '../DataContext'
import { toast } from 'sonner'

import phoneIco from '@/../public/ico/ui/phone-solid-full.svg'

export default function ControlDriverPanel({ onLocationSelect }){
    const { userData, loadingStatus, setUserData } = useData()
    const [togglerOpenOrder, setTogglerOpenOrder] = useState(false)
    const [pendingOrderId, setPendingOrderId] = useState(null)
    
    const { showPopup, showChoicePopup } = usePopup();
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null; // Если куки нет
    }
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
            shapeDecoder(parsedData[0].encodedWay)
            //setStep(1)
            //orderCreatedSound?.play(); // звуковое уведомление
        }else{
            setOrders([])
            setOrderIteration(0)
        }
    }
    
    const stompClientRef = useSocket({
        onOrderCreated: (orderId) => {
            console.log("ORDER CREATED for driver", orderId);
            getOrders()
        },
        onOrderAccepted: (order) => {
            setActiveOrder(order)
            currentOrderId.current = order.id
            setPendingOrderId(null)
            setStep(1)
            setTogglerOpenOrder(true)
            shapeDecoder(order.encodedWay)
        },
        onOrderClaimed: getOrders,
        onNewOrder: getOrders,

    });

    function popupError(popupText,){
        showPopup(popupText, {
            errorText: 'Попробовать снова',
            text: "Закрыть",
        });
    };

    function shapeDecoder(encodedMessage) {
        var index = 0,
            lat = 0,
            lng = 0,
            coordinates = [],
            shift = 0,
            result = 0,
            byte = null,
            latitude_change,
            longitude_change,
            factor = Math.pow(10, 6 || 6);

        // Coordinates have variable length when encoded, so just keep
        // track of whether we've hit the end of the string. In each
        // loop iteration, a single coordinate is decoded.
        while (index < encodedMessage.length) {

            // Reset shift, result, and byte
            byte = null;
            shift = 0;
            result = 0;

            do {
                byte = encodedMessage.charCodeAt(index++) - 63;
                result |= (byte & 0x1f) << shift;
                shift += 5;
            } while (byte >= 0x20);

            latitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

            shift = result = 0;

            do {
                byte = encodedMessage.charCodeAt(index++) - 63;
                result |= (byte & 0x1f) << shift;
                shift += 5;
            } while (byte >= 0x20);

            longitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

            lat += latitude_change;
            lng += longitude_change;

            coordinates.push([lat / factor, lng / factor]);
        }

        if (onLocationSelect) {
            onLocationSelect({ 
                routeCoordinates: coordinates
            });
            //handleNextStep()
        }
        return coordinates;
        
        //console.log(coordinates)
    };

    const [orders, setOrders] = useState([])
    useEffect(()=>{
        if(orders.length != 0){
            setStep(1)
        }
        console.log("FFF", orders)
    },[orders])
    const [activeOrder, setActiveOrder] = useState(null)

    useEffect(() => {
        if (orders.length === 0 && !activeOrder) {
            setStep(0)
            setTogglerOpenOrder(false)
            onLocationSelect({ routeCoordinates: null })
        }
    }, [orders.length, activeOrder, onLocationSelect])

    function getOrders(){
        const token = getCookie('token');
        if (token) {
            fetch(`/api/orders-data/get-orders`, {
                method: 'GET',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            }).then((result) => {
                return result.json()
            })
            .then((res) => {
                decryptData(res.orders.encryptedData, res.orders.iv)
            }).catch(error => {
                console.log(error)
            })
        }
    }
    useEffect(()=>{
        getOrders()
    }, [userData])

    navigator.geolocation.getCurrentPosition(
        (position) => {
            console.log(position.coords);
        },
        (error) => {
            console.log(error.code, error.message);
        }
    );
    const watchIdRef = useRef(null);
    const currentOrderId = useRef(null);
    useEffect(() => {
        watchIdRef.current = navigator.geolocation.watchPosition(
            (position) => {
                if (!currentOrderId.current) return;
                console.log("WATCH", position.coords);
                console.log("ORDER", currentOrderId.current);
                sendDriverLocation(
                    stompClientRef,
                    currentOrderId.current,
                    position.coords.latitude,
                    position.coords.longitude
                );
            },
            (error) => {
                console.log(error.code);
                console.log(error.message);
            },
            {
                enableHighAccuracy: true,
                maximumAge: 5000,
                timeout: 10000,
            }
        );

        return () => {
            if (watchIdRef.current !== null) {
                navigator.geolocation.clearWatch(watchIdRef.current);
            }
        };
    }, []);

    // Проверка заказа на отмену
    useEffect(() => {
        if (!stompClientRef.current?.connected) return;
        
        // Подписка для активных заказов
        const sub1 = stompClientRef.current.subscribe(
            "/user/queue/orderCanceledByPassenger",
            (message) => {
                const orderId = Number(message.body);
                console.log("❌ Canceled by passenger:", orderId);
                if (activeOrder?.id === orderId) {
                    popupError("Пассажир отменил заказ");
                    setActiveOrder(null);
                    setTogglerOpenOrder(false)
                    setStep(0);
                }
                getOrders(); // ✅ Обновляем список
            }
        );
        
        // ✅ Добавить подписку для заказов на бирже
        const sub2 = stompClientRef.current.subscribe(
            "/topic/orderCanceled",
            (message) => {
                console.log("❌ Order canceled:", Number(message.body));
                setStep(0);
                getOrders(); // ✅ Просто обновляем список
            }
        );
        
        return () => {
            sub1.unsubscribe();
            sub2.unsubscribe();
        };
    }, [stompClientRef.current?.connected, activeOrder?.id]);

    useEffect(() => {
        if (!stompClientRef.current?.connected) {
            console.log("❌ STOMP not connected");
            return;
        }
        
        console.log("✅ STOMP connected, subscribing...");
        
        const subscription = stompClientRef.current.subscribe(
            "/user/queue/orderAccepted",
            (message) => {
                console.log("📩 RAW MESSAGE:", message);
                console.log("📩 MESSAGE BODY:", message.body);
                
                const order = JSON.parse(message.body);
                console.log("✅ Order accepted:", order);
                setActiveOrder(order);
            }
        );
        
        return () => subscription.unsubscribe();
    }, [stompClientRef.current?.connected]);

    // Отмена поездки
    const handleCancelOrder = () => {
        console.log("ACTIVE ORDER", activeOrder)
            showChoicePopup(
                "Клиент ждет. Вы уверены, что хотите отменить заказ?",
                [
                    {
                        text: "Да, отменить",
                        className: "button red",
                        onClick: () => {
                            cancelOrderByDriver(stompClientRef, activeOrder.id);
                            toast("Заказ отменен");
                            setStep(0);
                            setTogglerOpenOrder(false)
                            setActiveOrder(null);
                            onLocationSelect({
                                routeCoordinates: null,
                            });
                        },
                    },
                    {
                        text: "Нет",
                        className: "popup-cancel",
                    },
                ],
                "confirm"
            );
    };

    //Завершение поездки
    const handleCompleteOrder = () => {
        //if (!activeOrder?.id) return;
        showChoicePopup(
            "Проверьте автомобиль на забытые вещи",
            [
                {
                    text: "Завершить",
                    className: "button red",
                    onClick: () => {
                        completeOrder(stompClientRef, activeOrder.id);
                    },
                },
                {
                    text: "Отмена",
                    className: "popup-cancel",
                },
            ],
            "confirm"
        );
    };
    // Подписка на завершение
    useEffect(() => {
        if (!stompClientRef.current?.connected) return;
        
        const subscription = stompClientRef.current.subscribe(
            "/user/queue/orderCompleted",
            (message) => {
                const orderId = Number(message.body);
                console.log("✅ Order completed:", orderId);
                
                if (activeOrder?.id === orderId) {
                    toast("Поездка завершена");
                    setStep(0);
                    setTogglerOpenOrder(false)
                    setActiveOrder(null);
                    onLocationSelect({
                        routeCoordinates: null,
                    });
                    getOrders();
                }
            }
        );
        
        return () => subscription.unsubscribe();
    }, [stompClientRef.current?.connected, activeOrder?.id]);

    function checkActiveOrder(){
        const token = getCookie('token');
        if(userData){
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
                if(res.length != 0){
                    console.log("reZZzz", res)
                    console.log("активно принятый", res)
                    shapeDecoder(res[0].encodedWay)
                    setActiveOrder(res[0])
                    currentOrderId.current = res[0].id
                    setStep(1)
                    setTogglerOpenOrder(true)
                }
            }).catch(error => {
                console.log(error)
            })
        }
    }
    useEffect(()=>{
        checkActiveOrder()
    }, [userData])

    function takeOrder(orderId){
        if (pendingOrderId || activeOrder) return;
        setPendingOrderId(orderId)
        acceptOrder(stompClientRef, orderId);
    }

    function acceptPassanger(orderId){
        workOrder(stompClientRef, orderId);
        setActiveOrder(prev => ({ 
            ...prev, 
            orderStatus: 'processed' 
        }));
    }

    //Шаги оформления заказа
    const [step, setStep] = useState(0)
    function handleNextStep(){
        setStep(step + 1)
    }

    function handlePrevStep(){
        setStep(step - 1)
    }

    const [orderIteration, setOrderIteration] = useState(0)

    function handleOrderIteration(){
        setOrderIteration(orderIteration + 1)
        shapeDecoder(orders[orderIteration].encodedWay)
        if(orderIteration >= orders.length-1){
            onLocationSelect({
                routeCoordinates: null,
            });
            setOrders([])
            setOrderIteration(0)
            setStep(0)
        }
    }

    function renderStepContent(){
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
                            <AvatarImage src={activeOrder?.status ? activeOrder.customerImage : orders && orders[orderIteration]?.customerImage} />
                            <AvatarFallback>{activeOrder?.customerName?.[0] ?? orders?.[orderIteration]?.customerName?.[0] ?? ''}</AvatarFallback>
                            </Avatar>
                            <div className='AccountBlockInfo'>
                            <div className='OrderInfoBlock'>
                                <h4 className='AccountName'>{activeOrder ? activeOrder.customerName : orders && userData ? orders?.[orderIteration]?.customerName : "Загрузка"}</h4>
                                <div className='OrderInfo'>Дистанция: {activeOrder ? activeOrder.routeDistanceKm : orders && userData ? orders?.[orderIteration]?.routeDistanceKm : 'Загрузка'}км</div>
                                <div className='OrderInfo'>Стоимость: {activeOrder ? activeOrder.price : userData ? Math.round(orders?.[orderIteration]?.price) : 0}₽</div>
                                <div className='OrderInfo'>Способ оплаты: {activeOrder ? activeOrder.paymentMethod : userData ? orders?.[orderIteration]?.paymentMethod : "Загрузка"}</div>
                            </div>
                            </div>
                            <Link href={`tel:${activeOrder ? activeOrder.customerPhone : userData ? orders[orderIteration]?.customerPhone : null}`} className='CallUser'><Image src={phoneIco} alt="Позвонить" /></Link>
                        </div>
                        <div className='OrderAddress'>
                            <div className='OrderAddressItem'>
                                <h3 className='AddressHeader'>От</h3>
                                <div className='Address'>{activeOrder ? activeOrder.addressFrom : userData ? orders[orderIteration]?.addressFrom : 'Загрузка'}</div> {/* Направление ОТ */}
                            </div>
                            <div className='OrderAddressItem'>
                                <h3 className='AddressHeader'>До</h3>
                                <div className='Address'>{activeOrder ? activeOrder.addressTo : userData ? orders[orderIteration]?.addressTo : 'Загрузка'}</div> {/* Направление До */}
                            </div>
                        </div>
                        {togglerOpenOrder ? 
                            <>
                                {activeOrder && activeOrder.orderStatus == 'active' ? 
                                    <>
                                        <div className={`Button green mb-4`} onClick={()=>{acceptPassanger(activeOrder ? activeOrder.id : orders[orderIteration])}}>Пассажир в автомобиле</div>
                                        <div className={`Button red`} onClick={handleCancelOrder}>Отменить поездку</div>
                                    </> : activeOrder?.orderStatus == 'processed' ? 
                                    <div className={`Button`} onClick={handleCompleteOrder}>Завершить поездку</div> : null
                                }
                                
                            </>
                            : 
                            <>
                                <div className={`OrderActions`}>
                                    <div className='OrderAction' onClick={()=>{handleOrderIteration()}}>
                                    <i className="fa-solid fa-xmark"></i>
                                    </div>
                                    <div className='OrderAction' onClick={()=>{orders?.[orderIteration] && takeOrder(orders[orderIteration].id)}}>
                                    <i className="fa-solid fa-check"></i>
                                    </div>
                                </div>
                            </>
                        }
                        
                    </div>
            </div>
            )
        }
    }
    return(
        <div className={`MapUi`}>
            {renderStepContent()}
        </div>
    )
}