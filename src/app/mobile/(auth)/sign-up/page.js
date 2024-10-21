'use client'
import { useEffect, useState } from "react"
import './style.sass'
import emailjs from '@emailjs/browser'
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
  } from "@/components/ui/input-otp"



export default function SignInPage(){
    const router = useRouter()
    const [step, setStep] = useState(0)
    const [togglerPopup, setTogglerPopup] = useState('')
    const [togglerConfirmEmailPopup, setTogglerConfirmEmailPopup] = useState('')
    function handleNextStep(){
        setStep(step + 1)
    }

    const handlePrevStep = () => {
        setStep(step - 1)
    }

    const [inputName, setInputName] = useState('')
    const [inputEmail, setInputEmail] = useState('')
    const [inputConfirmEmail, setInputConfirmEmail] = useState('')
    const [inputPassword, setInputPassword] = useState('')
    const [inputConfirmPassword, setInputConfirmPassword] = useState('')
    const [errorConfirmEmail, setErrorConfirmEmail] = useState('')

    //Получение и сверка всех UserEmail
    const [togglerPopupInvalidEmail, setTogglerPopupInvalidEmail] = useState('')
    async function getUsersEmail(){
        await fetch(`/api/account-data/emails?inputEmail=${inputEmail}`,{
            method: 'GET'
        }).then((result)=>{
            console.log("OKAY")
            return result.json()
        }).then((data)=>{
            if(inputEmail === data[0]){
                setTogglerPopupInvalidEmail('popup-open')
            }else{
                setTogglerConfirmEmailPopup("popup-open")
                sendMessage()
            }
        })
        .catch(error =>{
            console.log(error)
        })
    }


    // Регистрация
    async function handleSubmit() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        let sessionId = ''
        for (let i = 0; i < 39; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length)
        sessionId += characters[randomIndex]
        }
        console.log(sessionId)
        setCookie('UserData', JSON.stringify({
                session_key: sessionId
            }), 30)
        await fetch('/api/account-data/sign-up', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId, inputName, inputEmail, inputPassword, inputConfirmPassword }),
        })
        .then(() =>{
            console.log("Register Complete")
        }).catch(error=>{
            console.log("Error", error)
            alert("Произошла ошибка регистрации, повторите снова")
        })
    }
    // Запись SessionId в куки
    function setCookie(name, value) {
        let expires = ""
        let date = new Date()
        date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000))
        expires = " expires=" + date.toUTCString()
    
        document.cookie = name + "=" + decodeURIComponent(value) + expires + " path=/"
    }

    // Отправка кода на Email
    const [emailCode, setEmailCode] = useState(0)
    useEffect(()=>{
        setEmailCode(Math.floor(1000 + Math.random() * 9000))
    },[])
    const [emailConfirmed, setEmailConfirmed] = useState(false)
    function sendMessage(){
        emailjs.send("service_taxicap", "template_rkv2tvg", {
            'message': `${emailCode}`, 
            'email-to': `${inputEmail}`
        }, "L1XK15ZnEN_oq838c")
        .then((result) => {
            console.log(result)
        }, (error) => {
            console.log(error)
        })
    }

    useEffect(()=>{
        console.log(inputConfirmEmail)
    },[inputConfirmEmail])

    function renderStepContent(){
        switch (step) {
            case 0:
                return(
                    <>
                        <div className="AuthForm">
                            <label htmlFor="Name">Ваше имя</label>
                            <input 
                                type="text" 
                                required 
                                placeholder="Имя" 
                                id="Name"
                                value={inputName}
                                onChange={(e)=>setInputName(e.target.value)}
                            />
                            <label htmlFor="Email">Email</label>
                            <input 
                                type="email" 
                                required 
                                placeholder="Email" 
                                id="Email"
                                value={inputEmail}
                                onChange={(e)=>setInputEmail(e.target.value)}
                            />
                            <div className="Button" 
                                onClick={()=>{
                                    inputName === "" || /\d/.test(inputName) || inputEmail === "" || 
                                    /\S+@\S+\.\S+/.test(inputEmail) === false ? 
                                    setTogglerPopup('popup-open') : !emailConfirmed ?
                                    getUsersEmail() : handleNextStep()}}>Продолжить</div>
                            <>
                                <div className={`popup popup-input-error ${togglerPopup}`}>
                                    <h3 className='popup-input-error__text'>Убедитесь, правильно ли вы ввели свои данные</h3>
                                <div className='Button PopupButton' onClick={()=>{setTogglerPopup('')}}>Закрыть</div>
                                </div>
                                <div className={`popup-background ${togglerPopup}`}></div>
                            </>
                            <>
                                <div className={`popup popup-input-error ${togglerPopupInvalidEmail}`}>
                                    <h3 className='popup-input-error__text'>Эта электронная почта уже используется</h3>
                                <div className='Button PopupButton' onClick={()=>{setTogglerPopupInvalidEmail('')}}>Закрыть</div>
                                </div>
                                <div className={`popup-background ${togglerPopupInvalidEmail}`}></div>
                            </>
                            <>
                                <div className={`popup popup-input-error popup-email-code ${togglerConfirmEmailPopup}`}>
                                    <div className="popup-close-x-mark" onClick={()=>{setTogglerConfirmEmailPopup("")}}><i className="fa-solid fa-xmark"></i></div>
                                    <h3 className='popup-input-error__text'>Введите код подтверждения</h3>
                                    <h4 style={{marginBottom: '10px'}} className="popup-input-error__text">Код подтверждения отправлен вам на Email: {inputEmail}</h4>
                                    <InputOTP className="popup-input" maxLength={4} value={inputConfirmEmail} onChange={(value)=>{setInputConfirmEmail(value)}}>
                                        <InputOTPGroup>
                                            <InputOTPSlot index={0}/>
                                            <InputOTPSlot index={1}/>
                                            <InputOTPSlot index={2}/>
                                            <InputOTPSlot index={3}/>
                                        </InputOTPGroup>
                                    </InputOTP>
                                    <h4 className="popup-input-error__text popup-input-error__text_message">{errorConfirmEmail}</h4>
                                <div style={{marginTop: '10px'}} className='Button PopupButton' onClick={()=>{inputConfirmEmail.trim() === emailCode.toString().trim() ? [setTogglerConfirmEmailPopup(""), setEmailConfirmed(true), handleSubmit(), router.push('/mobile/set-account')] : setErrorConfirmEmail("Неверный код")}}>Подтвердить</div>
                                </div>
                                <div className={`popup-background ${togglerConfirmEmailPopup}`}></div>
                            </>
                        </div>
                        <div className="AccountSign">Уже есть аккаунт? <Link href='/mobile/sign-in'>Войдите</Link></div>
                    </>
                )
        }}
    return(
        <div className="Authentication">
            <div className="container">
                <h1>Регистрация</h1>
                {renderStepContent()}
            </div>
        </div>
    )
}