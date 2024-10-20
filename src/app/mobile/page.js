'use client'
import Image from 'next/image'
import './style.sass'
import Link from "next/link"
import logo from '/public/logo/swift-logo.svg'
import { useState } from 'react'
import driverImg from '/public/image/startpage/driver.png'
import driver2Img from '/public/image/startpage/driver2.png'
import passengerImg from '/public/image/startpage/passenger.png'
import passenger2Img from '/public/image/startpage/passenger2.png'

export default function Home() {
  const [step, setStep] = useState(0)
  function handleNextStep(){
    setStep(step + 1)
  }

  const renderStepContent = () => {
      switch (step) {
        case 0:
          return(
            <div className='container'>
              <div className='reels-style'>
                <div className='reels-style-text'>
                  <h1>Создавай поездки</h1>
                  <h3>Создавайте поездки в два клика, используя удобный графический интерфейс</h3>
                </div>
                <div className='reels-other'>
                  <Image className='reels-style-image' src={passengerImg} alt='logo'/>
                  <div className='Button reels-style-button' onClick={()=>{handleNextStep()}}>Продолжить</div>
                </div>
              </div>
            </div>
          )
        case 1:
          return(
            <div className='container'>
              <div className='reels-style'>
                <div className='reels-style-text'>
                  <h1>Принимай поездки</h1>
                  <h3>Активируйте статус водителя, и берите созданные поездки пассажиров</h3>
                </div>
                <div className='reels-other'>
                  <Image className='reels-style-image' src={driverImg} alt='logo'/>
                  <div className='Button' onClick={()=>{handleNextStep()}}>Продолжить</div>
                </div>
              </div>
            </div>
          )
        case 2:
          return(
            <div className='container'>
              <div className='reels-style'>
                <div className='reels-style-text'>
                  <h1>Никаких комиссий!</h1>
                  <h3>Вам не надо ни с кем делить ваши заработанные деньги!</h3>
                </div>
                <div className='reels-other'>
                  <Image className='reels-style-image' src={driver2Img} alt='logo'/>
                  <div className='Button' onClick={()=>{handleNextStep()}}>Продолжить</div>
                </div>
              </div>
            </div>
          )
        case 3:
          return(
            <div className='container'>
              <div className='reels-style'>
                <div className='reels-style-text'>
                  <h1>Безопасность</h1>
                  <h3>Нажимая продолжить, вы соглашаетесь <br/> <Link href='/privacy-policy'>с условиями пользования и конфидентифициальности</Link></h3>
                </div>
                <div className='reels-other'>
                  <Image className='reels-style-image' src={passenger2Img} alt='logo'/>
                  <div className='Button' onClick={()=>{handleNextStep()}}>Продолжить</div>
                </div>
              </div>
            </div>
          )
        case 4:
          return (
              <main className="WelcomePage">
                <div className="container">
                  <Image src={logo} alt="logo" style={{height: 'auto', width: '100%', margin: '2rem 0'}}/>
                  <div className='StartButtonBlock'>
                    <Link className='Button BtnStart' href={'/mobile/sign-in'}>Начать пользоваться</Link>
                  </div>
                </div>
              </main>
          )
  }}
  return(
    <div className="welcome-app">
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