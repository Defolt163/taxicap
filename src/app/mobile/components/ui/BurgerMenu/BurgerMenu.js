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
        if(sessionKey === ''){
            const cookieValue = Cookies.get('UserData');
            if (cookieValue) {
                try {
                    const userData = JSON.parse(cookieValue);
                    setSessionKey(userData.session_key);
                } catch (error) {
                    console.error("Ошибка при парсинге данных пользователя из cookie:", error);
                }
            } else {
                router.push('/mobile/sign-in')
            }
        }
    }
    useEffect(()=>{
        myHandler()
    }, [])

    //Получение и сверка всех UserEmail
    const [userName, setUserName] = useState('')
    const [userData, setUserData] = useState([])
    function getUsersEmail(){
        if(localStorage.getItem('accountData')){
            setUserData(JSON.parse(localStorage.getItem('accountData')))
            setUserName(JSON.parse(localStorage.getItem('accountData')).UserName.split(' ')[0])
        }else if(sessionKey !== ''){
            fetch(`/api/account-data/user-data?sessionId=${sessionKey}`,{
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
    }
    useEffect(()=>{
        getUsersEmail()
    }, [sessionKey])
    function userSignOut() {
        document.cookie = `UserData=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/;`
        localStorage.removeItem('accountData')
        localStorage.removeItem('activeOrder')
        router.push('/mobile/sign-in')
      }
      console.log(JSON.parse(localStorage.getItem('activeOrder')))
    return(
        <>
            <div className={`BurgerItem ${togglerBurgerMenu}`} onClick={()=>{setTogglerBurgerMenuBurgerMenu('burger-open')}}>
                <i className="fa-solid fa-chart-bar"></i>
                <i className="fa-solid fa-bars-staggered"></i>
            </div>
            <div className={`BurgerMenu ${togglerBurgerMenu}`}>
                <div className='BurgerMenu-account'>
                    <div className='BurgerMenuAccountImage' style={{backgroundImage: `url(${userData.UserImage === null ? '/ico/man-user.svg' : userData.UserImage})`}}></div>
                    {/* <Image src={profileImage} className='BurgerMenuAccountImage' alt='profile imeage'/> */}
                    <h3 className='BurgerMenuAccountName'>{userName}</h3>
                </div>
                <ul className='BurgerMenuItems'>
                    <li className='BurgerMenuItem'><Link href="/mobile/my-account">Мой аккаунт</Link></li>
                    <li className='BurgerMenuItem'><Link href="/mobile/user-agreement">Пользовательское соглашение</Link></li>
                    <li className='BurgerMenuItem'><Link href="/mobile/confidentiality">Конфиденциальность</Link></li>
                    <li className='BurgerMenuItem'><Link href="/mobile/feedback">Сообщить о проблеме</Link></li>
                </ul>
                <div className='BurgerMenuLogout' onClick={()=>{userSignOut()}}>Выйти</div>
            </div>
            <div className={`BurgerMenuOverlay ${togglerBurgerMenu}`} onClick={()=>{setTogglerBurgerMenuBurgerMenu('')}}></div>
        </>
    )
}