'use client'
import './not-found-style.sass'
import Link from 'next/link'
import Header from './(landing-pages)/components/header/header'
import LandingFooter from './(landing-pages)/components/footer/footer'
 
export default function NotFound() {
  return (
    <div className='wrapper_404'>
        <Header/>
        <div className='not_found flex flex-col'>
            <div className='not-found_text my-8'>
                <h1 className='text-xl mb-4'>Маршрут не найден 😔</h1>
                <h3>Похоже, такой страницы не существует</h3>
            </div>
            <Link className='Button' href={'/'}>На главную</Link>
        </div>
        <div className='not-found_bg'>4 0 4</div>
        <LandingFooter/>
    </div>
  )
}