'use client'
import { useState, useRef, useEffect } from 'react';
import PagesHeader from '../../../components/PagesHeader/PagesHeader'
import './style.sass'
import Cookies from 'js-cookie'
import Image from 'next/image';
import cameraIco from '/public/ico/camera.svg'
import emailjs from '@emailjs/browser';
export default function EditAccountPage(){
    // Получение sessionId из кук
    const [sessionKey, setSessionKey] = useState('')
    function myHandler() {
        const cookieValue = Cookies.get('UserData'); // Замените cookieName на имя необходимой вам cookie
        const userData = JSON.parse(cookieValue)
        setSessionKey(userData.session_key)
      }
    useEffect(()=>{
        myHandler()
    }, [])

    //Получение и сверка всех UserEmail
    const [userData, setUserData] = useState([])
    const [userName, setUserName] = useState('')
    function getUsersEmail(){
        if(sessionKey !== ''){
            fetch(`/api/account-data/user-data?sessionId=${sessionKey}`,{
                method: 'GET'
            }).then((result)=>{
                console.log("OKAY")
                return result.json()
            }).then((res)=>{
                setUserName(res[0].UserName.split(' ')[0])
                if(userData.length <= 0){
                    setUserData(res[0])
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
    useEffect(()=>{
        console.log(userData)
    }, [userData])
    // Загрузка фото профиля
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert("Выберите файл для загрузки");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("userData", JSON.stringify(userData.UserId))

        try {
        const response = await fetch("/api/account-data/upload-user", {
            method: "POST",
            body: formData,
        })

        const data = await response.json()
        console.log(data)
        getUsersEmail()
        window.location.reload()
        } catch (error) {
        console.error("Ошибка при загрузке файла:", error);
        }
    };

    const inputFileRef = useRef(null);
    const handleEditPhotoClick = () => {
        // Программное нажатие на кнопку выбора файла
        inputFileRef.current.click();
    };

    // Изменение данных
    const [editName, setEditName] = useState('')
    const [editPhone, setEditPhone] = useState('')
    const [editEmail, setEditEmail] = useState('')

    const [togglerChangingPopup, setTogglerChangingPopup] = useState('')

    function editInfoProfile(){
        fetch(`/api/account-data/edit-account-data?UserId=${userData.UserId}`, {
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "UserName": editName, 
                "UserPhone": editPhone, 
                "UserEmail": editEmail
            })
        })
        .then(()=>{
            setTogglerChangingPopup('popup-open')
        })
        .catch(error =>{
            console.log(error)
        })
    }
    // Проверка введенного Email
    const [togglerPopup, setTogglerPopup] = useState('') // Открытие popup с ошибкой ввода Email
    const [emailCode, setEmailCode] = useState(0)
    const [inputPasswordCode, setInputPasswordCode] = useState('')
    const [errorConfirmEmail, setErrorConfirmEmail] = useState('')
    const [togglerSendEmail, setTogglerSendEmail] = useState('') // Открытие popup С кодом
    const [togglerPopupInvalidEmail, setTogglerPopupInvalidEmail] = useState('')

    useEffect(()=>{
        setEmailCode(Math.floor(1000 + Math.random() * 9000))
    },[])
    function sendEmail(){
        setTogglerSendEmail('popup-open')
        emailjs.send("service_taxicap", "template_rkv2tvg", {
            'message': `${emailCode}`, 
            'email-to': `${editEmail}`
        }, "L1XK15ZnEN_oq838c")
        .then((result) => {
            console.log(result);
        }, (error) => {
            console.log(error);
        });
    }

    return(
        <>
            <div className='edit-account-page'>
                <div className='container'>
                    <div className='edit-account-page_wrapper'>
                        <PagesHeader ReturnBtn="/mobile/my-account" PageHeader="Редактирование"/>
                        <div className='loader-block'>
                            <input type="file" accept="image/jpeg, image/png" ref={inputFileRef} onChange={handleFileChange} />
                        </div>
                        <div className='edit-block'>
                            <div style={{backgroundImage: `url(${userData.UserImage === null ? '/ico/man-user.svg' : userData.UserImage})`}} className='user-photo'>
                                <div className='edit-photo'>
                                    <Image src={cameraIco} className='edit-photo_ico' onClick={handleEditPhotoClick}></Image>
                                </div>
                            </div>
                            {selectedFile && (<button className={`Button upload-btn`} onClick={handleUpload}>Загрузить</button>)}
                            <input className='input-field' placeholder={userData.UserName} value={editName} onChange={(e)=>{setEditName(e.target.value)}}/>
                            <input className='input-field' placeholder={userData.UserPhone} value={editPhone} onChange={(e)=>{setEditPhone(e.target.value)}}/>
                            <input className='input-field' placeholder={userData.UserEmail} value={editEmail} onChange={(e)=>{setEditEmail(e.target.value)}}/>
                        </div>
                        <div className='Button' onClick={()=>{
                            editEmail !== '' ? 
                            (editEmail === userData.UserEmail ? setTogglerPopupInvalidEmail('popup-open') : sendEmail()) 
                            : editInfoProfile()}}>Сохранить</div>
                    </div>
                </div>
            </div>
            <>
                <div className={`popup popup-input-error ${togglerPopupInvalidEmail}`}>
                    <h3 className='popup-input-error__text'>Эта электронная почта уже используется</h3>
                <div className='Button PopupButton' onClick={()=>{setTogglerPopupInvalidEmail('')}}>Закрыть</div>
                </div>
                <div className={`popup-background ${togglerPopupInvalidEmail}`}></div>
            </>
            <>
                <div className={`popup-background ${togglerChangingPopup}`}></div>
                <div className={`popup popup-input-error ${togglerChangingPopup}`}>
                    <h3 className='popup-input-error__text'>Данные изменены!</h3>
                    <div className='Button PopupButton' onClick={()=>{setTogglerChangingPopup('')}}>Закрыть</div>
                </div>
            </>
            <>
                <div className={`popup popup-input-error ${togglerSendEmail}`}>
                    <div className="popup-close-x-mark" onClick={()=>{setTogglerSendEmail("")}}><i className="fa-solid fa-xmark"></i></div>
                    <h3 className='popup-input-error__text'>Введите код подтверждения</h3>
                    <h4 className="popup-input-error__text">Код подтверждения отправлен вам на Email: {editEmail}</h4>
                    <input className="popup-input" type="number" required value={inputPasswordCode} onChange={(e)=>{setInputPasswordCode(e.target.value)}}/>
                    <h4 className="popup-input-error__text popup-input-error__text_message">{errorConfirmEmail}</h4>
                <div className='Button PopupButton' 
                    onClick={()=>{inputPasswordCode.trim() === emailCode.toString().trim() ? 
                    [setTogglerSendEmail(""), editInfoProfile()] : setErrorConfirmEmail("Неверный код")}}>Войти</div>
                </div>
                <div className={`popup-background ${togglerSendEmail}`}></div>
            </>
        </>
    )
}