'use client'
import Image from 'next/image'
import profileImage from '/public/ico/man-user.svg'
import './style.sass'
import Link from 'next/link'
import Cookies from 'js-cookie'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useData } from '../../DataContext'

export default function BurgerMenu(){
    const router = useRouter()
    // Открытие бургера
    const [togglerBurgerMenu, setTogglerBurgerMenuBurgerMenu] = useState('')
    const { userData } = useData()
    
    function userSignOut() {
        document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/;`
        localStorage.removeItem('accountData')
        localStorage.removeItem('accountSessionId')
        router.push('/mobile/sign-in')
      }
    return(
        <>
            <div className={`BurgerItem ${togglerBurgerMenu}`} onClick={()=>{setTogglerBurgerMenuBurgerMenu('burger-open')}}>
                <i className="fa-solid fa-chart-bar"></i>
                <i className="fa-solid fa-bars-staggered"></i>
            </div>
            <div className={`BurgerMenu ${togglerBurgerMenu}`}>
                <div className='BurgerMenu-account'>
                    <Avatar className='BurgerMenuAccountImage'>
                        <AvatarImage src={userData && userData.UserImage} />
                        <AvatarFallback>{userData && userData.UserName.slice(0,1)}</AvatarFallback>
                      </Avatar>
                    {/* <div className='BurgerMenuAccountImage' style={{backgroundImage: `url(${userData.UserImage === null ? '/ico/man-user.svg' : userData.UserImage})`}}></div> */}
                    {/* <Image src={profileImage} className='BurgerMenuAccountImage' alt='profile imeage'/> */}
                    <h3 className='BurgerMenuAccountName'>{userData && userData.UserName}</h3>
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