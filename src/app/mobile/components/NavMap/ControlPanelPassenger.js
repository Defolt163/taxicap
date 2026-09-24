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
import documentIco from '@/../public/ico/ui/landmark-solid-full.svg'

export default function ControlPassengerPanel({ onLocationSelect, onDriverPosition }){
    const { userData, loadingStatus, setUserData } = useData()

    const { showChoicePopup, showPopup } = usePopup();
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null; // Если куки нет
    }

    const [activeOrder, setActiveOrder] = useState(null)
    const previousOrderStatusRef = useRef(null)
    const isCreatingOrderRef = useRef(false)
    async function checkActiveOrder() {
        const token = getCookie("token");

        if (!userData) return null;

        try {
            const response = await fetch("/api/orders-data/check-order", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            const res = await response.json();

            if (!res.length) {
                return null;
            }

            const order = res[0];
            const previousStatus = previousOrderStatusRef.current;
            previousOrderStatusRef.current = order.orderStatus;

            if (order.orderStatus === "created") {
                setActiveOrder(order);

                shapeDecoder(order.encodedWay);
                setStep(2);
            } else if (
                order.orderStatus === "active" ||
                order.orderStatus === "processed"
            ) {
                setActiveOrder(order);

                shapeDecoder(order.encodedWay);
                setStep(3);

                if (order.orderStatus === "processed" && previousStatus === "active") {
                    showPopup("Поездка началась! Не забудьте пристегнуться");
                }
            } else if (order.orderStatus === "complete") {
                if (isCreatingOrderRef.current) {
                    return null;
                }

                if (previousStatus !== "active" && previousStatus !== "processed") {
                    return null;
                }

                showPopup("Водитель завершил поездку");
                previousOrderStatusRef.current = null;
                setActiveOrder(null);
                setStep(0);
                setRouteData(null);
                onLocationSelect({ routeCoordinates: null });
                return null;
            }

            return order; // 👈 ВОТ ЭТО ГЛАВНОЕ

        } catch (error) {
            console.error(error);
            return null;
        }
    }
    useEffect(()=>{
        checkActiveOrder()

        const checkWhenActive = () => {
            if (document.visibilityState === "visible") {
                checkActiveOrder()
            }
        }

        document.addEventListener("visibilitychange", checkWhenActive)
        window.addEventListener("focus", checkWhenActive)
        const statusInterval = window.setInterval(checkWhenActive, 5000)

        return () => {
            document.removeEventListener("visibilitychange", checkWhenActive)
            window.removeEventListener("focus", checkWhenActive)
            window.clearInterval(statusInterval)
        }
    }, [userData])

    const stompClientRef = useSocket({
        onOrderCreated: (orderId) => {
            console.log("ORDER CREATED", orderId);
            isCreatingOrderRef.current = false;
            setStep(2)
        },

        onOrderCanceled: () => {
            showPopup(`К сожалению, машина не найдена`)
            setStep(0)
            setRouteData(null)
            onLocationSelect({
                routeCoordinates: null,
            });
        },

        onOrderAccepted: (order) => {
            console.log("Driver found", order);
            setActiveOrder(order)
            previousOrderStatusRef.current = order.orderStatus;
            setStep(3);
        },

        onOrderCanceledByDriver: (orderId) => {  // ✅ Новый обработчик
            //console.log("❌ Order canceled by driver:", orderId);
            showPopup("Водитель отменил заказ");
            setActiveOrder(null);
            setStep(0);
            setRouteData(null);
        },

        /* onOrderInWork: (order) => {
            console.log("status changed", order);
        }, */

        onDriverLocation: (location) => { // ✅ Добавить этот обработчик
            console.log("📍 Driver location received:", location);
        },

        onOrderCompleted: (orderId) => {  // ✅ Добавить
            //console.log("✅ Order completed:", orderId);
            showPopup("Водитель завершил поездку");
            setActiveOrder(null);
            previousOrderStatusRef.current = null;
            setStep(0);
            setRouteData(null);
            onLocationSelect({
                routeCoordinates: null,
            });
        },
    })

    //Заказ в процессе
    useEffect(() => {
        // Подписываемся на изменение статуса заказа
        if (!activeOrder?.id || !stompClientRef.current?.connected) {
            console.log("Ожидание соедниения");
            return;
        }
        
        const subscription = stompClientRef.current.subscribe(
            `/topic/order/${activeOrder.id}/status`,
            (message) => {
                const status = message.body;
                console.log("📢 Order status changed to:", status);
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
        
        return () => {
            if (subscription) subscription.unsubscribe();
        };
    }, [activeOrder?.id, stompClientRef.current?.connected]);

    // Геокодирование водителя
    useEffect(() => {
        // Ждем когда появится активный заказ и подключится сокет
        console.log("ПОдп", stompClientRef.current?.connected)
        if (!activeOrder?.id) return
        
        //console.log("🚗 Подписываемся на координаты для заказа:", activeOrder.id);
        
        // Подписываемся на топик с координатами
        const checkConnection = setInterval(() => {
            if (stompClientRef.current?.connected) {
                clearInterval(checkConnection);
                
                console.log("🚗 Подписываемся на координаты для заказа:", activeOrder.id);

                
                
                const subscription = stompClientRef.current.subscribe(
                    `/topic/order/${activeOrder.id}/location`,
                    (message) => {
                        const location = JSON.parse(message.body);
                        console.log("📍 Получены координаты водителя:", location);
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

        console.log("active", order);

        if (!order) return;

        if (order.orderStatus == "active") {
            showChoicePopup(
                "Водитель уже в пути. Вы уверены, что хотите отменить заказ?",
                [
                    {
                        text: "Да, отменить",
                        className: "button red",
                        onClick: () => {
                            cancelOrder(stompClientRef, order.id);
                            toast("Заказ отменен");
                            setStep(0);
                            setActiveOrder(null);
                            onLocationSelect({
                                routeCoordinates: null,
                            });
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
                            cancelOrder(stompClientRef, order.id);
                            toast("Заказ отменен");
                            setStep(0);
                            setActiveOrder(null);
                            onLocationSelect({
                                routeCoordinates: null,
                            });
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

    const [addressFrom, setAddressFrom] = useState("")
    const [addressTo, setAddressTo] = useState("")

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
        
        //console.log(coordinates)
    };

    const [routeData, setRouteData] = useState(null)
    const [paymentMethodValue, setPaymentMethodValue] = useState("Наличные");
    async function sendDriveData(fastAddress) {
        const token = getCookie('token');
        if (fastAddress == "" && (addressFrom === "" || addressTo === "")){
            console.log("fastAddress", fastAddress)
            popupError(`${addressFrom == "" ? "Откуда едем?" : "Куда едем?"}`)
        }
        if (fastAddress && addressFrom == ""){
            popupError("Откуда едем?")
            return
        }
        if(fastAddress){
            setAddressTo(fastAddress)
        }

        try {
            await fetch(`/api/geo`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "from": addressFrom,
                    "to": addressTo != "" ? addressTo : fastAddress
                })
            }).then((request) =>{
                return request.json()
            }).then((result)=>{
                console.log(result)
                shapeDecoder(result.shape)
                setRouteData(result)
            }).catch((error)=>{
                popupError(error.message)
            })
        } catch (error){
            popupError(error.message)
        }
    }
    const handleCreateOrder = async () => {
        const existingOrder = await checkActiveOrder();
        if (existingOrder) {
            showPopup("У вас уже есть незавершённый заказ");
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
            addressFrom,
            addressTo,
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
            console.log("EVENT RECEIVED", e.detail);
            handleNextStep()
        };

        window.addEventListener("orderCreated", handler);

        return () => {
            window.removeEventListener("orderCreated", handler);
            console.log("listener removed");
        }
    }, []);
    //Шаги оформления заказа
    const [step, setStep] = useState(0)
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
                            <input className='InputUiMap' placeholder='Текущий адрес' id='input-from' value={addressFrom} onChange={(e)=>setAddressFrom(e.target.value)}/>
                        </div>
                        <div className='AddressInputBlockItem AddressFuckedInputBlockItem'>
                            <label className='AddressInputLabel' htmlFor="input-to"><div className="AddressInputIco"><Image width={25} src={shopIco} alt='shop'/></div></label>
                            <input className='InputUiMap' placeholder='Куда поедете?' id='input-to' value={addressTo} onChange={(e)=>setAddressTo(e.target.value)}/>
                        </div>
                        <div className='AdvancedMenu'>
                        <div className='FastAddressBlock'>
                            <div className='FastAddressBlockItem' onClick={()=>{sendDriveData("Больничная улица, 4")}}>
                                <Image src={hospitalIco} alt='shop'/>
                                {/* <i className="fa-solid fa-hospital FastAddressBlockItemIco"></i> */}
                                <div className='FastAddressBlockItemHeader'>Больница</div>
                                <div className='FastAddressBlockItemSubHeader'>Больничная ул. 4</div>
                            </div>
                            <div className='FastAddressBlockItem' onClick={()=>{sendDriveData("Советская улица, 11")}}>
                                <Image src={documentIco} alt='shop'/>
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
                    <h3 className='ItemsHeader ItemsHeader__center'>Водитель прибудет через <br/>  минут</h3>
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
                            <div className='CarModel'>{activeOrder !== undefined ? activeOrder.vehicleColor : null} {activeOrder !== undefined ? activeOrder.vehicleBrand : null} {activeOrder !== undefined ? activeOrder.vehicleModel : null} <br/> <strong>{activeOrder !== undefined ? activeOrder.vehicleNumber : null}</strong></div>
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
                            <i className="fa-solid AddressInputIco fa-check"></i>
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
        <div className={`MapUi`}>
            {renderStepContent()}
        </div>
    )
}