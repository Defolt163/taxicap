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
import {
  registerPassengerHandlers,
  registerDriverHandlers,
  sendOrder, cancelOrder
} from "../socketHandlers";
import { useData } from '../DataContext'
import PopupConfirm from '../ui/Popups/PopupConfirm'
import { toast } from 'sonner'
// ICONS
import anglesDown from '@/../public/ico/ui/angles-down-solid-full.svg'
import shopIco from '@/../public/ico/ui/shop-solid-full.svg'
import chevronLeft from '@/../public/ico/ui/chevron-left-solid-full.svg'
import moneyTransfer from '@/../public/ico/ui/money-bill-transfer-solid-full.svg'
import phoneIco from '@/../public/ico/ui/phone-solid-full.svg'
import hospitalIco from '@/../public/ico/ui/hospital-regular-full.svg'
import documentIco from '@/../public/ico/ui/paperclip-solid-full.svg'
import { FaRegBuilding } from 'react-icons/fa6'
import { GoChevronRight } from "react-icons/go";
import { PiMapPin, PiMapPinLight } from "react-icons/pi";

const LAST_ORDER_KEY = "lastActiveOrderId";

const rememberOrder = (id) => {
    try { localStorage.setItem(LAST_ORDER_KEY, String(id)); } catch (e) {}
};
const forgetOrder = () => {
    try { localStorage.removeItem(LAST_ORDER_KEY); } catch (e) {}
};
const getRememberedOrder = () => {
    try { return Number(localStorage.getItem(LAST_ORDER_KEY)) || null; } catch (e) { return null; }
};

export default function ControlPassengerPanel({ onLocationSelect, onDriverPosition, onCoordFromPin, onCoordToPin }){
    const { userData, loadingStatus, setUserData } = useData()

    const { showChoicePopup, showPopup, showLoading, hideLoading  } = usePopup();
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null; // Если куки нет
    }
    function setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        const expiresStr = "expires=" + expires.toUTCString();
        document.cookie = `${name}=${value}; ${expiresStr}; path=/`;
    }
    function deleteCookie(name) {
        document.cookie = `${name}=; max-age=0; path=/`;
    }

    const [activeOrder, setActiveOrder] = useState(null)
    const [step, setStep] = useState(0)
    const [onlineDrivers, setOnlineDrivers] = useState(null)
    const mapApiKey = process.env.NEXT_PUBLIC_MAP_API_KEY
    const previousOrderStatusRef = useRef(null)

    function resetOrderUi(message) {
        deleteCookie('orid');
        previousOrderStatusRef.current = null;
        setActiveOrder(null);
        setStep(0);
        setRouteData(null);
        onLocationSelect({ routeCoordinates: null });
        if (message) showPopup(message);
    }
    const isCreatingOrderRef = useRef(false)
    async function checkActiveOrder() {
        if (!userData) return null;

        const token = getCookie("token");
        const orid = getCookie("orid");

        try {
            const response = await fetch("/api/orders-data/check-order", {
                method: "GET",
                cache: "no-store",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            const res = await response.json();
            if (!Array.isArray(res)) return null;

            const order = res[0];
            const status = order?.orderStatus;

            // заказ в работе: показываем его
            if (["created", "active", "processed"].includes(status)) {
                const prev = previousOrderStatusRef.current;
                previousOrderStatusRef.current = status;

                setActiveOrder(order);
                setCookie("orid", order.id, 1);
                shapeDecoder(order.encodedWay);
                setStep(status === "created" ? 2 : 3);

                if (status === "processed" && prev === "active") {
                    showPopup("Поездка началась! Не забудьте пристегнуться");
                }
                return order;
            }

            // заказа в работе нет, а мы его отслеживали: сброс и сообщение
            if (orid && !isCreatingOrderRef.current) {
                resetOrderUi(
                    status === "canceled" ? "Водитель отменил поездку"
                    : status === "complete" ? "Водитель завершил поездку"
                    : "Заказ отменён"
                );
            }
            return null;
        } catch (error) {
            console.error(error);
            return null;
        }
    }
    useEffect(() => {
        if (userData) checkActiveOrder()
    }, [userData])

    const checkActiveOrderRef = useRef(checkActiveOrder);
    checkActiveOrderRef.current = checkActiveOrder;
    
    useEffect(() => {
        let hiddenAt = null;

        const onChange = () => {
                if (document.visibilityState === "hidden") {
                    hiddenAt = Date.now();      // экран заблокирован или вкладку свернули
                    return;
                }

                const awayMs = hiddenAt ? Date.now() - hiddenAt : 0;
                hiddenAt = null;

                if (awayMs > 30000 && getCookie("orid")) {
                    window.location.reload();   // долго спали: перезагрузка
                    return;
                }

                checkActiveOrderRef.current();  // недолго: просто проверка
            };

        document.addEventListener("visibilitychange", onChange);
        return () => document.removeEventListener("visibilitychange", onChange);
    }, []);

    const { stompClientRef, isConnected } = useSocket({
        onOrderCreated: (orderId) => {
            hideLoading();
            //console.log("ORDER CREATED", orderId);
            isCreatingOrderRef.current = false;
            setStep(2)
        },

        onOrderCanceled: () => {
            hideLoading();
            showPopup(`К сожалению, машина не найдена`)
            setStep(0)
            setRouteData(null)
            onLocationSelect({
                routeCoordinates: null,
            });
            toast("Заказ отменен");
            setActiveOrder(null);
            deleteCookie('orid');
        },

        onOrderAccepted: (order) => {
            //console.log("Driver found", order);
            showPopup("Нашли водителя");
            setActiveOrder(order)
            previousOrderStatusRef.current = order.orderStatus;
            setStep(3);
        },

        onOrderCanceledByDriver: (orderId) => {  // ✅ Новый обработчик
            ////console.log("❌ Order canceled by driver:", orderId);
            resetOrderUi("Водитель отменил поездку");
            /* showPopup("Водитель отменил заказ");
            setActiveOrder(null);
            setStep(0);
            setRouteData(null);
            deleteCookie('orid') */
        },

        /* onOrderInWork: (order) => {
            //console.log("status changed", order);
        }, */

        onDriverLocation: (location) => { // ✅ Добавить этот обработчик
            //console.log("📍 Driver location received:", location);
        },

        onDriversOnline: setOnlineDrivers,

        onOrderCompleted: (orderId) => {  // ✅ Добавить
            //console.log("✅ Order completed:", orderId);
            showPopup("Водитель завершил поездку");
           //console.log("@")
            setActiveOrder(null);
            previousOrderStatusRef.current = null;
            setStep(0);
            setRouteData(null);
            deleteCookie('orid')
            onLocationSelect({
                routeCoordinates: null,
            });
            onCoordFromPin({ fromCoordinate: null });
            onCoordToPin({ toCoordinate: null });
        },
    })

    //Заказ в процессе
    useEffect(() => {
        // Подписываемся на изменение статуса заказа
        if (!activeOrder?.id || !stompClientRef.current?.connected) {
            //console.log("Ожидание соедниения");
            return;
        }
        
        const subscription = stompClientRef.current.subscribe(
            `/topic/order/${activeOrder.id}/status`,
            (message) => {
                const status = message.body;
                //console.log("📢 Order status changed to:", status);
                checkActiveOrder()
                if (status === 'processed') {
                    setActiveOrder(prev => ({ 
                        ...prev, 
                        orderStatus: 'processed' 
                    }));
                    showPopup("Поездка началась! Не забудьте пристегнуться");
                }
            }
        );
        return () => subscription.unsubscribe();
        /* return () => {
            if (subscription) subscription.unsubscribe();
        }; */
    }, [activeOrder?.id, stompClientRef.current?.connected]);

    // Геокодирование водителя
    useEffect(() => {
        // Ждем когда появится активный заказ и подключится сокет
        //console.log("ПОдп", stompClientRef.current?.connected)
        if (!activeOrder?.id) return
        
        //console.log("🚗 Подписываемся на координаты для заказа:", activeOrder.id);
        
        // Подписываемся на топик с координатами
        const checkConnection = setInterval(() => {
            if (stompClientRef.current?.connected) {
                clearInterval(checkConnection);
                
                //console.log("🚗 Подписываемся на координаты для заказа:", activeOrder.id);

                
                
                const subscription = stompClientRef.current.subscribe(
                    `/topic/order/${activeOrder.id}/location`,
                    (message) => {
                        const location = JSON.parse(message.body);
                        //console.log("📍 Получены координаты водителя:", location);
                        if (onDriverPosition) {
                            onDriverPosition(location);
                        }
                    }
                );
                
                // Сохраняем подписку для очистки
                window.driverSub = subscription;
            }
        }, 500);
        
        // Отписка при размонтировании
        return () => {
            clearInterval(checkConnection);
            if (window.driverSub) window.driverSub.unsubscribe();
        };
    }, [activeOrder?.id]);

    /* function popupError(text) {
        showPopup(text);
    } */

    // Подтверждение отмены заказа
    const handleCancelOrder = async () => {
        const order = await checkActiveOrder();

        //console.log("active", order);

        if (!order) return;

        if (order.orderStatus == "active") {
            showChoicePopup(
                "Водитель уже в пути. Вы уверены, что хотите отменить заказ?",
                [
                    {
                        text: "Да, отменить",
                        className: "button red",
                        onClick: () => {
                            showLoading('Отменяем поездку...')
                            cancelOrder(stompClientRef, order.id);
                        },
                    },
                    {
                        text: "Нет, оставить",
                        className: "popup-cancel",
                    },
                ],
                "confirm"
            );
        } else if (order.orderStatus == "created") {
            showChoicePopup(
                "Вы действительно хотите отменить заказ?",
                [
                    {
                        text: "Да, отменить",
                        className: "button red",
                        onClick: () => {
                            showLoading('Отменяем поездку...')
                            cancelOrder(stompClientRef, order.id);
                            /* toast("Заказ отменен");
                            setStep(0);
                            setActiveOrder(null);
                            onLocationSelect({
                                routeCoordinates: null,
                            }); */
                        },
                    },
                    {
                        text: "Нет, подожду",
                        className: "popup-cancel",
                    },
                ],
                "confirm"
            );
        }
    };

    const [addressFrom, setAddressFrom] = useState({input: '', coords: null})
    const [addressTo, setAddressTo] = useState({input: '', coords: null})

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
            if (activeOrder == null){
                handleNextStep()
            }
        }
        return coordinates;
        
        ////console.log(coordinates)
    };

    const [routeData, setRouteData] = useState(null)
    const [paymentMethodValue, setPaymentMethodValue] = useState("Наличные");
    useEffect(()=>{
       //console.log(addressTo)
    }, [addressTo])
    async function sendDriveData(fastAddress, lat, lon) {
        const token = getCookie('token');
        if (fastAddress == "" && (addressFrom.input === "" || addressTo.input === "")){
            //console.log("fastAddress", fastAddress)
            showPopup(`${addressFrom == "" ? "Откуда едем?" : "Куда едем?"}`)
        }
        if (fastAddress && addressFrom.input == ""){
            showPopup("Откуда едем?")
            return
        }
        if(fastAddress){
            setAddressTo({input: fastAddress})
        }
        showLoading("Загрузка маршрута")
        try {
            const response = await fetch(`/api/geo`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "from": addressFrom.input,
                    "to": addressTo.input != "" ? addressTo.input : fastAddress,
                    "coordsFrom": addressFrom.coords,
                    "coordsTo": !lat || !lon ? addressTo.coords : {'lat': lat, 'lon': lon}
                })
            });
            const responseText = await response.text();
            let result;
            try {
                result = JSON.parse(responseText);
            } catch {
                result = responseText;
            }
            hideLoading();
            if (!response.ok) {
                throw new Error(typeof result === 'string' ? result : result.message || 'Ошибка определения маршрута');
            }

            if (!result || typeof result !== 'object' || !result.shape) {
                throw new Error('Не удалось построить маршрут по указанным адресам');
            }

            shapeDecoder(result.shape)
            setRouteData(result)
        } catch (error){
            hideLoading();
            showPopup(error.message)
        }
    }
    const handleCreateOrder = async () => {
        showLoading('Создаем поездку...');
        const existingOrder = await checkActiveOrder();
        if (existingOrder) {
            hideLoading();
            showPopup("У вас уже есть незавершённый заказ. Обновите страницу");
            return;
        }

        const orderData = {
            customerPhone: userData.UserPhone,
            userId: userData.UserId,
            orderStatus: "created",
            customerName: userData.UserName,
            latFrom: 54.43,
            lonFrom: 51.46,
            latTo: 54.44,
            lonTo: 51.51,
            addressFrom: addressFrom.input,
            addressTo: addressTo.input,
            price: routeData.price,
            paymentMethod: paymentMethodValue,
            encodedWay: routeData.shape,
            routeDistanceMeters: routeData.length_meters,
            routeDistanceKm: routeData.length_km
        };
        //setActiveOrder({orderStatus: "created"})
        isCreatingOrderRef.current = true;
        sendOrder(stompClientRef, orderData);
    };
    useEffect(() => {
        const handler = (e) => {
            //console.log("EVENT RECEIVED", e.detail);
            handleNextStep()
        };

        window.addEventListener("orderCreated", handler);

        return () => {
            window.removeEventListener("orderCreated", handler);
            //console.log("listener removed");
        }
    }, []);

    // Геопоиск
    const [fromList, setFromList] = useState([]);
    const [toList, setToList] = useState([]);
    const [activeAddressInput, setActiveAddressInput] = useState(null);

    const debounceRef = useRef(null);
    const abortRef = useRef(null);

    function addressHint(q, input) {
        setActiveAddressInput(input);

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        if (!q || q.length < 2) {
            // очищаем именно тот список, который относится к инпуту
            if (input === "from") setFromList([]);
            else setToList([]);
            return;
        }

        debounceRef.current = setTimeout(async () => {
            if (abortRef.current) abortRef.current.abort();
            abortRef.current = new AbortController();

            const token = getCookie("token");
            if (!userData || !token) return;

            try {
                const response = await fetch(
                    `/api/geosearch?q=${encodeURIComponent(q)}`,
                    {
                        headers: { "Authorization": `Bearer ${token}` },
                        signal: abortRef.current.signal,
                    }
                );
                const res = await response.json();
                const list = Array.isArray(res) ? res : [];

                // ← раскладываем в нужный список
                if (input === "from") setFromList(list);
                else setToList(list);
            } catch (error) {
                if (error.name === "AbortError") return;
                console.error(error);
                if (input === "from") setFromList([]);
                else setToList([]);
            }
        }, 300);
    }

    //Шаги оформления заказа
    function handleNextStep(){
        setStep(step + 1)
    }

    function handlePrevStep(){
        setStep(step - 1)
    }

    const renderStepContent = () => {
        switch (step) {
            case 0:
            return(
                <>
                    <div className={`AddressInputBlock`}>
                        <h3 className='PopupHeader PopupAddressHeader'>Куда едем?</h3>
                        <div className='AddressInputBlockItem'>
                            <label className='AddressInputLabel' htmlFor="input-from"><div className="AddressInputIco"><Image width={25} src={anglesDown} alt='angles down'/></div></label>
                            <input className='InputUiMap' placeholder='Текущий адрес' id='input-from' 
                                value={addressFrom.input} 
                                onChange={(e) => {
                                    setAddressFrom({input:e.target.value});
                                    addressHint(e.target.value, "from");
                                }}
                                onFocus={() => {setActiveAddressInput("from"), setFromList([])}} 
                                onBlur={() => setTimeout(() => setActiveAddressInput(null), 200)}
                                />
                        </div>
                        {activeAddressInput === "from" && fromList.length > 0 && (
                            <div className='AddressHintBlock overflow-y-scroll max-h-[200px]'>
                                {fromList.map((item) => {
                                    const isPlace = item.type === 'place';
                                    const label = isPlace
                                        ? `${item.name}, ${item.address}`
                                        : (item.house ? `${item.street}, ${item.house}` : item.street);
                                    const coords = item.lat ? {'lat': item.lat, 'lon': item.lon} : null
                                    return(
                                    <div
                                        key={item.id || `${item.street}-${item.house}`}
                                        className='AddressHintItem flex text-md p-4 items-center border-b justify-between'
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            setAddressFrom({input: label+" ", coords: coords});
                                           //console.log(coords)
                                            onCoordFromPin({ 
                                                fromCoordinate: coords
                                            });
                                            setFromList([]);
                                            setActiveAddressInput(null);
                                        }}
                                    >
                                        <div className='flex items-center'>
                                            <FaRegBuilding className='text-[28px] text-gray-400 mr-2'/>
                                            {isPlace ? (
                                                <div>
                                                    <div>{item.name}</div>
                                                    <div className='text-sm text-gray-400'>{item.address}</div>
                                                </div>
                                            ) : (
                                                !item.house ? item.street : item.street + `, ` + item.house
                                            )}
                                        </div>
                                        <GoChevronRight/>
                                    </div>)
                                })}
                            </div>
                        )}
                        <div className='AddressInputBlockItem AddressFuckedInputBlockItem'>
                            <label className='AddressInputLabel' htmlFor="input-to"><div className="AddressInputIco text-[25px]"><PiMapPin />{/* <Image width={25} src={shopIco} alt='shop'/> */}</div></label>
                            <input className='InputUiMap' 
                                placeholder='Куда поедете?' 
                                id='input-to' value={addressTo.input} 
                                onChange={(e)=>(setAddressTo({input: e.target.value}), addressHint(e.target.value, "to"))}
                                onFocus={() => {setActiveAddressInput("to"), setToList([])}} 
                                onBlur={() => setTimeout(() => setActiveAddressInput(null), 200)}
                                />
                        </div>
                        {activeAddressInput === "to" && toList.length > 0 && (
                            <div className='AddressHintBlock overflow-y-scroll border-t max-h-[200px] '>
                                {toList.map((item) => {
                                    const isPlace = item.type === 'place';
                                    const label = isPlace
                                        ? `${item.name}, ${item.address}`
                                        : (item.house ? `${item.street}, ${item.house}` : item.street);
                                    const coords = item.lat ? {'lat': item.lat, 'lon': item.lon} : null
                                    return(
                                    <div
                                        key={item.id || `${item.street}-${item.house}`}
                                        className='AddressHintItem flex text-md p-4 items-center border-b justify-between'
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            setAddressTo({input: label+" ", coords: coords});
                                            onCoordToPin({ 
                                                toCoordinate: coords
                                            });
                                            setToList([]);
                                            setActiveAddressInput(null);
                                        }}
                                    >
                                        <div className='flex items-center'>
                                            <FaRegBuilding className='text-[28px] text-gray-400 mr-2'/>
                                            {isPlace ? (
                                                <div>
                                                    <div>{item.name}</div>
                                                    <div className='text-sm text-gray-400'>{item.address}</div>
                                                </div>
                                            ) : (
                                                !item.house ? item.street : item.street + `, ` + item.house
                                            )}
                                        </div>
                                        <GoChevronRight/>
                                    </div>)
                                })}
                            </div>
                        )}
                        <h3 className='mt-2 mb-3 font-bold text-sm text-gray-600'>Популярные места</h3>
                        <div className='AdvancedMenu'>
                        <div className='FastAddressBlock'>
                            <div className='FastAddressBlockItem' onClick={()=>{sendDriveData("Больничная улица, 4", 54.423565, 51.484111)}}>
                                <div className='image_wrapper'>
                                    <Image src={hospitalIco} alt='shop'/>
                                </div>
                                {/* <i className="fa-solid fa-hospital FastAddressBlockItemIco"></i> */}
                                <div className='FastAddressBlockItemHeader'>Больница</div>
                                <div className='FastAddressBlockItemSubHeader'>Больничная ул. 4</div>
                            </div>
                            <div className='FastAddressBlockItem' onClick={()=>{sendDriveData("Советская улица, 11", 54.431626, 51.466153)}}>
                                <div className='image_wrapper'>
                                    <Image src={documentIco} alt='shop'/>
                                </div>
                                {/* <i className="fa-regular fa-flag FastAddressBlockItemIco"></i> */}
                                <div className='FastAddressBlockItemHeader'>МФЦ</div>
                                <div className='FastAddressBlockItemSubHeader'>Советская ул. 11</div>
                            </div>
                        </div>
                        </div>
                        <div className='Button' onClick={()=>{sendDriveData()}}>Поиск</div>
                    </div>
                </>
            )
            case 1:
            return(
                <>
                    <div className={`AddressInputBlock CarVariant`}>
                        <div className='AddressInputBlockReturn' onClick={()=>{handlePrevStep()}}>
                            <div className="AddressInputIco"><Image width={25} src={chevronLeft} alt='cheevron-left'/></div>
                        </div>
                        <h3 className='PopupHeader PopupAddressHeader'>Можем предложить...</h3>
                        <div className='CarVariantBlock'>
                            <div className='CarVariantBlockItem my-4'>
                                <div className='CarVariantBlockItemWrapper'>
                                    <Image src={carIco} alt='car'/>
                                    <div className='CarVariantBlockItemDescr'>
                                        <div className='CarVariantBlockItemHeader'>Эконом</div>
                                        <div className='CarVariantBlockItemPlaces'>3 Места</div>
                                    </div>
                                </div>
                                <div className='CarVariantBlockItemPrice'>{routeData?.price}₽</div>
                            </div>
                            <div className='PaymentMethod'>
                                <h4 className='mb-2'>Способ оплаты</h4>
                                <Select value={paymentMethodValue} onValueChange={setPaymentMethodValue}>
                                <SelectTrigger className="w-[100%] PaymentSelectedMethodItem">
                                    <SelectValue aria-label={paymentMethodValue}/>
                                </SelectTrigger>
                                <SelectContent style={{zIndex: 9999}}>
                                    <SelectItem className='PaymentMethodItem ' value="Наличные">
                                    <div className='PaymentMethodItemIcoWrapper'>
                                        <Image className='PaymentMethodItemIco' alt='cashIco' src={cashIco}/>
                                    </div>
                                    <div className='PaymentMethodItemText'>Наличные</div>
                                    </SelectItem>
                                    <SelectItem className='PaymentMethodItem' value="Перевод">
                                    <div className='PaymentMethodItemIcoWrapper'> 
                                        <Image className='PaymentMethodItemIco' width={25} alt='money-bill' src={moneyTransfer}/>
                                    </div>
                                    <div className='PaymentMethodItemText'>Перевод</div>
                                    </SelectItem>
                                </SelectContent>
                                </Select>
                            </div>
                            <div className='Button' onClick={handleCreateOrder}>Подтвердить</div>
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
                    <div className='Button' onClick={handleCancelOrder}>Отменить</div>
                    </div>
                </>
            )
            case 3:
                return(
                <>
                    <div className='AddressInputBlock DriveActive'>
                    {/* <h3 className='ItemsHeader ItemsHeader__center'>Водитель прибудет через <br/>  минут</h3> */}
                    <div className='AccountBlock'>
                        {/* <div className='AccountIco' style={{backgroundImage: `url(${activeOrder !== undefined ? activeOrder[0].DriverImage : '/ico/man-user.svg'})`}}></div> */}
                        <div className='AccountBlockInfo'>
                            <Avatar className='AccountIco'>
                                <AvatarImage src={activeOrder.driverImage} />
                                <AvatarFallback>{activeOrder.driverName[0]}</AvatarFallback>
                            </Avatar>
                            <div className='AccountDescrBlock'>
                                <h4 className='AccountName'>{activeOrder !== undefined ? activeOrder.driverName : null}</h4>
                                <div className='CarInfo'>
                                <div className='CarModel'>{activeOrder !== undefined ? activeOrder.vehicleColor : null} {activeOrder !== undefined ? activeOrder.vehicleBrand : null}       {activeOrder !== undefined ? activeOrder.vehicleModel : null} <br/> <strong>{activeOrder !== undefined ? activeOrder.vehicleNumber : null}</strong></div>
                                </div>
                            </div>
                        </div>
                        <Link href={`tel:8${activeOrder !== undefined ? activeOrder.driverPhone : null}`} className='CallUser'><Image src={phoneIco} alt='Позвонить'/></Link>
                    </div>
                    <div className='AddressOrderBlock'>
                        <div className='AddressOrderItem'>
                            <div style={{background: 'url(/ico/ui/angles-down-solid-full.svg) center center/cover'}} className="AddressInputIco"></div>
                        <div className='AddressOrderText'>{activeOrder !== undefined ? activeOrder.addressFrom : null}</div>
                        </div>
                        <div className='AddressOrderItem'>
                            <div style={{background: 'url(/ico/ui/check-solid-full.svg) center center/cover'}} className="AddressInputIco"></div>
                            <div className='AddressOrderText'>{activeOrder !== undefined ? activeOrder.addressTo : null}</div>
                        </div>
                    </div>
                    <div className='Payment mb-4'>
                        <div className='PaymentItem'>
                        <div className='PaymentHeader'>Способ оплаты:</div>
                        <h4 className='PaymentInfo'>{activeOrder !== undefined ? activeOrder.paymentMethod : null}</h4>
                        </div>
                        <div className='PaymentItem'>
                        <div className='PaymentHeader'>Стоимость:</div>
                        <h4 className='PaymentInfo'>{activeOrder !== undefined ? activeOrder.price : null} ₽</h4>
                        </div>
                    </div>
                    {activeOrder?.orderStatus == 'active' ? <div className={`Button`} onClick={handleCancelOrder}>Отменить поездку</div> : null}
                    </div>
                </>
            )
        }}
    return(
        <>
            <div className={`MapUi`}>
                <div className="DriversOnlineCount">
                    Водителей в сети: {onlineDrivers === null ? '...' : onlineDrivers}
                </div>
                {renderStepContent()}
            </div>
        </>
    )
}