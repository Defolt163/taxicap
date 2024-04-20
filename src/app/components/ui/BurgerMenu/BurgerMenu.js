'use client'
import Image from 'next/image'
import profileImage from '/public/ico/man-user.svg'
import './style.sass'
import Link from 'next/link'
import Cookies from 'js-cookie'
import { useEffect, useState } from 'react'

export default function BurgerMenu(){
    // Открытие бургера
    const [togglerBurgerMenu, setTogglerBurgerMenuBurgerMenu] = useState('')
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
    const [userName, setUserName] = useState('')
    function getUsersEmail(){
        fetch(`api/account-data/user-data?sessionId=${sessionKey}`,{
            method: 'GET'
        }).then((result)=>{
            console.log("OKAY")
            return result.json()
        }).then((res)=>{
            setUserName(res[0].UserName.split(' ')[0])
        })
        .catch(error =>{
            console.log(error)
        })
    }
    useEffect(()=>{
        getUsersEmail()
    }, [sessionKey])
    return(
        <>
            <div className={`BurgerItem ${togglerBurgerMenu}`} onClick={()=>{setTogglerBurgerMenuBurgerMenu('burger-open')}}>
                <i className="fa-solid fa-chart-bar"></i>
                <i className="fa-solid fa-bars-staggered"></i>
            </div>
            <div className={`BurgerMenu ${togglerBurgerMenu}`}>
                <div className='BurgerMenu-account'>
                    <Image src={profileImage} className='BurgerMenuAccountImage' alt='profile imeage'/>
                    <h3 className='BurgerMenuAccountName'>{userName}</h3>
                </div>
                <ul className='BurgerMenuItems'>
                    <li className='BurgerMenuItem'><Link href="/my-account">Мой аккаунт</Link></li>
                    <li className='BurgerMenuItem'><Link href="/">FAQ</Link></li>
                    <li className='BurgerMenuItem'><Link href="/">Политика безопасности</Link></li>
                    <li className='BurgerMenuItem'><Link href="/">Конфиденциальность</Link></li>
                </ul>
                <div className='BurgerMenuLogout'>Выйти</div>
            </div>
        </>
    )
}