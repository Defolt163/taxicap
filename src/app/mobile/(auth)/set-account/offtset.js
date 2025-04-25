'use client'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import './style.sass'
import { useRouter } from 'next/navigation'
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

    useEffect(()=>{
        console.log("Color:", vehicleColor)
    }, [vehicleColor])

    // Получение sessionId из кук
    const [sessionKey, setSessionKey] = useState('')
    async function myHandler() {
        const cookieValue = Cookies.get('UserData') // Замените cookieName на имя необходимой вам cookie
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
        setStep(step + 1)
    }

    const handlePrevStep = () => {
        setStep(step - 1)
    }

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
            )
        case 2:
            return (
            <>
                <div className="GetStartedPageBlock">
                    <h1 className="GetStartedPageHeader">Ваш номер телефона</h1>
                    <h3>Это позволит {accountType !== 1 ? 'водителю' : 'пассажиру'}, в случае необходимости, связаться с вами</h3>
                    <form className="GetStartedForm GetStartedForm-phone" id="tel">
                        <input
                        className='GetStartedForm-phone_input'
                        type="number"
                        required
                        value={phoneNumber}
                        onChange={(e) =>{let inputValue = e.target.value
                            if (inputValue.startsWith("8") || inputValue.startsWith("7") || inputValue.startsWith("+")) {
                                inputValue = inputValue.substring(1)
                            }
                            inputValue = inputValue.replace(/\D/g, "")
                            setPhoneNumber(inputValue)
                        }}
                        onClick={()=>{setInsertNumber("")}}
                        />
                        <div className='InputError'>{insertNumber}</div>
                    </form>
                </div>
                <div className='FormButtonBlock'>
                    <div onClick={handlePrevStep} className="Button GetStartedBtn">
                    Назад
                    </div>
                    <div onClick={()=>{phoneNumber.length < 10 ? setInsertNumber("Введите номер телефона") : accountType === 1 ? handleNextStep() : updateSessionId()}} className="Button GetStartedBtn">
                    Продолжить
                    </div>
                </div>
            </>
            )
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
                                <option value="Черный">Черный</option>
                                <option value="Серый">Серый</option>
                                <option value="Серебристый">Серебристый</option>
                                <option value="Белый">Белый</option>
                                <option value="Зеленый">Зеленый</option>
                                <option value="Синий">Синий</option>
                                <option value="Красный">Красный</option>
                                <option value="Коричневый">Коричневый</option>
                                <option value="Желтый">Желтый</option>
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
        )
    }}

    return(
        <div className="SetAccount">
            {renderStepContent()}
        </div>
    )
}