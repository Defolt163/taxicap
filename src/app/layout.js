'use client'
import Script from 'next/script'
import './global.sass'
import './global.css'
import { Helmet } from "react-helmet"


export default function RootLayout({ children }) {

  return (
      <html lang="ru">
        <body>
          <Helmet>
            <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png"/>
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png"/>
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png"/>
            <link rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#5bbad5"/>
            <link rel="manifest" href='/manifest.json' />
          </Helmet>
          {children}
        </body>
        <Script src="https://kit.fontawesome.com/073ad96d9b.js" crossorigin="anonymous"></Script>
      </html>
  )
}
