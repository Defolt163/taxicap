'use client'
import { useEffect, useState } from "react"
import emailjs from '@emailjs/browser';
import Cookies from 'js-cookie'
import PagesHeader from '../../../components/PagesHeader/PagesHeader'
import './style.sass'

export default function FeedbackPage(){
    const [sessionKey, setSessionKey] = useState('')
    function myHandler() {
        if(sessionKey === ''){
            const cookieValue = Cookies.get('UserData'); // Замените cookieName на имя необходимой вам cookie
            const userData = JSON.parse(cookieValue)
            setSessionKey(userData.session_key)
        }
      }
    useEffect(()=>{
        myHandler()
    }, [])
    const [userData, setUserData] = useState([])
    function getUsersEmail(){
        if(sessionKey !== '' && userData.length <= 0){
            fetch(`/api/account-data/user-data?sessionId=${sessionKey}`,{
                method: 'GET'
            }).then((result)=>{
                console.log("OKAY")
                return result.json()
            }).then((res)=>{
                if(userData.length <= 0){
                    setUserData(res)
                }
            })
            .catch(error =>{
                console.log(error)
            })
        }
    }
    useEffect(()=>{
        getUsersEmail()
    }, [sessionKey])
    const [feedbackValue, setFeedbackValue] = useState('')
    const [togglerPopup, setTogglerPopup] = useState('')
    const [popupText, setPopupText] = useState('')
    function sendMessage(){
        if(feedbackValue !== ""){
            emailjs.send("service_taxicap", "template_z576mni", {
                'user_name': `${userData[0].UserName}`,
                'user_email': `${userData[0].UserEmail}`,
                'user_id': `${userData[0].UserId}`,
                'message': `${feedbackValue}`
            }, "L1XK15ZnEN_oq838c")
            .then(() => {
                setTogglerPopup('popup-open')
                setPopupText('Сообщение отправлено')
            }, () => {
                setTogglerPopup('popup-open')
                setPopupText('Ошибка сервера')
            });
        }else{
            setTogglerPopup('popup-open')
            setPopupText('Вы ничего не написали')
        }
    }
    return(
        <>
            <div className="feedback">
                <div className="container">
                    <PagesHeader ReturnBtn="/mobile/general" PageHeader="Обратная связь"/>
                    <div className="textarea-header">Здесь вы можете сообщить о ошибках, найденные в приложении, либо оставить предложения по улучшению сервиса</div>
                    <form className='feedback-form'>
                        <textarea className="feedback-textarea" value={feedbackValue} onChange={(e)=>setFeedbackValue(e.target.value)}/>
                        <div className="Button" onClick={()=>{sendMessage()}}>Отправить</div>
                    </form>
                </div>
            </div>
            <div className={`popup-background ${togglerPopup}`}></div>
            <div className={`popup popup-input-error ${togglerPopup}`}>
                <h3 className='popup-input-error__text'>{popupText}</h3>
                <div className='Button PopupButton' onClick={()=>{setTogglerPopup('')}}>Закрыть</div>
            </div>
            <div className={`popup-background ${togglerPopup}`}></div>
        </>
    )
} 