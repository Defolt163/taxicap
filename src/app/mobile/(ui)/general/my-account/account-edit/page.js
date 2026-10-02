'use client'
import { useState, useRef, useEffect } from 'react'
import PagesHeader from '../../../../components/PagesHeader/PagesHeader'
import './style.sass'
import Cookies from 'js-cookie'
import Image from 'next/image'
import cameraIco from '/public/ico/camera.svg'
import { useData } from '@/app/mobile/components/DataContext'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from "sonner"
import { Toaster } from '@/components/ui/sonner'
import { usePopup } from '@/app/mobile/components/PopupContext'
import EmailCodePopup from '@/app/mobile/components/ui/Popups/EmailCodePopup'

export default function EditAccountPage(){
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null; // Если куки нет
    }
    function setCookie(name, value, days) {
        const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString()
        document.cookie = `${name}=${value}; expires=${expires}; path=/`
    }
    const { userData, setUserData, loadingStatus } = useData()
    const { showChoicePopup, showPopup } = usePopup();
    useEffect(()=>{
        if(userData && userData.Approved == 3){
            toast.warning("Ваше фото находится на модерации", {
                duration: Infinity,
            })
        } else if(userData && userData.Approved == 4){
            toast.error('Фото не прошло модерацию', {
                description: `${userData && userData.PhotoWarningDescription}`,
                duration: Infinity,
            });
        }
    }, [userData])
    // Загрузка фото профиля
    const [selectedFile, setSelectedFile] = useState(null)

    /* const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0])
    } */
    const [filePreviewUrl, setFilePreviewUrl] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);

        // Создаем URL для предварительного просмотра
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setFilePreviewUrl(previewUrl);
        }
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        setFilePreviewUrl(null);
    };

    const handleUpload = async () => {
        const token = getCookie('token');
        if (!selectedFile) {
            alert("Выберите файл для загрузки")
            return
        }

        const formData = new FormData()
        formData.append("file", selectedFile)
        //formData.append("userData", JSON.stringify(userData.UserId))

        try {
        const response = await fetch("/api/account-data/upload-user", {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        })
        } catch (error) {
        console.error("Ошибка при загрузке файла:", error)
        }
    }

    const inputFileRef = useRef(null)
    const handleEditPhotoClick = () => {
        inputFileRef.current.click()
    }

    // Изменение данных
    const [editName, setEditName] = useState(userData && userData.UserName)
    const [editPhone, setEditPhone] = useState(userData && userData.UserPhone.toString().substring(1))
    const [editEmail, setEditEmail] = useState(userData && userData.UserEmail)

    const [togglerChangingPopup, setTogglerChangingPopup] = useState('')
    const [isSavingProfile, setIsSavingProfile] = useState(false)

    async function editInfoProfile(){
        if (isSavingProfile) return
        setIsSavingProfile(true)

        try {
            if (editEmail.trim().toLowerCase() !== userData.UserEmail.trim().toLowerCase()) {
                await sendEmail()
                return
            }

            const token = getCookie('token');
            const response = await fetch(`/api/account-data/edit-account-data`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    UserName: editName,
                    UserPhone: "8" + editPhone,
                })
            })
            if (response.status === 429) {
                const result = await response.json().catch(() => ({}))
                showPopup(result.message || 'Слишком много запросов. Попробуйте позже.')
                return
            }
            if (!response.ok) {
                const result = await response.json().catch(() => ({}))
                throw new Error(result.message || 'Не удалось обновить данные профиля')
            }
            setUserData({ ...userData, UserName: editName, UserPhone: Number("8" + editPhone) })
            setTogglerChangingPopup('popup-open')
        } catch (error) {
            showPopup(error.message)
        } finally {
            setIsSavingProfile(false)
        }
    }
    // Проверка введенного Email
    const [togglerPopup, setTogglerPopup] = useState('') // Открытие popup с ошибкой ввода Email
    const [inputPasswordCode, setInputPasswordCode] = useState('')
    const [errorConfirmEmail, setErrorConfirmEmail] = useState('')
    const [togglerSendEmail, setTogglerSendEmail] = useState('') // Открытие popup С кодом
    const [togglerPopupInvalidEmail, setTogglerPopupInvalidEmail] = useState('')
    const [togglerPhoneNumberErrorPopup, setTogglerPhoneNumberErrorPopup] = useState('')

    async function sendEmail() {
        const token = getCookie('token')
        const normalizedEmail = editEmail.trim().toLowerCase()
        if (!/\S+@\S+\.\S+/.test(normalizedEmail)) {
            showPopup('Введите корректный email')
            return
        }

        try {
            const response = await fetch('/api/send-message?type=send-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ authType: 'email-change', userEmail: normalizedEmail }),
            })

            if (response.status === 409) {
                setTogglerPopupInvalidEmail('popup-open')
                return
            }
            if (!response.ok) {
                const error = await response.json().catch(() => ({}))
                throw new Error(error.message || 'Не удалось отправить код')
            }

            setInputPasswordCode('')
            setErrorConfirmEmail('')
            setTogglerSendEmail('popup-open')
        } catch (error) {
            showPopup(error.message)
        }
    }

    async function confirmEmailChange() {
        const token = getCookie('token')
        setErrorConfirmEmail('')
        try {
            const response = await fetch('/api/send-message?type=verify-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    authType: 'email-change',
                    userEmail: editEmail.trim().toLowerCase(),
                    code: inputPasswordCode,
                    userName: editName,
                    userPhone: "8" + editPhone,
                }),
            })
            const result = await response.json()

            if (response.status === 409) {
                setTogglerSendEmail('')
                setTogglerPopupInvalidEmail('popup-open')
                return
            }
            if (response.status === 401) {
                setErrorConfirmEmail('Неверный или истекший код')
                return
            }
            if (!response.ok) throw new Error(result.message || 'Не удалось изменить email')

            setCookie('token', result.token, 7)
            setEditEmail(result.email)
            setInputPasswordCode('')
            setTogglerSendEmail('')
            setUserData({
                ...userData,
                UserName: editName,
                UserPhone: Number("8" + editPhone),
                UserEmail: result.email,
            })
            setTogglerChangingPopup('popup-open')
        } catch (error) {
            showPopup(error.message)
        }
    }

    if (loadingStatus) {
        return(
        <>
            <div className={`popup-background popup-open`}></div>
            <div className={`popup popup-input-error popup-open`}>
                <h3 className='popup-input-error__text'>Загрузка</h3>
            </div>
            <div className={`popup-background popup-open`}></div>
        </>)
    }
    return(
        <>
            <div className='edit-account-page'>
                <div className='container'>
                    <div className='edit-account-page_wrapper'>
                        <PagesHeader ReturnBtn="../my-account" PageHeader="Редактирование"/>
                        <div className='loader-block'>
                            <input type="file" accept="image/jpeg, image/png" ref={inputFileRef} onChange={handleFileChange} />
                        </div>
                        <div className='edit-block'>
                            {/* <div style={{backgroundImage: `url(${userData && userData.UserImage == null ? '/ico/man-user.svg' : userData.UserImage})`}} className='user-photo'>
                                <div className='edit-photo'>
                                    <Image src={cameraIco} className='edit-photo_ico' onClick={handleEditPhotoClick}></Image>
                                </div>
                            </div> */}
                            <Avatar className='user-photo w-3/4 h-auto'>
                                <AvatarImage  className='object-cover' src={userData && `/${userData.UserImage}` || filePreviewUrl} />
                                <AvatarFallback className='aspect-square text-7xl'>{userData && userData.UserName.slice(0,1)}</AvatarFallback>
                            </Avatar>
                            <h3 className='underline decoration-solid' onClick={handleEditPhotoClick}>Изменить фото</h3>
                            {selectedFile && (<button className={`Button upload-btn`} onClick={handleUpload}>Загрузить фото</button>)}
                            <input className='input-field' value={editName} onChange={(e)=>{setEditName(e.target.value)}}/>
                            <div className='input-field_phone'>
                                <input className='input-field_phone__mask' value={editPhone} 
                                    onChange={(e)=>{let inputValue = e.target.value
                                    if ( inputValue.startsWith("8") ||
                                        inputValue.startsWith("7") ||
                                        inputValue.startsWith("+")
                                        ){
                                        inputValue = inputValue.substring(1)
                                    }
                                    setEditPhone(inputValue)}}/>
                            </div>
                            <input className='input-field' value={editEmail} onChange={(e)=>{setEditEmail(e.target.value)}}/>
                        </div>
                        {/* <div className='Button' onClick={()=>{
                            editEmail !== '' ? 
                            (editEmail === userData.UserEmail ? setTogglerPopupInvalidEmail('popup-open') : sendEmail()) :
                            editPhone.length < 10 ? setTogglerPhoneNumberErrorPopup('popup-open') : editInfoProfile()}}>Сохранить</div> */}
                        <div className={`Button ${isSavingProfile ? 'disabled' : ''}`} onClick={editInfoProfile}>Сохранить</div>
                    </div>
                </div>
            </div>
            <Toaster visibleToasts={1}/>
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
                <div className={`popup-background ${togglerPhoneNumberErrorPopup}`}></div>
                <div className={`popup popup-input-error ${togglerPhoneNumberErrorPopup}`}>
                    <h3 className='popup-input-error__text'>Проверьте правильность введенного номера</h3>
                    <div className='Button PopupButton' onClick={()=>{setTogglerPhoneNumberErrorPopup('')}}>Закрыть</div>
                </div>
            </>
            <EmailCodePopup
                isOpen={togglerSendEmail === 'popup-open'}
                email={editEmail}
                value={inputPasswordCode}
                onChange={setInputPasswordCode}
                errorMessage={errorConfirmEmail}
                onClose={() => setTogglerSendEmail('')}
                onConfirm={confirmEmailChange}
                confirmLabel="Подтвердить email"
                length={6}
            />
        </>
    )
}