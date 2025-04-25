'use client'
import { useState } from "react"
import PagesHeader from '../../../components/PagesHeader/PagesHeader'
import './style.sass'

export default function FeedbackPage(){
    const [togglerPopupLoadingData, setTogglerPopupLoadingData] = useState('')
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null; // Если куки нет
    }
    const [feedbackValue, setFeedbackValue] = useState('')
    const [togglerPopup, setTogglerPopup] = useState('')
    const [popupText, setPopupText] = useState('')
    async function sendMessage(){
        const token = getCookie('token')
        if(feedbackValue !== ""){
            setTogglerPopupLoadingData('popup-open')
            const response = await fetch('/api/send-message?type=feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ userMessage: feedbackValue })
            })
            if(!response.ok){
                setTogglerPopupLoadingData('')
                setTogglerPopup('popup-open')
                setPopupText('Ошибка сервера')
            }else{
                setTogglerPopupLoadingData('')
                setTogglerPopup('popup-open')
                setPopupText('Сообщение отправлено')
            }
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
            {/* Loading */}
            <div className={`popup-background ${togglerPopupLoadingData}`}></div>
            <div className={`popup popup-input-error ${togglerPopupLoadingData}`}>
                <h3 className='popup-input-error__text'>Загрузка</h3>
            </div>
            <div className={`popup-background ${togglerPopupLoadingData}`}></div>
        </>
    )
} 