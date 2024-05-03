'use client'
import Image from 'next/image'
import profileImage from '/public/ico/man-user.svg'
import './style.sass'
import Link from 'next/link'
import Cookies from 'js-cookie'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function BurgerMenu(){
    const router = useRouter()
    // Открытие бургера
    const [togglerBurgerMenu, setTogglerBurgerMenuBurgerMenu] = useState('')
    // Получение sessionId из кук
    const [sessionKey, setSessionKey] = useState('')

    function myHandler() {
        const cookieValue = Cookies.get('UserData');
        if (cookieValue) {
            try {
                const userData = JSON.parse(cookieValue);
                setSessionKey(userData.session_key);
            } catch (error) {
                console.error("Ошибка при парсинге данных пользователя из cookie:", error);
            }
        } else {
            router.push('/sign-in')
        }
    }
    useEffect(()=>{
        myHandler()
    }, [])

    //Получение и сверка всех UserEmail
    const [userName, setUserName] = useState('')
    const [userData, setUserData] = useState([])
    function getUsersEmail(){
        fetch(`api/account-data/user-data?sessionId=${sessionKey}`,{
            method: 'GET'
        }).then((result)=>{
            console.log("OKAY")
            return result.json()
        }).then((res)=>{
            setUserName(res[0].UserName.split(' ')[0])
            if(userData.length <= 0){
                setUserData(res[0])
            }
        })
        .catch(error =>{
            console.log(error)
        })
    }
    useEffect(()=>{
        getUsersEmail()
    }, [sessionKey])
    const userImage = userData.UserImage
    return(
        <>
            <div className={`BurgerItem ${togglerBurgerMenu}`} onClick={()=>{setTogglerBurgerMenuBurgerMenu('burger-open')}}>
                <i className="fa-solid fa-chart-bar"></i>
                <i className="fa-solid fa-bars-staggered"></i>
            </div>
            <div className={`BurgerMenu ${togglerBurgerMenu}`}>
                <div className='BurgerMenu-account'>
                    <div className='BurgerMenuAccountImage' style={{backgroundImage: `url(${userImage})`}}></div>
                    {/* <Image src={profileImage} className='BurgerMenuAccountImage' alt='profile imeage'/> */}
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
            <div className={`BurgerMenuOverlay ${togglerBurgerMenu}`} onClick={()=>{setTogglerBurgerMenuBurgerMenu('')}}></div>
        </>
    )
}