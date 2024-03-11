'use client'
import './global.sass'
import Script from 'next/script';
import { useEffect } from 'react';
import { Helmet } from "react-helmet";


export default function RootLayout({ children }) {
  useEffect(()=>{
    window.addEventListener('touchmove', function(event) {
      if (event.scale !== 1) {
        event.preventDefault();
      }
    }, { passive: false });
  },[])

  return (
      <html lang="en">
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
