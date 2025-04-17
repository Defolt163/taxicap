'use client'
import { useEffect, useState } from "react"
import emailjs from '@emailjs/browser';
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
  } from "@/components/ui/input-otp"

export default function SignInPage(){
    const router = useRouter()
    const [inputEmail, setInputEmail] = useState('')
    //const [emailCode, setEmailCode] = useState(0)

    // Установка куки
    function setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        const expiresStr = "expires=" + expires.toUTCString();
        document.cookie = `${name}=${value}; ${expiresStr}; path=/`;
    }

    useEffect(()=>{
        //setEmailCode(Math.floor(1000 + Math.random() * 9000))
    },[])
    const emailCode = 1111
    function sendMessage(){
        setTogglerSendEmail('popup-open')
        /* emailjs.send("service_taxicap", "template_rkv2tvg", {
            'message': `${emailCode}`, 
            'email-to': `${inputEmail}`
        }, "L1XK15ZnEN_oq838c")
        .then((result) => {
            console.log(result);
        }, (error) => {
            console.error(error);
        }); */
    }
    async function SignIn(){
        try {
            const response = await fetch('/api/account-data/sign-in', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: inputEmail }),
            });
    
            const res = await response.json();
    
            if (response.ok) {
                setCookie('token', res.token, 7);
                router.push('/mobile/general')
            } else {
                alert(res.message);
            }
        } catch (error) {
            alert(error)
        }
    }


    const [togglerPopup, setTogglerPopup] = useState('') // Открытие popup с ошибкой ввода Email
    const [togglerSendEmail, setTogglerSendEmail] = useState('') // Открытие popup С кодом
    const [inputPasswordCode, setInputPasswordCode] = useState('') // Код подтверждения
    const [errorConfirmEmail, setErrorConfirmEmail] = useState('') // Сообщение об ошибке кода
    async function getUsersEmail(){
        try{
            const response = await fetch(`/api/account-data/emails?inputEmail=${inputEmail}`, {
                method: 'GET'
            })
            const res = await response.json()
            if(response.status == 400){
                sendMessage()
            } else {
                setTogglerPopup('popup-open')
            }
        }
        catch{
            alert("Ошибка сервера")
        } 
    }
    
    return(
        <div className="Authentication">
            <div className="container">
                <h1>Авторизация</h1>
                <div className="AuthForm">
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
                            inputEmail === "" || 
                            /\S+@\S+\.\S+/.test(inputEmail) === false ? 
                            setTogglerPopup('popup-open') : getUsersEmail()}}>Войти</div>
                    <>
                        <div className={`popup popup-input-error ${togglerPopup}`}>
                            <h3 className='popup-input-error__text'>{inputEmail === "" || /\S+@\S+\.\S+/.test(inputEmail) === false ?
                            "Email, который вы ввели - неверный" : "Аккаунта с таким Email не существует"}</h3>
                        <div className='Button PopupButton' onClick={()=>{setTogglerPopup('')}}>Закрыть</div>
                        </div>
                        <div className={`popup-background ${togglerPopup}`}></div>
                    </>
                    <>
                        <div className={`popup popup-input-error popup-email-code ${togglerSendEmail}`}>
                            <div className="popup-close-x-mark" onClick={()=>{setTogglerSendEmail("")}}><i className="fa-solid fa-xmark"></i></div>
                            <h3 className='popup-input-error__text'>Введите код подтверждения</h3>
                            <h4 style={{marginBottom: '10px'}} className="popup-input-error__text">Код подтверждения отправлен вам на Email: {inputEmail}</h4>
                            <InputOTP className="popup-input" maxLength={4} value={inputPasswordCode} onChange={(value)=>{setInputPasswordCode(value)}}>
                                <InputOTPGroup>
                                    <InputOTPSlot index={0}/>
                                    <InputOTPSlot index={1}/>
                                    <InputOTPSlot index={2}/>
                                    <InputOTPSlot index={3}/>
                                </InputOTPGroup>
                            </InputOTP>
                            <h4 className="popup-input-error__text popup-input-error__text_message">{errorConfirmEmail}</h4>
                            <div style={{marginTop: '10px'}} className='Button PopupButton' 
                                onClick={()=>{inputPasswordCode.trim() === emailCode.toString().trim() ? 
                                [SignIn()] : setErrorConfirmEmail("Неверный код")}}>Войти</div>
                        </div>
                        <div className={`popup-background ${togglerSendEmail}`}></div>
                    </>
                </div>
                <div className="AccountSign">Нет аккаунта? <Link href='/mobile/sign-up'>Зарегистрируйтесь</Link></div>
            </div>
        </div>
    )
}