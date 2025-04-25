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
import { toast } from "sonner"
import { Toaster } from '@/components/ui/sonner'
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader } from '@/components/ui/alert-dialog'

export default function SignInPage(){
    function setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        const expiresStr = "expires=" + expires.toUTCString();
        document.cookie = `${name}=${value}; ${expiresStr}; path=/`;
    }
    function toastWarning(){
        toast.warning("Проверьте правильность введенного номера.", {
            duration: 5000,
        })
    }
    const router = useRouter()
    const [step, setStep] = useState(0)
    const [phoneNumber, setPhoneNumber] = useState('')
    const [rawPhone, setRawPhone] = useState('')
    const [togglerPopup, setTogglerPopup] = useState('')
    const [togglerConfirmEmailPopup, setTogglerConfirmEmailPopup] = useState('')
    const [togglerPopupInvalidEmail, setTogglerPopupInvalidEmail] = useState('')
    const [alertError, setAlertError] = useState(false)
    const [togglerPopupLoadingData, setTogglerPopupLoadingData] = useState('')

    function handleNextStep(){
        setStep(step + 1)
    }

    const [userName, setUserName] = useState('')
    const [userEmail, setUserEmail] = useState('')
    const [inputConfirmEmail, setInputConfirmEmail] = useState('')
    const [errorConfirmEmail, setErrorConfirmEmail] = useState('')
    const formatPhone = (value) => {
        // Удаляем всё, кроме цифр
        const digits = value.replace(/\D/g, '').substring(0, 10);
        const parts = [];
    
        if (digits.length > 0) parts.push(digits.substring(0, 3));
        if (digits.length >= 4) parts.push(digits.substring(3, 6));
        if (digits.length >= 7) parts.push(digits.substring(6, 8));
        if (digits.length >= 9) parts.push(digits.substring(8, 10));
    
        return parts
          .map((part, index) => {
            if (index === 0) return part;
            return '-' + part;
          })
          .join('');
    };
    
    const handleChange = (e) => {
        const raw = e.target.value.replace(/\D/g, '').substring(0, 10);
        const formatted = formatPhone(e.target.value);
        setPhoneNumber(formatted);
        setRawPhone(raw)
    };

    async function getUsersEmail() {
        try {
          const response = await fetch(`/api/account-data/emails?inputEmail=${userEmail}`, {
            method: 'GET',
          });
          if (response.status === 200) {
            // Email уже существует
            setTogglerPopupInvalidEmail('popup-open');
          } else if (response.status === 404) {
            // Email свободен
            setTogglerConfirmEmailPopup('popup-open');
            sendMessage();
          } else {
            // Нестандартный ответ
            console.warn("Неожиданный статус:", response.status);
          }
      
        } catch (error) {
          console.error("Ошибка запроса:", error);
        }
    }

    async function sendMessage(){
        setTogglerPopupLoadingData('popup-open')
        const response = await fetch('/api/send-message?type=send-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
                { 
                    userEmail: userEmail,
                    userName: userName, 
                    rawPhone: '',
                    authType: 'sign-up'
                }
            )
        })
        if(response.status == 400){
            setTogglerPopupLoadingData('')
            setTogglerPopupInvalidEmail('popup-open')
        }else if(response.ok){
            setTogglerPopupLoadingData('')
            setTogglerConfirmEmailPopup('popup-open');
        }else if(!response.ok){
            setAlertError(true)
        }
    }
      
    // Регистрация
    async function signUpSend() {
        setTogglerPopupLoadingData('popup-open')
        try {
            const response = await fetch('/api/send-message?type=verify-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    { 
                        userName: userName, 
                        userEmail: userEmail, 
                        rawPhone: rawPhone,
                        code: inputConfirmEmail,
                        authType: 'sign-up'
                    }
                ),
            });
            const res = await response.json();
            if (response.ok) {
                if(step == 0){
                    setTogglerPopupLoadingData('')
                    setTogglerConfirmEmailPopup("")
                    setStep(1)
                }else if (rawPhone != '' && step == 1){
                    setCookie('token', res.token, 7);
                    router.push('general/')
                }
            } else if (response.status == 400 ){
                setTogglerPopupLoadingData('')
                setTogglerPopupInvalidEmail('popup-open')
            } else if (response.status == 401){
                setTogglerPopupLoadingData('')
                setErrorConfirmEmail("Неверный код")
            }
            else {
                setAlertError(true)
            }
        } catch (error) {
            setAlertError(true)
        }
    }
    

    function renderStepContent(){
        switch (step) {
            case 0:
                return(
                    <>
                        <div className="AuthForm">
                            <div>
                                <label htmlFor="Name">Ваше имя</label>
                                <input 
                                    type="text" 
                                    required 
                                    placeholder="Имя" 
                                    id="Name"
                                    value={userName}
                                    onChange={(e)=>setUserName(e.target.value)}
                                />
                            </div>
                            <div className='mt-2'>
                                <label htmlFor="Email">Email</label>
                                <input 
                                    type="email" 
                                    required 
                                    placeholder="Email" 
                                    id="Email"
                                    value={userEmail}
                                    onChange={(e)=>setUserEmail(e.target.value)}
                                />
                            </div>
                            <div className="Button" 
                                onClick={()=>{
                                    userName === "" || /\d/.test(userName) || userEmail === "" || 
                                    /\S+@\S+\.\S+/.test(userEmail) === false ? 
                                    setTogglerPopup('popup-open') : sendMessage()}}>Продолжить</div>
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
                                    <h4 className="popup-input-error__text">Код подтверждения отправлен вам на Email: {userEmail}</h4>
                                    <h5 className='mb-3 text-sm'>Проверьте папку спам</h5>
                                    <InputOTP className="popup-input" maxLength={4} value={inputConfirmEmail} onChange={(value)=>{setInputConfirmEmail(value)}}>
                                        <InputOTPGroup>
                                            <InputOTPSlot index={0}/>
                                            <InputOTPSlot index={1}/>
                                            <InputOTPSlot index={2}/>
                                            <InputOTPSlot index={3}/>
                                        </InputOTPGroup>
                                    </InputOTP>
                                    <h4 className="popup-input-error__text popup-input-error__text_message">{errorConfirmEmail}</h4>
                                <div style={{marginTop: '10px'}} className='Button PopupButton' onClick={()=>{signUpSend()}}>Подтвердить</div>
                                </div>
                                <div className={`popup-background ${togglerConfirmEmailPopup}`}></div>
                            </>
                        </div>
                        <div className="AccountSign">Уже есть аккаунт? <Link href='/mobile/sign-in'>Войдите</Link></div>
                    </>
                )
                case 1:
                    return(
                        <>
                            <div className="GetStartedPageBlock pt-6">
                                <h2 className="text-xl font-medium">Ваш номер телефона</h2>
                                <h3 className='text-sm my-3'>Это позволит клиенту, в случае необходимости, связаться с вами</h3>
                                <div className='flex relative'>
                                    <label className='self-center mr-2'>+7</label>
                                    <input
                                        type="text"
                                        value={phoneNumber}
                                        onChange={handleChange}
                                        placeholder="___-___-__-__"
                                        className="my-2"
                                    />
                                </div>
                            </div>
                            <div className='FormButtonBlock'>
                                <div onClick={()=>{phoneNumber.length < 10 ? toastWarning() : signUpSend()}} className="Button GetStartedBtn">
                                    Продолжить
                                </div>
                            </div>
                        </>
                    )
        }}
    return(
        <>
            <div className="Authentication">
                <div className="container">
                    <h1>Регистрация</h1>
                    {renderStepContent()}
                    <Toaster visibleToasts={1}/>
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