'use client'
import { useRouter } from 'next/navigation'
import '../global.sass'
import Script from 'next/script'
import { useEffect, useState } from 'react'
import { Helmet } from "react-helmet"
import {DataProvider} from './components/DataContext'


export default function AppLayout({ children }) {

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null; // Если куки нет
  }
  async function SignIn(){
    try {
        const response = await fetch('/api/account-data/sign-in', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: inputEmail }),
        });

        const res = await response.json();

        if (response.ok) {
            setCookie('token', res.token, 7);
            router.push('/mobile/general')
        } else {
            alert(res.message);
        }
    } catch (error) {
        alert(error)
    }
  }
  useEffect(() => {
      setTimeout(() => {
        window.scrollTo(0, 1)
      }, 0)
  }, [])


  return (
      <html lang="ru">
        <body>
          <Helmet>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
          </Helmet>
          
          <DataProvider>
            {children}
          </DataProvider>
        </body>
        <Script src="https://kit.fontawesome.com/073ad96d9b.js" crossorigin="anonymous"></Script>
      </html>
  )
}
