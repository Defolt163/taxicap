'use client'
import { useRouter } from 'next/navigation';
import './global.sass'
import Script from 'next/script';
import { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import Cookies from 'js-cookie'
import manifest from '/public/manifest.json'


export default function RootLayout({ children }) {
  /* useEffect(()=>{
    window.addEventListener('touchmove', function(event) {
      if (event.scale !== 1) {
        event.preventDefault();
      }
    }, { passive: false });
  },[]) */
 
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

  useEffect(() => {
      setTimeout(() => {
        window.scrollTo(0, 1);
      }, 0);
  }, []);


  return (
      <html lang="en">
        <body>
          <Helmet>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
            <link rel="manifest" href='/manifest.json' />
          </Helmet>
          {children}
        </body>
        <Script src="https://kit.fontawesome.com/073ad96d9b.js" crossorigin="anonymous"></Script>
      </html>
  );
}
