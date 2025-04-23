'use client'
import { useRouter } from 'next/navigation'
import '../global.sass'
import Script from 'next/script'
import { useEffect, useState } from 'react'
import { Helmet } from "react-helmet"
import {DataProvider} from './components/DataContext'
import Head from 'next/head'


export default function AppHelloLayout({ children }) {
  const router = useRouter()
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null; // Если куки нет
  }
  function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    const expiresStr = "expires=" + expires.toUTCString();
    document.cookie = `${name}=${value}; ${expiresStr}; path=/`;
  }
  async function SignIn(){
    const token = getCookie('token'); // Получаем токен из куки
    const checkStartPage = getCookie('firstScreen');
    if (token !== null && checkStartPage !== null){
      try{
        const response = await fetch('/api/account-data/sign-in', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })
        const result = await response.json();
        if(!response.ok || response.status == 401 ){
            if (userPath.startsWith('/mobile/general')) {
                if (response.status === 401) {
                    router.push('/mobile/sign-in');
                }
            }
            setCookie('token', 'notAuth', 7)
        } else {
            setCookie('token', result.newToken, 7);
            //decryptData(result.user.encryptedData, result.user.iv)
            router.push('/mobile/general');
        }
      } catch (error){
          router.push('/mobile/');
      }
    }else if (checkStartPage !== null){
      router.push('/mobile/sign-in')
    }else{
      router.push('/mobile/')
    }
  }
  useEffect(() => {
      setTimeout(() => {
        window.scrollTo(0, 1)
      }, 0);
      SignIn()
  }, [])


  return (
      <html lang="ru">
        <body>
          <Head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
          </Head>
          {children}
        </body>
        <Script src="https://kit.fontawesome.com/073ad96d9b.js" crossorigin="anonymous"></Script>
      </html>
  )
}
