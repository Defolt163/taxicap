'use client'
import { useEffect, useState } from "react"
import './style.sass'
import Cookies from 'js-cookie'
import PagesHeader from "../../../../components/PagesHeader/PagesHeader"
import { useData } from '@/app/mobile/components/DataContext'

export default function AddCarPage(){
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null; // Если куки нет
    }
    const { userData, setUserData, loadingStatus } = useData()
    const [togglerPopupLoadingData, setTogglerPopupLoadingData] = useState('popup-open')
    useEffect(() => {
        if (!loadingStatus) {
          setTogglerPopupLoadingData('');
        }
      }, [loadingStatus])

    const [vehicleBrand, setVehicleBrand] = useState(userData && userData.VehicleBrand !== null ? userData.VehicleBrand : '')
    const [vehicleModel, setVehicleModel] = useState(userData && userData.VehicleModel !== null ? userData.VehicleModel : '')
    const [vehicleColor, setVehicleColor] = useState("Black")
    const [vehicleId, setVehicleId] = useState(userData && userData.VehicleNumber !== null ? userData.VehicleNumber : '')
    const [togglerPopupChangeSuccess, setTogglerPopupChangeSuccess] = useState('')
    const [togglerPopupChangeError, setTogglerPopupChangeError] = useState('')
    const [togglerPopupInputError, setTogglerPopupInputError] = useState('')

    async function changeCar(){
        const token = getCookie('token');
        const allFieldsValid = ([vehicleBrand, vehicleModel, vehicleColor, vehicleId]
            .every(field => field !== '' && field !== null))
        const allFieldDatabase =([userData.VehicleBrand, userData.VehicleModel, userData.VehicleColor, userData.VehicleId]
            .every(field => field !== '' && field !== null)
        )
        if(allFieldsValid || allFieldDatabase){
            try{
                setTogglerPopupLoadingData('popup-open')
                const response = await fetch('/api/account-data/change-car', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                    "VehicleBrand": vehicleBrand,
                    "VehicleModel": vehicleModel,
                    "VehicleColor": vehicleColor,
                    "VehicleNumber": vehicleId
                })
                })
                if(response.ok){
                    setTogglerPopupLoadingData('')
                    setTogglerPopupChangeSuccess('popup-open')
                }
                if(!response.ok){
                    setTogglerPopupLoadingData('')
                    setTogglerPopupChangeError('popup-open')
                }
            } catch (error){
                setTogglerPopupChangeError('popup-open')
            }
        }else{
            setTogglerPopupInputError('popup-open')
        }
    }

    return(
        <>
            <div className="AddCarPage">
                <div className="container">
                    <PagesHeader ReturnBtn="../my-account" PageHeader={userData && userData.VehicleBrand === null ? "Добавить авто" : "Изменить авто"}/>
                    <div className="GetStartedPageBlock">
                        <form className="GetStartedForm" id="tel">
                            <div className='GetStartedFormItem VehicleParams'>
                                <label htmlFor="vehicle-brand">Марка:</label>
                                <input
                                id="vehicle-brand"
                                type="text"
                                required={userData && userData.VehicleBrand === null}
                                value={vehicleBrand}
                                onChange={(e) => setVehicleBrand(e.target.value)}
                                />
                            </div>
                            <div className='GetStartedFormItem VehicleParams'>
                                <label htmlFor="vehicle-model">Модель:</label>
                                <input
                                id="vehicle-model"
                                type="text"
                                required={userData && userData.VehicleModel === null}
                                value={vehicleModel}
                                onChange={(e) => setVehicleModel(e.target.value)}
                                />
                            </div>
                            <div className='GetStartedFormItem VehicleParams'>
                                <label htmlFor="vehicle-color">Цвет:</label>
                                <select
                                    id="vehicle-color"
                                    type="text"
                                    required={userData && userData.VehicleColor === null}
                                    value={vehicleColor}
                                    onChange={(e) => setVehicleColor(e.target.value)}
                                >
                                    <option value="Черный">Черный</option>
                                    <option value="Серый">Серый</option>
                                    <option value="Серебряный">Серебряный</option>
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
                                required={userData && userData.VehicleNumber === null}
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
            {/* Попап пустых инпутов */}
            <div className={`popup-background ${togglerPopupInputError}`}></div>
            <div className={`popup popup-input-error ${togglerPopupInputError}`}>
                <h3 className='popup-input-error__text'>Проверьте правильность данных</h3>
                <div className='Button PopupButton' onClick={()=>{setTogglerPopupInputError('')}}>Закрыть</div>
            </div>
            <div className={`popup-background ${togglerPopupInputError}`}></div>
            <>
                <div className={`popup-background ${togglerPopupLoadingData}`}></div>
                <div className={`popup popup-input-error ${togglerPopupLoadingData}`}>
                    <h3 className='popup-input-error__text'>Загрузка</h3>
                </div>
                <div className={`popup-background ${togglerPopupLoadingData}`}></div>
            </>
        </>
    )
}