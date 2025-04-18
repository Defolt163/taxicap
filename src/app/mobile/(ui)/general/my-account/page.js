'use client'
import Link from 'next/link'
import './style.sass'
import Image from 'next/image'
import userIco from '/public/ico/man-user.svg'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import PagesHeader from '../../../components/PagesHeader/PagesHeader'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useData } from '../../../components/DataContext'

export default function MyAccountPage(){
    const { userData, setUserData, loadingStatus } = useData()
    // Модальные окна
    const [togglerPopupLoadingData, setTogglerPopupLoadingData] = useState('popup-open')
    const [togglerPopupDeleteCar, setTogglerPopupDeleteCar] = useState('')
    const [togglerPopupSuccessDeleteCar, setTogglerPopupSuccessDeleteCar] = useState('')
    const [togglerPopupErrorDeleteCar, setTogglerPopupErrorDeleteCar] = useState('')
    // Модальные окна
    useEffect(() => {
        if (!loadingStatus) {
          setTogglerPopupLoadingData('');
        }
      }, [loadingStatus])

    // Обновление статуса аккаунта
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null; // Если куки нет
    }
    async function updateDriverMode(mode){
        const token = getCookie('token');
        const newMode = userData.DriverMode === 1 ? 0 : 1;
        try{
            setTogglerPopupLoadingData('popup-open')
            const response = await fetch('/api/account-data/change-driver-mode', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ driverMode: mode })
            })
            if(response.ok){
                setTogglerPopupLoadingData('')
                setUserData({
                    ...userData,
                    DriverMode: newMode,
                });
            }
        } catch (error){
            console.log(`Ошибка ${error}`)
        }
    }

    async function deleteCar(){
        const token = getCookie('token');
        setTogglerPopupDeleteCar('')
        try{
            setTogglerPopupLoadingData('popup-open')
            const response = await fetch('/api/account-data/change-car', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            })
            if(response.ok){
                setTogglerPopupLoadingData('')
                setTogglerPopupSuccessDeleteCar('popup-open')
                setUserData({
                    ...userData,
                    VehicleBrand: null,
                    VehicleModel: null,
                    VehicleColor: null,
                    VehicleNumber: null
                });
            }
        } catch (error){
            setTogglerPopupErrorDeleteCar('popup-open')
        }
    }


    // UPDATE accounts SET VehicleBrand = 'Toyota', VehicleModel = 'Camry', VehicleColor = 'Black', VehicleNumber = 'A123BC' WHERE UserId = 1; 


    return(
        <div className="MyAccountPage">
            <div className="container">
                <PagesHeader ReturnBtn="/mobile/general" PageHeader="Мой аккаунт"/>
                <div className='MyAccountPageAccount'>
                    <div className='AccountCard'>
                        <Avatar className='AccountCardIco'>
                            <AvatarImage src={userData && userData.UserImage} />
                            <AvatarFallback>{userData && userData.UserName.slice(0,1)}</AvatarFallback>
                        </Avatar>
                        {/* <div style={{backgroundImage: `url(${userData.UserImage === null ? '/ico/man-user.svg' : userData.UserImage})`}} className='AccountCardIco' alt='user ico'/> */}
                        <div className='AccountCardData'>
                            <div className='AccountCardDataFirst'>{userData && userData.UserName}</div>
                            <div className='AccountCardDataSecond'>{userData && userData.UserEmail}</div>
                            <div className='AccountCardDataThird'><i className="fa-solid fa-phone"></i> +7 {userData && userData.UserPhone.toString().substring(1)}</div>
                        </div>
                        <Link href='my-account/account-edit' className='AccountCardEdit'>
                            <i className="fa-solid fa-pencil"></i>
                        </Link>
                    </div>
                </div>
                <div className='MyAccountPageAccount history'>
                    <div className='AccountCard'>
                        <Link href='my-account/history'>История поездок</Link>
                    </div>
                </div>
                <div className='AccountToggleModeBox'>
                    <label className='AccountToggleMode' htmlFor='driver-mode'>Режим водителя</label>
                    <label className="TogglerWrapper">
                        <input id='driver-mode' className='TogglerChecker' type="checkbox" checked={userData && userData && userData.DriverMode === 1 } onChange={(e) => {
                            if (e.target.checked && userData.DriverMode === 0) {
                                updateDriverMode(1)
                            } else {
                                //setDriverMode(driverMode === 1 ? 0 : 1)
                                updateDriverMode(userData && userData.DriverMode === 1 ? 0 : 1)
                            }
                        }}/>
                        <div className="TogglerSlider">
                            <div className="TogglerKnob"></div>
                        </div>
                    </label>
                </div>
                {userData && userData.DriverMode !== 0 && userData.VehicleBrand !== null? 
                    <>
                        <div className="PageHeader">
                        <h2>Моя машина</h2>
                        </div>
                        <div className='MyAccountPageAccount'>
                            <div className='AccountCard VehicleCard'>
                                <div className='AccountCardData'>
                                    <div className='AccountCardDataFirst'>{userData.VehicleBrand}</div>
                                    <div className='AccountCardDataSecond'>{userData.VehicleModel}</div>
                                    <div className='AccountCardDataSecond'>Цвет: {userData.VehicleColor}</div>
                                    <div className='AccountCardDataThird'>{userData.VehicleNumber}</div>
                                </div>
                                <div className='AccountCardVehicleEdit'>
                                    <Link href='my-account/add-car' className='Button bg-orange-500'>
                                        <h3>Редактировать</h3>
                                        {/* <i className="fa-solid fa-pencil"></i> */}
                                    </Link>
                                    <div onClick={()=>{setTogglerPopupDeleteCar('popup-open')}} className='Button mt-2 bg-red-600'>
                                        <h3>Удалить</h3>
                                        {/* <i className="fa-solid fa-trash"></i> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </> : userData && userData.DriverMode !== 0 && userData.VehicleBrand == null ?
                    <div>
                        <div className="PageHeader">
                            <h2>Моя машина</h2>
                        </div>
                        <div className='MyAccountPageAccount'>
                            <Link href='my-account/add-car' className='AccountCard'>
                                Добавить авто
                            </Link>
                        </div>
                    </div> : null
                }
            </div>
            <div className={`popup-background ${togglerPopupDeleteCar}`}></div>
            <div className={`popup popup-input-error ${togglerPopupDeleteCar}`}>
                <h3 className='popup-input-error__text'>Вы действительно хотите удалить автомобиль?</h3>
                <div className='popup-button_block'>
                    <div className='Button PopupButton' onClick={()=>{deleteCar()}}>Удалить</div>
                    <div className='Button PopupButton' onClick={()=>{setTogglerPopupDeleteCar('')}}>Отмена</div>
                </div>
            </div>
            <div className={`popup-background ${togglerPopupDeleteCar}`}></div>
            {/* Суккес */}
            <div className={`popup-background ${togglerPopupSuccessDeleteCar}`}></div>
            <div className={`popup popup-input-error ${togglerPopupSuccessDeleteCar}`}>
                <h3 className='popup-input-error__text'>Автомобиль удален</h3>
                <div className='Button PopupButton' onClick={()=>{setTogglerPopupSuccessDeleteCar('')}}>Закрыть</div>
            </div>
            <div className={`popup-background ${togglerPopupSuccessDeleteCar}`}></div>
            {/* Error */}
            <div className={`popup-background ${togglerPopupErrorDeleteCar}`}></div>
            <div className={`popup popup-input-error ${togglerPopupErrorDeleteCar}`}>
                <h3 className='popup-input-error__text'>Ошибка удаления</h3>
                <div className='Button PopupButton' onClick={()=>{setTogglerPopupErrorDeleteCar('')}}>Закрыть</div>
            </div>
            <div className={`popup-background ${togglerPopupErrorDeleteCar}`}></div>
            {/* Loading */}
            <div className={`popup-background ${togglerPopupLoadingData}`}></div>
            <div className={`popup popup-input-error ${togglerPopupLoadingData}`}>
                <h3 className='popup-input-error__text'>Загрузка</h3>
            </div>
            <div className={`popup-background ${togglerPopupLoadingData}`}></div>
        </div>
    )
}