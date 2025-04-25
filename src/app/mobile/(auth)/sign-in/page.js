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
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader } from '@/components/ui/alert-dialog';

export default function SignInPage(){
    const router = useRouter()
    const [inputEmail, setInputEmail] = useState('')
    const [alertError, setAlertError] = useState(false)
    const [togglerPopupLoadingData, setTogglerPopupLoadingData] = useState('')

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
    //const emailCode = 1111
    async function sendMessage(){
        setTogglerPopupLoadingData('popup-open')
        const response = await fetch('/api/send-message?type=send-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
                { 
                    userEmail: inputEmail,
                    authType: 'sign-in'
                }
            )
        })
        if(response.ok){
            setTogglerPopupLoadingData('')
            setTogglerSendEmail('popup-open')
        }else if(response.status == 404){
            setTogglerPopupLoadingData('')
            setTogglerPopup('popup-open')
        }else if(!response.ok){
            setTogglerPopupLoadingData('')
            setAlertError(true)
        }
    }

    async function SignIn(){
        setTogglerPopupLoadingData('popup-open')
        try {
            const response = await fetch('/api/send-message?type=verify-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    userEmail: inputEmail, 
                    code: inputPasswordCode,
                    authType: 'sign-in'
                }),
            });
            const result = await response.json();
            if (response.ok) {
                setTogglerPopupLoadingData('')
                setErrorConfirmEmail("")
                setCookie('token', result.token, 7);
                router.push('/mobile/general')
            } else {
                setTogglerPopupLoadingData('')
                setErrorConfirmEmail("Код неверный")
            }
        } catch (error) {
            setTogglerPopupLoadingData('')
            setAlertError(true)
        }
    }


    const [togglerPopup, setTogglerPopup] = useState('') // Открытие popup с ошибкой ввода Email
    const [togglerSendEmail, setTogglerSendEmail] = useState('') // Открытие popup С кодом
    const [inputPasswordCode, setInputPasswordCode] = useState('') // Код подтверждения
    const [errorConfirmEmail, setErrorConfirmEmail] = useState('') // Сообщение об ошибке кода
    
    return(
        <>
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
                                setTogglerPopup('popup-open') : sendMessage()}}>Войти</div>
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
                                <div className="popup-close-x-mark" onClick={()=>{setTogglerSendEmail(""), setInputPasswordCode(""), setErrorConfirmEmail("")}}><i className="fa-solid fa-xmark"></i></div>
                                <h3 className='popup-input-error__text'>Введите код подтверждения</h3>
                                <h4 className="popup-input-error__text">Код подтверждения отправлен вам на Email: {inputEmail}</h4>
                                <h5 className='mb-3 text-sm'>Проверьте папку спам</h5>
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
                                    onClick={()=>{SignIn()}}
                                >Войти</div>
                            </div>
                            <div className={`popup-background ${togglerSendEmail}`}></div>
                        </>
                    </div>
                    <div className="AccountSign">Нет аккаунта? <Link href='/mobile/sign-up'>Зарегистрируйтесь</Link></div>
                </div>
            </div>
            <AlertDialog open={alertError} onOpenChange={setAlertError}>
                <AlertDialogContent className='w-11/12'>
                    <AlertDialogHeader>
                        <AlertDialogDescription>
                            Ошибка сервера
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => setAlertError(false)}>Закрыть</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <div>
                <div className={`popup-background ${togglerPopupLoadingData}`}></div>
                <div className={`popup popup-input-error ${togglerPopupLoadingData}`}>
                    <h3 className='popup-input-error__text'>Загрузка</h3>
                </div>
                <div className={`popup-background ${togglerPopupLoadingData}`}></div>
            </div>
        </>
    )
}