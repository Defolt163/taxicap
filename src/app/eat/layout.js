'use client'
import Image from "next/image";
import logoImage from '/public/logo/swift-logo.svg'
import { Helmet } from "react-helmet";
import Cookies from 'js-cookie'
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginLayout({ children }) {
    const router = useRouter()

    // Получение sessionId из кук
    const [sessionKey, setSessionKey] = useState('')
    function myHandler() {
        if(sessionKey === ''){
            const cookieValue = Cookies.get('SwiftTrEat');
            if (cookieValue) {
                try {
                    const sessionEatKey = JSON.parse(cookieValue);
                    console.log(sessionEatKey)
                    setSessionKey(sessionEatKey.session_key);
                } catch (error) {
                    console.error("Ошибка при парсинге данных пользователя из cookie:", error);
                }
            }if(!cookieValue){
                try {
                  const sessionEatKey = JSON.parse(localStorage.getItem('SwiftTrEat'));
                  setSessionKey(sessionEatKey.session_key);
                } catch (error) {
                    console.error("Ошибка при парсинге данных пользователя из localstorage:", error);
                }
            }
            else {
                router.push('/eat/sign-in')
            }
        }
    }
    useEffect(()=>{
        myHandler()
    }, [])

    function getUsersAccountType(){
        if(sessionKey !== ''){
            fetch(`/api/swift-eat/login/auth?SessionId=${sessionKey}`,{
                method: 'GET'
            }).then((result)=>{
                return result.json()
            }).then((res)=>{
            if(res.length !== 0){
                console.log("Ресурсы", res)
                if(res[0].SessionKey === sessionKey){
                    router.push('/eat/user-side')
                }
            }
            })
            .catch(error =>{
            console.log("ОШИБКАА", error)
            router.push('/eat/sign-in')
            })
        }
    }
    useEffect(()=>{
        getUsersAccountType()
    }, [sessionKey])
    return (
          <html lang="ru">
            <body>
                <div className="container">
                    {children}
                </div>
            </body>
          </html>
    );
}