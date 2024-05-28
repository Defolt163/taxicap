'use client'
import { useEffect, useState } from "react"
import './style.sass'
import Cookies from 'js-cookie'
import PagesHeader from "../../../components/PagesHeader/PagesHeader"

export default function AddCarPage(){
    // Получение sessionId из кук
    const [sessionKey, setSessionKey] = useState('')
    useEffect(()=>{
        const cookieValue = Cookies.get('UserData'); // Замените cookieName на имя необходимой вам cookie
        const userData = JSON.parse(cookieValue)
        setSessionKey(userData.session_key)
    }, [])
    const [userData, setUserData] = useState([])
    useEffect(()=>{
        if(sessionKey !== ''){
            fetch(`http://localhost:3000/api/account-data/user-data?sessionId=${sessionKey}`,{
                method: 'GET'
            }).then((result)=>{
                console.log("OKAY")
                return result.json()
            }).then((res)=>{
                setUserData(res[0])
            })
            .catch(error =>{
                console.log(error)
            })
        }
    }, [sessionKey])

    const [vehicleBrand, setVehicleBrand] = useState("")
    const [vehicleModel, setVehicleModel] = useState("")
    const [vehicleColor, setVehicleColor] = useState("Black")
    const [vehicleId, setVehicleId] = useState("")
    const [togglerPopupChangeSuccess, setTogglerPopupChangeSuccess] = useState('')
    const [togglerPopupChangeError, setTogglerPopupChangeError] = useState('')

    function changeCar(){
        fetch(`/api/account-data/change-car?sessionId=${sessionKey}`,{
            method: "PUT",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "VehicleBrand": vehicleBrand,
                "VehicleModel": vehicleModel,
                "VehicleColor": vehicleColor,
                "VehicleNumber": vehicleId
            })
        }).then(()=>{
            setTogglerPopupChangeSuccess('popup-open')
        })
        .catch(() => {
            setTogglerPopupChangeError('popup-open')
        })
    }

    return(
        <>
            <div className="AddCarPage">
                <div className="container">
                    <PagesHeader ReturnBtn="/mobile/my-account" PageHeader={userData && userData.VehicleBrand === undefined ? "Добавить авто" : "Изменить авто"}/>
                    <div className="GetStartedPageBlock">
                        <form className="GetStartedForm" id="tel">
                            <div className='GetStartedFormItem VehicleParams'>
                                <label htmlFor="vehicle-brand">Марка:</label>
                                <input
                                id="vehicle-brand"
                                type="text"
                                required={userData && userData.VehicleBrand === undefined}
                                placeholder={userData && userData.VehicleBrand !== undefined ? userData.VehicleBrand : null}
                                value={vehicleBrand}
                                onChange={(e) => setVehicleBrand(e.target.value)}
                                />
                            </div>
                            <div className='GetStartedFormItem VehicleParams'>
                                <label htmlFor="vehicle-model">Модель:</label>
                                <input
                                id="vehicle-model"
                                type="text"
                                required={userData && userData.VehicleModel === undefined}
                                placeholder={userData && userData.VehicleModel !== undefined ? userData.VehicleModel : null}
                                value={vehicleModel}
                                onChange={(e) => setVehicleModel(e.target.value)}
                                />
                            </div>
                            <div className='GetStartedFormItem VehicleParams'>
                                <label htmlFor="vehicle-color">Цвет:</label>
                                <select
                                    id="vehicle-color"
                                    type="text"
                                    required={userData && userData.VehicleColor === undefined}
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
                                required={userData && userData.VehicleNumber === undefined}
                                placeholder={userData && userData.VehicleNumber !== undefined ? userData.VehicleNumber : null}
                                value={vehicleId}
                                onChange={(e) => setVehicleId(e.target.value)}
                                />
                            </div>
                            <div className="Button" onClick={()=>{changeCar()}}>Сохранить</div>
                        </form>
                    </div>
                </div>
            </div>
            {/* Попап суккес */}
            <div className={`popup-background ${togglerPopupChangeSuccess}`}></div>
            <div className={`popup popup-input-error ${togglerPopupChangeSuccess}`}>
                <h3 className='popup-input-error__text'>Изменения применены!</h3>
                <div className='Button PopupButton' onClick={()=>{setTogglerPopupChangeSuccess('')}}>Закрыть</div>
            </div>
            <div className={`popup-background ${togglerPopupChangeSuccess}`}></div>
            {/* Попап еррор */}
            <div className={`popup-background ${togglerPopupChangeError}`}></div>
            <div className={`popup popup-input-error ${togglerPopupChangeError}`}>
                <h3 className='popup-input-error__text'>Ошибка применения изменений</h3>
                <div className='Button PopupButton' onClick={()=>{setTogglerPopupChangeError('')}}>Закрыть</div>
            </div>
            <div className={`popup-background ${togglerPopupChangeError}`}></div>
        </>
    )
}