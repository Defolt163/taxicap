'use client'
import Script from 'next/script'
import './global.sass'
import './global.css'
import { Suspense, useEffect } from 'react'
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { ToastAction } from "@/components/ui/toast"
import Head from 'next/head'
import CookieBanner from './components/CookieNotification/CookieNotification'
import YandexMetrika from './components/YandexMetrika/YandexMetrika'


export default function RootLayout({ children }) {
  /* useEffect(()=>{
    fetch('https://geolocation-db.com/json/',
      {method: 'GET'}
    ).then((result)=>{
      return result.json()
    }).then((res)=>{
      console.log(res)
      if(res.country_code !== 'RU'){
        toast.warning('Похоже, вы используете VPN 🤨', {
          description: `Отключите его, чтобы использование приложения было более комфортным`,
          duration: Infinity,
      });
      }
    })
  }, []) */
  return (
      <html lang="ru">
        <body>
          <Head>
            <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png"/>
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png"/>
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png"/>
            <link rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#5bbad5"/>
            <meta name="apple-mobile-web-app-capable" content="yes"/>
            <meta name="apple-mobile-web-app-title" content="Поехали"/>
            <meta name="apple-mobile-web-app-status-bar-style" content="default"/>
          </Head>
          <CookieBanner/>
          {children}
          <Suspense>
            <YandexMetrika />
          </Suspense>
          <div><Toaster position="top-center" richColors/></div>
        </body>
        <Script src="https://kit.fontawesome.com/073ad96d9b.js" crossorigin="anonymous"></Script>
      </html>
  )
}
