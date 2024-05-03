'use client'
import Link from 'next/link'
import './style.sass'
import Image from 'next/image'
import userIco from '/public/ico/man-user.svg'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import PagesHeader from '../../components/PagesHeader/PagesHeader'
export default function MyAccountPage(){
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

    //Получение и сверка всех UserEmail
    const [userData, setUserData] = useState([])
    const accountImage = userData.UserImage
    const [userName, setUserName] = useState('')
    function getUsersEmail(){
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
        getUsersEmail()
    }, [sessionKey])
    // Обновление статуса аккаунта
    const [driverMode, setDriverMode] = useState(0)
    async function updateDriverMode(){
        await fetch(`api/account-data/change-driver-mode?UserSessionId=${sessionKey}`,{
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "DriverMode": driverMode }),
        }).then(()=>{
            console.log("Changed")
        })
        .catch(error =>{
            console.log(error)
        })
    }
    useEffect(() => {
        setDriverMode(userData.DriverMode);
      }, [userData])
    useEffect(()=>{
        updateDriverMode()
    },[driverMode])

    return(
        <div className="MyAccountPage">
            <div className="container">
                <PagesHeader ReturnBtn="/general" PageHeader="Мой аккаунт"/>
                <div className='MyAccountPageAccount'>
                    <div className='AccountCard'>
                        <div style={{backgroundImage: `url(${accountImage})`}} className='AccountCardIco' alt='user ico'/>
                        <div className='AccountCardData'>
                            <div className='AccountCardDataFirst'>{userName}</div>
                            <div className='AccountCardDataSecond'>{userData.UserEmail}</div>
                            <div className='AccountCardDataThird'><i class="fa-solid fa-phone"></i> +7 {userData.UserPhone}</div>
                        </div>
                        <Link href='/my-account/account-edit' className='AccountCardEdit'>
                            <i class="fa-solid fa-pencil"></i>
                        </Link>
                    </div>
                </div>
                <div className='MyAccountPageAccount'>
                    <div className='AccountCard'>
                        <Link href='/my-account/history'>История поездок</Link>
                    </div>
                </div>
                <div className='AccountToggleModeBox'>
                    <label className='AccountToggleMode' htmlFor='driver-mode'>Режим водителя</label>
                    <label class="TogglerWrapper">
                        <input id='driver-mode' className='TogglerChecker' type="checkbox" checked={driverMode === 1 } onChange={(e) => {
                            if (e.target.checked) {
                                setDriverMode(1)
                            } else {
                                setDriverMode(driverMode === 1 ? 0 : 1)
                            }
                        }}/>
                        <div class="TogglerSlider">
                            <div class="TogglerKnob"></div>
                        </div>
                    </label>
                </div>
                {driverMode !== 0 && userData.VehicleBrand !== ""? 
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
                                <div className='AccountCardEdit'>
                                    <i class="fa-solid fa-pencil"></i>
                                </div>
                            </div>
                        </div>
                    </> : driverMode !== 0 && userData.VehicleBrand === "" ?
                    <>
                        <div className="PageHeader">
                            <h2>Моя машина</h2>
                        </div>
                        <div className='MyAccountPageAccount'>
                            <Link href='/my-account/add-car' className='AccountCard'>
                                Добавить авто
                            </Link>
                        </div>
                    </> : null
                }
            </div>
        </div>
    )
}