'use client'
import Image from 'next/image'
import React, { useEffect, useState } from 'react';
import './style.sass'
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie'

export default function SetAccount(){
    const router = useRouter()
    const [step, setStep] = useState(0)
    const [accountType, setAccountType] = useState(0)
    const [phoneNumber, setPhoneNumber] = useState('')
    const [vehicleBrand, setVehicleBrand] = useState("")
    const [vehicleModel, setVehicleModel] = useState("")
    const [vehicleColor, setVehicleColor] = useState("")
    const [vehicleId, setVehicleId] = useState("")
    const [insertNumber, setInsertNumber] = useState("")

    // Получение sessionId из кук
    const [sessionKey, setSessionKey] = useState('')
    async function myHandler() {
        const cookieValue = Cookies.get('UserData'); // Замените cookieName на имя необходимой вам cookie
        const userData = JSON.parse(cookieValue)
        setSessionKey(userData.session_key)
      }
    useEffect(()=>{
        myHandler()
    }, [])
    
    // Добавление номера и статуса аккаунта через SessionId пользователя из бд
    async function updateSessionId(){
        await fetch(`/api/account-data/set-account?UserSessionId=${sessionKey}`,{
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                "UserSessionId": sessionKey,
                "UserPhone": phoneNumber,
                "DriverMode": accountType,
                "VehicleBrand": vehicleBrand,
                "VehicleModel": vehicleModel,
                "VehicleColor": vehicleColor,
                "VehicleNumber": vehicleId
            }),
        }).then(()=>{
            console.log("Saved!")
            router.push('/mobile/general')
        })
        .catch(error =>{
            console.log(error)
        })
    }

    function handleNextStep(){
        setStep(step + 1);
    };

    const handlePrevStep = () => {
        setStep(step - 1);
    };

    const renderStepContent = () => {
        switch (step) {
            case 0:
            return (
                <>
                <div className="GetStartedPageBlock">
                    <h1>Давайте настроим ваш аккаунт!</h1>
                </div>
                <div onClick={()=>{handleNextStep()}} className="Button GetStartedBtn">
                    Начать!
                </div>
                </>
            )
        case 1:
            return (
            <>
                <div className="GetStartedPageBlock">
                    <h1 className="GetStartedPageHeader">Я...</h1>
                    <form className="GetStartedForm">
                        <div className='GetStartedFormItem'>
                            <input
                            name="account-type"
                            id="driver"
                            type="radio"
                            onChange={() => setAccountType(1)}
                            />
                            <label htmlFor="driver">Водитель</label>
                        </div>
                        <div className='GetStartedFormItem'>
                            <input
                            name="account-type"
                            id="passenger"
                            type="radio"
                            onChange={() => setAccountType(0)}
                            />
                            <label htmlFor="passenger">Пассажир</label>
                        </div>
                    </form>
                </div>
                <div onClick={()=>{handleNextStep()}} className="Button GetStartedBtn">
                Продолжить
                </div>
            </>
            );
        case 2:
            return (
            <>
                <div className="GetStartedPageBlock">
                    <h1 className="GetStartedPageHeader">Ваш номер телефона</h1>
                    <h3>Это позволит {accountType !== 1 ? 'водителю' : 'пассажиру'}, в случае необходимости, связаться с вами</h3>
                    <form className="GetStartedForm" id="tel">
                        <input
                        type="number"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        onClick={()=>{setInsertNumber("")}}
                        />
                        <div className='InputError'>{insertNumber}</div>
                    </form>
                </div>
                <div className='FormButtonBlock'>
                    <div onClick={handlePrevStep} className="Button GetStartedBtn">
                    Назад
                    </div>
                    <div onClick={()=>{phoneNumber === '' ? setInsertNumber("Введите номер телефона") : accountType === 1 ? handleNextStep() : updateSessionId()}} className="Button GetStartedBtn">
                    Продолжить
                    </div>
                </div>
            </>
            );
        case 3:
            return (
            <>
                <div className="GetStartedPageBlock">
                    <h1 className="GetStartedPageHeader">Введите данные вашего автомобиля</h1>
                    <h3>Это позволит пассажиру скорее найти ваш автомобиль</h3>
                    <form action={()=>{updateSessionId()}} className="GetStartedForm" id="vehicle">
                        <div className='GetStartedFormItem VehicleParams'>
                            <label htmlFor="vehicle-brand">Марка:</label>
                            <input
                            id="vehicle-brand"
                            type="text"
                            required
                            value={vehicleBrand}
                            onChange={(e) => setVehicleBrand(e.target.value)}
                            />
                        </div>
                        <div className='GetStartedFormItem VehicleParams'>
                            <label htmlFor="vehicle-model">Модель:</label>
                            <input
                            id="vehicle-model"
                            type="text"
                            required
                            value={vehicleModel}
                            onChange={(e) => setVehicleModel(e.target.value)}
                            />
                        </div>
                        <div className='GetStartedFormItem VehicleParams'>
                            <label htmlFor="vehicle-color">Цвет:</label>
                            <select
                                id="vehicle-color"
                                type="text"
                                required
                                value={vehicleColor}
                                onChange={(e) => setVehicleColor(e.target.value)}
                            >
                                <option value="Black">Черный</option>
                                <option value="Gray">Серый</option>
                                <option value="Silver">Серебряный</option>
                                <option value="White">Белый</option>
                                <option value="Green">Зеленый</option>
                                <option value="Blue">Синий</option>
                                <option value="Red">Красный</option>
                                <option value="Brown">Коричневый</option>
                                <option value="Yellow">Желтый</option>
                            </select>
                        </div>
                        <div className='GetStartedFormItem VehicleParams'>
                            <label htmlFor="vehicle-id">Гос номер:</label>
                            <input
                            id="vehicle-id"
                            type="text"
                            required
                            value={vehicleId}
                            onChange={(e) => setVehicleId(e.target.value)}
                            />
                        </div>
                    </form>
                </div>
                <div className='FormButtonBlock'>
                    <div onClick={handlePrevStep} className="Button GetStartedBtn">
                        Назад
                    </div>
                    <button type='submit' form="vehicle" className="Button GetStartedBtn">
                        Начать!
                    </button>
                </div>
            </>
        );
    }}

    return(
        <div className="SetAccount">
            {renderStepContent()}
        </div>
    )
}