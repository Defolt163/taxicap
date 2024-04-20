'use client'
import { useState } from "react"

export default function AddCarPage(){
    const [vehicleBrand, setVehicleBrand] = useState("")
    const [vehicleModel, setVehicleModel] = useState("")
    const [vehicleColor, setVehicleColor] = useState("")
    const [vehicleId, setVehicleId] = useState("")
    const [insertNumber, setInsertNumber] = useState("")
    return(
        <div className="AddCarPage">
            <div className="container">
                <h2>Добавить автомобиль</h2>
                <div className="GetStartedPageBlock">
                    <form className="GetStartedForm" id="tel">
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
            </div>
        </div>
    )
}