'use client'
import { useEffect } from 'react';
import './not-found-style.sass'
import Link from 'next/link';
import HeaderPageComponent from './components/Header/Header'
import FooterPageComponent from './components/Footer/Footer'
 
export default function NotFound() {
    useEffect(() => {
        const htmlElement = document.documentElement;
        htmlElement.classList.add('black-bg');
    
        return () => {
          htmlElement.classList.remove('black-bg');
        };
    }, [])
  return (
    <>
        <HeaderPageComponent FirstLink='/about' FirstLabel="О нас"/>
        <div className='not-found'>
            <div className='not-found_text'>
                <h1>Страница не найдена</h1>
                <h3>Похоже, такой страницы не существует</h3>
                <Link className='Button' href={'/'}>На главную</Link>
            </div>
        </div>
        <div className='not-found_bg'>4 0 4</div>
        <FooterPageComponent/>
    </>
  )
}