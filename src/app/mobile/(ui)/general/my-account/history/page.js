'use client'
import Link from 'next/link'
import './style.sass'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import PagesHeader from '../../../components/PagesHeader/PagesHeader'

const localHostApi = process.env.NEXT_PUBLIC_MYSQL_API
export default function MyAccountPage(){
    // Получение sessionId из кук
    const [sessionKey, setSessionKey] = useState(null)
    useEffect(()=>{
            const cookieValue = Cookies.get('UserData')
            if (cookieValue) {
                try {
                    const userData = JSON.parse(cookieValue)
                    const sessionKey = userData.session_key.trim()
                    if(sessionKey){
                        setSessionKey(userData.session_key)
                        console.log("dsaghaskh")
                    }
                } catch (error) {
                    console.error("Ошибка при парсинге данных пользователя из cookie:", error)
                }
            }
    }, [])

    const [userData, setUserData] = useState([])
    const [userOrders, setUserOrders] = useState([])
    const [togglerPopupLoadingData, setTogglerPopupLoadingData] = useState('popup-open')
    
    useEffect(()=>{
        if(sessionKey !== ''){
            fetch(`/api/account-data/user-data?sessionId=${sessionKey}`,{
                method: 'GET'
            }).then((result)=>{
                return result.json()
            }).then((res)=>{
              console.log("DATA RES", res)
              if(res.length !== 0){
                setUserData(res[0])
                setTogglerPopupLoadingData('')
              }else{
                // router.push('/sign-in')
              }
            })
            .catch(error =>{
              console.log(error)
            })
        }
    }, [sessionKey])

    useEffect(()=>{
        console.log(userOrders)
    }, [userOrders])

    const [togglerType, setTogglerType] = useState('passenger')
    useEffect(()=>{
        if(togglerType === 'passenger'){
            fetch(`/api/orders-data/get-orders-history?UserId=${userData.UserId}`)
            .then((result)=>{
                return result.json()
            }).then((res)=>{
                if(userOrders.length <= 0){
                    setUserOrders(res)
                }
            }).catch(error =>{
                console.log("ОШИБКА получения заказов", error)
            })
        }else{
            fetch(`/api/orders-data/get-orders-history/for-driver?DriverId=${userData.UserId}`)
            .then((result)=>{
                return result.json()
            }).then((res)=>{
                setUserOrders(res)
            }).catch(error =>{
                console.log("ОШИБКА получения заказов", error)
            })
        }
    },[userData, togglerType])




    return(
        <div className="orders-history">
            <div className="container">
                <PagesHeader ReturnBtn="/mobile/my-account" PageHeader="История поездок"/>
                <div className='history'>
                    <div className='button-block'>
                        <div className={`order-type_btn ${togglerType === 'passenger' ? 'active' : null}`} onClick={()=>{setTogglerType('passenger')}}>Пассажир</div>
                        <div className={`order-type_btn ${togglerType === 'driver' ? 'active' : null}`} onClick={()=>{setTogglerType('driver')}}>Водитель</div>
                    </div>
                    <div className='history-block'>
                        {userOrders.map((OrderItem) =>{
                            const orderDate = new Date(OrderItem.Date)
    
                            // Используем методы объекта Date для получения компонентов даты и времени
                            const year = orderDate.getFullYear()
                            const month = String(orderDate.getMonth() + 1).padStart(2, '0') // добавляем нули к месяцу, если нужно
                            const day = String(orderDate.getDate()).padStart(2, '0') // добавляем нули к дню, если нужно
                            const hours = String(orderDate.getHours()).padStart(2, '0') // добавляем нули к часам, если нужно
                            const minutes = String(orderDate.getMinutes()).padStart(2, '0') // добавляем нули к минутам, если нужно

                            // Формируем строку в нужном формате
                            const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}`
                            if(togglerType !== 'driver'){
                                return(
                                    <div key={OrderItem.id} className='history-card'>
                                    <div className='driver driver-name'>Водитель: <span>{OrderItem.DriverName}</span></div>
                                    <div className='driver driver-number'>{OrderItem.DriverPhone}</div>
                                    <div className='driver driver-car_number'>Гос-номер: {OrderItem.VehicleNumber}</div>
                                    <div className='address-block'>
                                        <div className='address'>От: {OrderItem.AddressFrom}</div>
                                        <div className='address'>Куда: {OrderItem.AddressTo}</div>
                                    </div>
                                    <div className='date-time_price'>{formattedDate}<div>{OrderItem.Price}₽</div></div>
                                </div>
                                )
                            }else{
                                return(
                                    <div key={OrderItem.id} className='history-card'>
                                    <div className='driver driver-name'>Пассажир: <span>{OrderItem.CustomerName}</span></div>
                                    <div className='driver driver-number'>{OrderItem.CustomerPhone}</div>
                                    <div className='address-block'>
                                        <div className='address'>От: {OrderItem.AddressFrom}</div>
                                        <div className='address'>Куда: {OrderItem.AddressTo}</div>
                                    </div>
                                    <div className='date-time_price'>{formattedDate}<div>{OrderItem.Price}₽</div></div>
                                </div>
                                )
                            }
                        })}
                    </div>
                </div>
            </div>
            {/* Loading */}
            <div className={`popup-background ${togglerPopupLoadingData}`}></div>
            <div className={`popup popup-input-error ${togglerPopupLoadingData}`}>
                <h3 className='popup-input-error__text'>Загрузка</h3>
            </div>
            <div className={`popup-background ${togglerPopupLoadingData}`}></div>
        </div>
    )
}