'use client'
import { useRouter } from 'next/navigation'
import '../../../global.sass'
import Script from 'next/script'
import { useEffect, useState } from 'react'
import { Helmet } from "react-helmet"
import {DataProvider} from '../../components/DataContext'
import Head from 'next/head'


export default function AppLayout({ children }) {

  useEffect(() => {
      setTimeout(() => {
        window.scrollTo(0, 1)
      }, 0)
  }, [])


  return (
      <html lang="ru">
        <body>
          <Head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
          </Head>
          
          <DataProvider>
            {children}
          </DataProvider>
        </body>
        <Script src="https://kit.fontawesome.com/073ad96d9b.js" crossorigin="anonymous"></Script>
      </html>
  )
}
