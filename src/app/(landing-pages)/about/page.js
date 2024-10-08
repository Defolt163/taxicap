'use client'
import Image from "next/image";
import HeaderPageComponent from "../../components/Header/Header";
import LogoShort from '/public/logo/swift-logo-short.svg'
import './about-page.sass'
import FooterPageComponent from "../../components/Footer/Footer";
import { useEffect } from "react";

export default function AboutPage(){
    useEffect(() => {
        const htmlElement = document.documentElement;
        htmlElement.classList.add('black-bg');
    
        return () => {
          htmlElement.classList.remove('black-bg');
        };
      }, [])
    return(
        <div className="about">
            <HeaderPageComponent FirstLink='/' FirstLabel="Главная"/>
            <div className='about_blocks'>
                <div className='about_block about_left'></div>
                <div className='about_block about_right'>
                    <div className="about_block__container">
                        <h1>О нас</h1>
                        <h4>
                            Знакомьтесь с новым приложением, созданным местными энтузиастами специально для жителей и гостей Шенталинского района! Мы – команда неравнодушных людей, которые преследуют одну цель: сделать передвижение по нашему замечательному региону максимально удобным и комфортным. <br/><br/>

                            Мы создали это приложение, чтобы объединить жителей и гостей нашего прекрасного края в одно большое и дружное сообщество. Наша главная цель - сделать передвижение по Шенталинскому району максимально простым, доступным и комфортным для каждого.<br/><br/>

                            Уникальность нашего проекта заключается в том, что приложение не требует установки и работает прямо в браузере вашего устройства. Это делает его удобным и легким в использовании для всех желающих.<br/><br/>

                            На данный момент к приложению подключены следующие населенные пункты Шенталинского района: Баландаево, Денискино, Толчеречье, Артюшкино, Костюнькино, Багана, Кондурча, Старая Шентала и Шентала. Но мы не останавливаемся на достигнутом и планируем постепенно расширять географию нашего присутствия.<br/><br/>

                            Стать водителем в нашем приложении может абсолютно любой человек, имеющий личный автомобиль, действующий страховой полис и водительское удостоверение. Мы не берем никаких комиссий, поэтому заработанная вами сумма останется целиком в вашем кармане.<br/>

                            Быть пассажиром также очень просто - достаточно достичь совершеннолетия и зарегистрироваться в приложении.<br/><br/>

                            Мы искренне верим, что наш проект поможет сделать жизнь в Шенталинском районе более удобной и комфортной. Присоединяйтесь к нашему сообществу, и вместе мы откроем новые горизонты мобильности в нашем замечательном крае!
                        </h4>
                        <Image className='promo_right__bg-image' src={LogoShort} alt='swift logo short "SF"'/>
                    </div>
                </div>
            </div>
            <marquee className="marquee_adverse">Реклама</marquee>
            <div className='main-block'>
                <div className='about_block'>
                    <div className='about_block__container'>
                        <h2>Страхуем всё, что важно для вас</h2>
                        <h4>Заботитесь о безопасности при вождении? Хотите обезопасить себя от непредвиденных ситуаций на дороге? Тогда наша компания - ваш надежный страховой партнер!<br/><br/>

                        Мы предлагаем широкий спектр страховых продуктов для вашего автомобиля: от обязательного ОСАГО до расширенных программ добровольного страхования. С нами вы можете не беспокоиться о рисках, ведь мы берем их на себя!<br/><br/>

                        ОСАГО? Для нас это не пустой звук, а гарантия вашей юридической защиты при ДТП. Наши специалисты оперативно оформят все необходимые документы.<br/><br/>

                        КАСКО - ваш персональный телохранитель для авто. Мы предлагаем широкие возможности по выбору покрытия, чтобы застраховать вашего железного коня по полной программе.<br/><br/>

                        Страхование жизни и здоровья водителей и пассажиров? Мы поможем выбрать оптимальный вариант для вашего спокойствия и финансовой защиты близких.<br/><br/>

                        Не хотите переплачивать за сервис? У нас гибкие тарифы, учитывающие ваш стаж, возраст и манеру вождения.</h4>
                        <i className="fa-solid fa-shield-halved"></i>
                    </div>
                    <iframe className="adverse_map" src="https://yandex.ru/map-widget/v1/?um=constructor%3A36494fe2532a9bfa7bcc2042323e9f86caba20d6654bc2cf2e8c392ab08acd2b&amp;source=constructor" width="500" height="400" frameborder="0"></iframe>
                </div>
            </div>
            <FooterPageComponent/>
        </div>
    )
}