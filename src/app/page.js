'use client'
import HeaderPageComponent from './components/Header/Header'
import FooterPageComponent from './components/Footer/Footer'
import './main-page-style.sass'
import Link from 'next/link'
import BtnApp from '/public/ico/btn-app.svg'
import HandAndPhone from '/public/landing/image/HandAndPhone.png'
import LogoShort from '/public/logo/swift-logo-short.svg'
import PhoneQr from '/public/landing/image/PhoneQr.png'
import Image from 'next/image'
import { useEffect } from 'react'

export default function MainPage(){
    useEffect(() => {
        const htmlElement = document.documentElement
        htmlElement.classList.add('black-bg')
    
        return () => {
          htmlElement.classList.remove('black-bg')
        }
      }, [])
    return(
        <div className="MainPage">
            <div className="container">
                <HeaderPageComponent FirstLink='/about' FirstLabel="О нас"/>
            </div>
            <div className='promo_blocks'>
                <div className='promo_block promo_left'>
                    <div className='promo_block__container'>
                        <h1>Мобильный сервис создания и бронирования поездок</h1>
                        <h3>В современном ритме жизни, время имеет решающее значение. Наше приложение дает тебе возможность создавать поездки и бронировать трансфер в удобное для тебя время, экономя драгоценные минуты.</h3>
                        <Link href='/mobile' className='btn_open__app'>Открыть приложение <div className='btn-app'><Image src={BtnApp} alt="arrow 45deg"/></div></Link>
                    </div>
                </div>
                <div className='promo_block promo_right'>
                    <iframe className='music-playlist' src="https://music.yandex.ru/iframe/playlist/nrjchannels/1004"></iframe>
                    <Image className='promo_right__image' src={HandAndPhone} alt='hand phone app'/>
                    <Image className='promo_right__bg-image' src={LogoShort} alt='swift logo short "SF"'/>
                </div>
            </div>
            <div className='qr-block'>
                <div className='promo_block'>
                    <div className='promo_block__container'>
                        <h2>Отсканируй QR код и войди в приложение!</h2>
                        <Image className='phone_qr-code' src={PhoneQr} alt='Phone Qr Code'/>
                        <div className='video-overlay'></div>
                    </div>
                    <video className='video-bg' autoPlay playsInline muted loop preload="none">
                        <source src="/landing/video/drift.mp4" type="video/mp4"/>
                    </video>
                </div>
            </div>
            <div className='features'>
                <div className='container'>
                    <h2>Выбери свою сторону</h2>
                    <div className='features_block'>
                        <div className='features_block__side'>
                            <div className='features_block__side-text'>
                                <h3>Предлагай поездки!</h3>
                                <div className='features_block__side_text'>
                                    Хотите путешествовать на своих условиях? Теперь вы можете сами создавать поездки благодаря нашему сервису! Больше никаких ограничений и зависимости от такси.<br/><br/>

                                    С нашим приложением вы получаете абсолютную свободу передвижения. Создавайте поездки в удобное для вас время, выбирайте желаемый маршрут и наслаждайтесь комфортным путешествием. Больше никаких компромиссов!<br/><br/>

                                    Создание поездок никогда не было таким простым. Всего в несколько кликов вы сможете разместить заявку на поездку по вашим личным предпочтениям. Укажите пункт отправления и назначения. Мы организуем для вас идеальную поездку.<br/><br/>

                                    Путешествуйте в своем ритме, наслаждайтесь свободой маршрута и открывайте новые места. Создавайте поездки так, как вам удобно, и наш сервис воплотит ваши пожелания в реальность. Добро пожаловать в мир персонализированной мобильности!
                                </div>
                            </div>
                        </div>
                        <div className='features_block__side'>
                            <div className='features_block__side-text'>
                                <h3>Принимай поездки!</h3>
                                <div className='features_block__side_text'>
                                    Воплотите свою мечту о финансовой свободе прямо сейчас! Наша платформа открывает для вас уникальные возможности заработка на дороге без каких-либо дополнительных разрешений или бюрократических препон.<br/><br/>

                                    Если у вас есть действующее водительское удостоверение, вы уже можете стать частью нашего сообщества водителей и начать принимать заказы на поездки от пассажиров. Никаких лишних формальностей – просто садитесь за руль и начинайте зарабатывать деньги.<br/><br/>

                                    Наша платформа предоставляет вам абсолютную свободу действий. Вы сами решаете, когда и какие поездки выполнять. Создавайте собственный гибкий график, выбирайте наиболее привлекательные заказы и путешествуйте по городу, зарабатывая на каждой поездке.<br/><br/>

                                    Присоединяйтесь к нам и станьте частью революционного движения, которое меняет правила игры в сфере мобильности. 
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='about'>
                <div className='container'>
                    <h2>Пара слов о проекте</h2>
                    <div className='about-text'>
                        Знакомьтесь с новым приложением, созданным местными энтузиастами специально для жителей и гостей Шенталинского района! Мы – команда неравнодушных людей, которые преследуют одну цель: сделать передвижение по нашему замечательному региону максимально удобным и комфортным.<br/>

                        Живете в отдаленном уголке района? Не проблема! Наше приложение объединяет водителей и пассажиров, позволяя организовывать совместные поездки. Теперь добраться в нужное место стало гораздо проще и доступнее.<br/>

                        Мы разработали это приложение с любовью к нашей малой родине и желанием сделать жизнь в Шенталинском районе более комфортной. Здесь вы найдете удобный инструмент для планирования поездок, отслеживания маршрутов.<br/><br/>

                        Присоединяйтесь к нашему сообществу и откройте для себя новые горизонты мобильности в Шенталинском районе! Вместе мы сделаем передвижение по нашим родным местам простым и удобным как никогда раньше.
                    </div>
                    <div className='about_links'>
                        <Link href='/about' className='btn_open__app btn_open__about'>Читать далее</Link>
                        <Link href='/mobile' className='btn_open__app'>Открыть приложение <div className='btn-app'><Image src={BtnApp} alt="arrow 45deg"/></div></Link>
                    </div>
                </div>
            </div>
            <FooterPageComponent/>
        </div>
    )
}