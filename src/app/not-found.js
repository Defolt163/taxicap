'use client'
import { useEffect } from 'react'
import './not-found-style.sass'
import Link from 'next/link'
import HeaderPageComponent from './components/Header/Header'
import FooterPageComponent from './components/Footer/Footer'
import Image from 'next/image'
import error404 from '/public/logo/404.png'
 
export default function NotFound() {
    useEffect(() => {
        const htmlElement = document.documentElement
        htmlElement.classList.add('black-bg')
    
        return () => {
          htmlElement.classList.remove('black-bg')
        }
    }, [])
  return (
    <div className='wrapper_404'>
        <HeaderPageComponent FirstLink='/about' FirstLabel="О нас"/>
        <div className='not-found flex flex-col'>
            <Image className='w-1/2' src={error404} alt="revvo 404"/>
            <div className='not-found_text my-8'>
                <h1 className='text-xl mb-4'>Маршрут не найден 😔</h1>
                <h3>Похоже, такой страницы не существует</h3>
            </div>
            <Link className='Button' href={'/'}>На главную</Link>
        </div>
        <div className='not-found_bg'>4 0 4</div>
        <FooterPageComponent/>
    </div>
  )
}