'use client'
import Image from 'next/image';
import './style.sass'
import Link from "next/link";
import logo from '/public/logo/logo-colored.svg'
import { useEffect } from 'react';


export default function Home() {
  useEffect(()=>{
    document.cookie = `platformError=true; expires=${new Date(Date.now() + 3650 * 24 * 60 * 60 * 1000).toUTCString()}; path=/`;
  }, [])
  
  return (
    <main className="device-error-page">
      <div className="container">
        <div className='device-error-page_wrapper'>
            <Image className='logo-image' src={logo} alt="logo"/>
            <h1 className='my-6'>К сожалению, вы не можете войти в приложение😕 <br/> Пожалуйста, используйте мобильное устройство 📱 для входа❤️‍🩹</h1>
            <Link className='Button' href='/'>Вернуться на главную</Link>
        </div>
      </div>
    </main>
  );
}