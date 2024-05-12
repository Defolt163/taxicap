'use client'
import Image from "next/image";
import logoImage from '/public/logo/logotype.png'
import { Helmet } from "react-helmet";
import Cookies from 'js-cookie'
import './style.sass'
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginLayout({ children }) {
    const router = useRouter()
  
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

    function getUsersAccountType(){
        fetch(`api/account-data/user-data?sessionId=${sessionKey}`,{
            method: 'GET'
        }).then((result)=>{
            return result.json()
        }).then((res)=>{
        if(res.length !== 0){
            if(res[0].UserPhone === 0){
                router.push('/set-account')
            }if(res[0].UserPhone !== 0){
                router.push('/general')
            }
        }
        })
        .catch(error =>{
        console.log("ОШИБКАА", error)
        router.push('/sign-in')
        })
    }
    useEffect(()=>{
        getUsersAccountType()
    }, [sessionKey])
    return (
          <html lang="en">
            <body>
                <Helmet>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
                </Helmet>
                <div className="container">
                    <Image src={logoImage} alt="logo" style={{height: 'auto', width: '100%', margin: '2rem 0'}}/>
                    {children}
                </div>
            </body>
          </html>
    );
}