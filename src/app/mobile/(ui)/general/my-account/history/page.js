'use client'
import Link from 'next/link'
import './style.sass'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import PagesHeader from '../../../../components/PagesHeader/PagesHeader'
const crypto = require('crypto');
import { useData } from '@/app/mobile/components/DataContext'

const localHostApi = process.env.NEXT_PUBLIC_MYSQL_API
export default function MyAccountPage(){
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null; // Если куки нет
    }
    const [userOrders, setUserOrders] = useState([])
    async function decryptData(encodedMessage, messageIv) {
        // Преобразуем ключ и IV из шестнадцатеричного формата
        const key = Buffer.from('16cf126a9dc4e39e405a03ad0fb2f31d91f6b73342c7d7647772e104aa8d7e39', 'hex'); // Ключ AES-256
        const iv = Buffer.from(messageIv, 'hex'); // IV (инициализационный вектор)

        // Зашифрованные данные, полученные с сервера
        //const encryptedData = 'cfcb8759af160c6ac29aad5fe6afb2febad2f87f15ebb20ecfd570b81547a6cb0f0ff7e331038f9bc786837810f4e92f78a2880d6c696aa7b8cd2efd130850ddee5a879dbc5799d7e56b5206e3e94a3087fed032fdbec0565395fe407487311cfe9e7c5790c5d566436e7150beaced8b01cc2c9cb97eda68fc0c8be6ac7014acf99536ad397b3f402c65d73740d99f8d0109b5f44367872e1ecb61d1503342f97036f9b4ed6eae19b74d9639a819f5c41b191160d39e0b67c8e56e51ef14c0d4ff7cd308d5bcd76c942b6a417aae3845c107fa222ecaeb5803589f3202b2b19433b419f2ffc29eb4b981d8931894907372de21c275fa39c657750099cc0e0d0f56070c208e1c61022097b72ab9fcccedbe94ce4b6e5ea2912ec92ad58257d48b787046a0c714c7e4f87b4f071fdcf6f8';

        // Преобразуем зашифрованные данные в Buffer
        const encryptedBuffer = Buffer.from(encodedMessage, 'hex');

        // Создаем расшифровщик
        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

        // Расшифровка данных
        let decrypted = decipher.update(encryptedBuffer, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        let parsedData = JSON.parse(decrypted)
        setUserOrders(parsedData)
    }

    async function fetchOrdersData() {
            const token = getCookie('token'); // Получаем токен из куки
            if (token !== null){
                try{
                    const response = await fetch(`/api/orders-data/get-orders-history?status=${togglerType}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                    })
                    const result = await response.json();
                    if(!response.ok){
                    } else {
                        decryptData(result.orders.encryptedData, result.orders.iv)
                        setTogglerPopupLoadingData('')
                    }
                } catch (error){
                    alert(`ошибка на странице: ${error}`)
                }
            }
        }
        const [togglerPopupLoadingData, setTogglerPopupLoadingData] = useState('popup-open')

        const [togglerType, setTogglerType] = useState('passenger')
        useEffect(() => {
            fetchOrdersData();
        }, [togglerType]);
    

    return(
        <div className="orders-history">
            <div className="container">
                <PagesHeader ReturnBtn="../my-account" PageHeader="История поездок"/>
                <div className='history'>
                    <div className='button-block'>
                        <div className={`order-type_btn ${togglerType === 'passenger' ? 'active' : null}`} onClick={()=>{setTogglerType('passenger')}}>Пассажир</div>
                        <div className={`order-type_btn ${togglerType === 'driver' ? 'active' : null}`} onClick={()=>{setTogglerType('driver')}}>Водитель</div>
                    </div>
                    <div className='history-block'>
                        {userOrders && userOrders.length !== 0 ? userOrders.map((OrderItem) =>{
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
                        }) : <h2>Пока что здесь пусто..</h2>}
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