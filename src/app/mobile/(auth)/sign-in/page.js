'use client'
import { useEffect, useState } from "react"
import emailjs from '@emailjs/browser';
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignInPage(){
    const router = useRouter()
    const [inputEmail, setInputEmail] = useState('')
    const [emailCode, setEmailCode] = useState(0)

    // Установка куки
    function setCookie(name, value) {
        let expires = ""
        let date = new Date()
        date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000))
        expires = "; expires=" + date.toUTCString()
    
        document.cookie = name + "=" + decodeURIComponent(value) + expires + "; path=/"
        localStorage.setItem('accountSessionId', value)
    }

    useEffect(()=>{
        setEmailCode(Math.floor(1000 + Math.random() * 9000))
    },[])
    function sendMessage(){
        emailjs.send("service_taxicap", "template_rkv2tvg", {
            'message': `${emailCode}`, 
            'email-to': `${inputEmail}`
        }, "L1XK15ZnEN_oq838c")
        .then((result) => {
            console.log(result);
        }, (error) => {
            console.log(error);
        });
    }


    const [togglerPopup, setTogglerPopup] = useState('') // Открытие popup с ошибкой ввода Email
    const [togglerSendEmail, setTogglerSendEmail] = useState('') // Открытие popup С кодом
    const [inputPasswordCode, setInputPasswordCode] = useState('') // Код подтверждения
    const [errorConfirmEmail, setErrorConfirmEmail] = useState('') // Сообщение об ошибке кода
    async function getUsersEmail(){
        await fetch(`/api/account-data/emails?inputEmail=${inputEmail}`,{
            method: 'GET'
        }).then((result)=>{
            console.log("OKAY")
            return result.json()
        }).then((data)=>{
            if(inputEmail === data[0]){
                sendMessage()
                setTogglerSendEmail('popup-open')
            }else{
                setTogglerPopup('popup-open')
            }
        })
        .catch(error =>{
            console.log(error)
        })
    }
    async function updateSessionId(){
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let sessionId = '';
        for (let i = 0; i < 39; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        sessionId += characters[randomIndex];
        }
        console.log(sessionId)
        setCookie('UserData', JSON.stringify({
                session_key: sessionId
            }), 30);
        await fetch(`/api/account-data/sign-in?UserEmail=${inputEmail}`,{
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "UserSessionId": sessionId }),
        }).then(()=>{
            console.log("Logged!")
            router.push('/mobile/general')
        })
        .catch(error =>{
            console.log(error)
        })
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
                        <div className={`popup popup-input-error ${togglerSendEmail}`}>
                            <div className="popup-close-x-mark" onClick={()=>{setTogglerSendEmail("")}}><i className="fa-solid fa-xmark"></i></div>
                            <h3 className='popup-input-error__text'>Введите код подтверждения</h3>
                            <h4 className="popup-input-error__text">Код подтверждения отправлен вам на Email: {inputEmail}</h4>
                            <input className="popup-input" type="number" required value={inputPasswordCode} onChange={(e)=>{setInputPasswordCode(e.target.value)}}/>
                            <h4 className="popup-input-error__text popup-input-error__text_message">{errorConfirmEmail}</h4>
                        <div className='Button PopupButton' 
                            onClick={()=>{inputPasswordCode.trim() === emailCode.toString().trim() ? 
                            [setTogglerSendEmail(""), updateSessionId()] : setErrorConfirmEmail("Неверный код")}}>Войти</div>
                        </div>
                        <div className={`popup-background ${togglerSendEmail}`}></div>
                    </>
                </div>
                <div className="AccountSign">Нет аккаунта? <Link href='/mobile/sign-up'>Зарегистрируйтесь</Link></div>
            </div>
        </div>
    )
}