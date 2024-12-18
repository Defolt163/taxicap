'use client'
import Link from 'next/link'
import './style.sass'
import Image from 'next/image'
import userIco from '/public/ico/man-user.svg'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import PagesHeader from '../../components/PagesHeader/PagesHeader'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
export default function MyAccountPage(){
    // Получение sessionId из кук
    const [sessionKey, setSessionKey] = useState('')
    function myHandler() {
        if(sessionKey === ''){
            const cookieValue = Cookies.get('UserData') // Замените cookieName на имя необходимой вам cookie
            const userData = JSON.parse(cookieValue)
            setSessionKey(userData.session_key)
        }
      }
    useEffect(()=>{
        myHandler()
    }, [])

    //Получение и сверка всех UserEmail
    const [userData, setUserData] = useState([])
    const [userName, setUserName] = useState('')
    const [userPhone, setUserPhone] = useState('')
    const [togglerPopupLoadingData, setTogglerPopupLoadingData] = useState('popup-open')
    function getUsersEmail(){
        if(sessionKey !== '' && userData.length === 0){
            fetch(`/api/account-data/user-data?sessionId=${sessionKey}`,{
                method: 'GET'
            }).then((result)=>{
                console.log("OKAY")
                return result.json()
            }).then((res)=>{
                setUserName(res[0].UserName.split(' ')[0])
                setUserData(res[0])
                setUserPhone(res[0].UserPhone)
                setTogglerPopupLoadingData('')
                setDriverMode(res[0].DriverMode)
            })
            .catch(error =>{
                console.log(error)
            })
        }
    }
    useEffect(()=>{
        getUsersEmail()
    }, [sessionKey])
    // Обновление статуса аккаунта
    const [driverMode, setDriverMode] = useState(0)
    function updateDriverMode(){
        console.log(sessionKey)
        if(sessionKey !== '' && userData.length !== 0){
            fetch(`/api/account-data/change-driver-mode?UserSessionId=${sessionKey}`,{
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ "DriverMode": driverMode }),
            }).then(()=>{
                console.log("Changed")
                getUsersEmail()
            })
            .catch(error =>{
                console.log(error)
            })
        }
    }
    useEffect(()=>{
        updateDriverMode()
    },[driverMode, sessionKey])

    const [togglerPopupDeleteCar, setTogglerPopupDeleteCar] = useState('')
    const [togglerPopupSuccessDeleteCar, setTogglerPopupSuccessDeleteCar] = useState('')
    const [togglerPopupErrorDeleteCar, setTogglerPopupErrorDeleteCar] = useState('')

    function deleteCar(){
        if(sessionKey !== ''){
            fetch(`/api/account-data/change-car/delete-car?sessionId=${sessionKey}`,{
                method: "PUT",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    "VehicleBrand": null,
                    "VehicleModel": null,
                    "VehicleColor": null,
                    "VehicleNumber": null
                })
            }).then(()=>{
                setTogglerPopupDeleteCar('')
                setTogglerPopupSuccessDeleteCar('popup-open')
            })
            .catch(() => {
                setTogglerPopupErrorDeleteCar('popup-open')
            })
        }
    }

    return(
        <div className="MyAccountPage">
            <div className="container">
                <PagesHeader ReturnBtn="/mobile/general" PageHeader="Мой аккаунт"/>
                <div className='MyAccountPageAccount'>
                    <div className='AccountCard'>
                        <Avatar className='AccountCardIco'>
                            <AvatarImage src={userData.UserImage} />
                            <AvatarFallback>{userName[0]}</AvatarFallback>
                        </Avatar>
                        {/* <div style={{backgroundImage: `url(${userData.UserImage === null ? '/ico/man-user.svg' : userData.UserImage})`}} className='AccountCardIco' alt='user ico'/> */}
                        <div className='AccountCardData'>
                            <div className='AccountCardDataFirst'>{userName}</div>
                            <div className='AccountCardDataSecond'>{userData.UserEmail}</div>
                            <div className='AccountCardDataThird'><i className="fa-solid fa-phone"></i> +7 {userPhone.toString().substring(1)}</div>
                        </div>
                        <Link href='/mobile/my-account/account-edit' className='AccountCardEdit'>
                            <i className="fa-solid fa-pencil"></i>
                        </Link>
                    </div>
                </div>
                <div className='MyAccountPageAccount history'>
                    <div className='AccountCard'>
                        <Link href='/mobile/my-account/history'>История поездок</Link>
                    </div>
                </div>
                <div className='AccountToggleModeBox'>
                    <label className='AccountToggleMode' htmlFor='driver-mode'>Режим водителя</label>
                    <label className="TogglerWrapper">
                        <input id='driver-mode' className='TogglerChecker' type="checkbox" checked={userData && userData.DriverMode === 1 ||  driverMode === 1} onChange={(e) => {
                            if (e.target.checked && userData.DriverMode === 0) {
                                setDriverMode(1)
                            } else {
                                setDriverMode(driverMode === 1 ? 0 : 1)
                            }
                        }}/>
                        <div className="TogglerSlider">
                            <div className="TogglerKnob"></div>
                        </div>
                    </label>
                </div>
                {driverMode !== 0 && userData.VehicleBrand !== null? 
                    <>
                        <div className="PageHeader">
                        <h2>Моя машина</h2>
                        </div>
                        <div className='MyAccountPageAccount'>
                            <div className='AccountCard'>
                                <div className='AccountCardData'>
                                    <div className='AccountCardDataFirst'>{userData.VehicleBrand}</div>
                                    <div className='AccountCardDataSecond'>{userData.VehicleModel}</div>
                                    <div className='AccountCardDataSecond'>Цвет: {userData.VehicleColor}</div>
                                    <div className='AccountCardDataThird'>{userData.VehicleNumber}</div>
                                </div>
                                <Link href='/mobile/my-account/add-car' className='AccountCardEdit'>
                                    <i className="fa-solid fa-pencil"></i>
                                </Link>
                                <div onClick={()=>{setTogglerPopupDeleteCar('popup-open')}} className='AccountCardEdit AccountCardEditTrash'>
                                    <i className="fa-solid fa-trash"></i>
                                </div>
                            </div>
                        </div>
                    </> : driverMode !== 0 && userData.VehicleBrand === null ?
                    <>
                        <div className="PageHeader">
                            <h2>Моя машина</h2>
                        </div>
                        <div className='MyAccountPageAccount'>
                            <Link href='/mobile/my-account/add-car' className='AccountCard'>
                                Добавить авто
                            </Link>
                        </div>
                    </> : null
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