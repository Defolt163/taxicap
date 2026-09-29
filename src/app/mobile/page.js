'use client'
import Image from 'next/image'
import './style.sass'
import Link from "next/link"
import logo from '/public/favicon/android-chrome-512x512.png'
import phone_ui from '/public/image/phone_interface.png'
import walletImage from '/public/image/wallet_image.png'
import shieldImage from '/public/image/shield_ico.png'
import { useState } from 'react'

export default function Home() {
  function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    const expiresStr = "expires=" + expires.toUTCString();
    document.cookie = `${name}=${value}; ${expiresStr}; path=/`;
  }
  const [step, setStep] = useState(0)
  function handleNextStep(){
    setStep(step + 1)
  }


  const renderStepContent = () => {
      switch (step) {
        case 0:
          return(
            <div className='container container-settings-page' style={{background: 'url(/settings-bg/bg-1.png) center center/cover no-repeat'}}>
              <div className='reels-style'>
                <div className='reels-style-text'>
                  <h1>Создавай поездки</h1>
                  <h3>Создавайте поездки в два клика, используя удобный графический интерфейс</h3>
                </div>
                <div className='reels-other'>
                  <div className='Button reels-style-button' onClick={()=>{handleNextStep()}}>Продолжить</div>
                </div>
              </div>
            </div>
          )
        case 1:
          return(
            <div className='container container-settings-page' style={{background: 'url(/settings-bg/bg-2.png) center center/cover no-repeat'}}>
              <div className='reels-style'>
                <div className='reels-style-text'>
                  <h1>Принимай поездки</h1>
                  <h3>Активируйте статус водителя, и берите созданные поездки пассажиров</h3>
                </div>
                <Image className='reels_image phone_mockup' src={phone_ui} alt='интерфейс телефона'/>
                <div className='reels-other'>
                  <div className='Button' onClick={()=>{handleNextStep()}}>Продолжить</div>
                </div>
              </div>
            </div>
          )
        case 2:
          return(
            <div className='container container-settings-page other_style'>
              <div className='reels-style'>
                <div className='reels-style-text'>
                  <h1>Никаких комиссий!</h1>
                  <h3>Вам не надо ни с кем делить ваши заработанные деньги!</h3>
                </div>
                <Image className='reels_image wallet' src={walletImage} alt="кошелек с золотыми монетами"/>
                <div className='reels-other'>
                  <div className='Button' onClick={()=>{handleNextStep()}}>Продолжить</div>
                </div>
              </div>
            </div>
          )
        case 3:
          return(
            <div className='container container-settings-page' style={{background: 'url(/settings-bg/bg-4.png) center center/cover no-repeat'}}>
              <div className='reels-style'>
                <div className='reels-style-text'>
                  <h1>Безопасность</h1>
                  <h3>Нажимая продолжить, вы соглашаетесь <br/> <Link href='/privacy-policy'>с условиями пользования и конфидентифициальности</Link></h3>
                </div>
                <div className='reels_image_block'>
                  <Image className='image_shield' src={shieldImage} alt="кошелек с золотыми монетами"/>
                </div>
                
                <div className='reels-other'>
                  <div className='Button' onClick={()=>{setCookie('firstScreen', true, 999); handleNextStep()}}>Продолжить</div>
                </div>
              </div>
            </div>
          )
        case 4:
          return (
            <div className='container px-4 container-settings-page other_style' style={{background: 'url(/settings-bg/bg-5.png) center center/cover no-repeat'}}>
              <div className='reels-style final_reels'>
                <div className='final_screen'>
                  <Image src={logo} alt="logo" className='image_logo'/>
                  <h1>Поехали</h1>
                  <h2>Попутные поездки для нашего района</h2>
                </div>
                
                <Link className='Button BtnStart' href={'/mobile/sign-in'}>Начать пользоваться</Link>
              </div>
            </div>
          )
  }}
  return(
    <div className="welcome-app" style={{backgroundColor: "rgb(28 27 27)"}}>
      <div className='stat-bar'><style jsx>{`
        .stat-bar::before {
          width: ${step === 0 ? '25%' : step === 1 ? '50%' : step === 2 ? '75%' : '100%'}
        }
        .stat-bar{
          display: ${step === 4 ? 'none' : 'block'}
        }
      `}</style></div>
        {renderStepContent()}
    </div>
  )
}