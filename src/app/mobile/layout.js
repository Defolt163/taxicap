'use client'
import { useRouter } from 'next/navigation';
import '../global.sass'
import Script from 'next/script';
import { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import Cookies from 'js-cookie'
import manifest from '/public/manifest.json'


export default function AppLayout({ children }) {
  /* useEffect(()=>{
    window.addEventListener('touchmove', function(event) {
      if (event.scale !== 1) {
        event.preventDefault();
      }
    }, { passive: false });
  },[]) */
 
  const router = useRouter()

  /* useEffect(() => {
    const platform = navigator.platform;
    if(['Android', 'iPhone', 'iOS', 'iPad', 'iPod', 'BlackBerry'].includes(platform)){
      console.log('Mobile!')
    }else{
      router.push('/platform-error')
    }
  }, []) */
  // Установка куки с localstorage
  function setCookie(name, value) {
    let expires = ""
    let date = new Date()
    date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000))
    expires = "; expires=" + date.toUTCString()

    document.cookie = name + "=" + decodeURIComponent(value) + expires + "; path=/"
    localStorage.setItem('accountSessionId', value)
}
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
      }if(!cookieValue){
        try {
          const userData = JSON.parse(localStorage.getItem('accountSessionId'));
          setCookie('UserData', JSON.stringify({
            session_key: userData.session_key
        }), 30)
          setSessionKey(userData.session_key);
        } catch (error) {
            console.error("Ошибка при парсинге данных пользователя из localstorage:", error);
        }
      }
    }
  }
  useEffect(()=>{
      myHandler()
  }, [])

  function getUsersAccountType(){
    if(sessionKey !== ''){
      fetch(`/api/account-data/user-data?sessionId=${sessionKey}`,{
        method: 'GET'
      }).then((result)=>{
          return result.json()
      }).then((res)=>{
        if(res.length !== 0){
            if(res[0].UserPhone === 0){
              router.push('/mobile/set-account')
            }if(res[0].UserPhone !== 0){
              router.push('/mobile/general')
              localStorage.setItem('accountData', JSON.stringify(res[0]))
            }
          console.log("WTF")
        }else{
          router.push('/mobile/sign-in')
        }
        })
      .catch(error =>{
        console.log("ОШИБКАА", error)
        router.push('/mobile/sign-in')
      })
    }
  }
  useEffect(()=>{
    getUsersAccountType()
  }, [sessionKey])

  useEffect(() => {
      setTimeout(() => {
        window.scrollTo(0, 1);
      }, 0);
  }, []);


  return (
      <html lang="ru">
        <body>
          <Helmet>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
          </Helmet>
          {children}
        </body>
        <Script src="https://kit.fontawesome.com/073ad96d9b.js" crossorigin="anonymous"></Script>
      </html>
  );
}
