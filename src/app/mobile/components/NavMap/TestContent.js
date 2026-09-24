import dynamic from 'next/dynamic';
import ControlPassengerPanel from './ControlPanelPassenger';
import { useState } from 'react';
import { useData } from '../DataContext';
import ControlDriverPanel from './ControlPanelDriver';
import { Spinner } from '@/components/ui/spinner';

const MapComponent = dynamic(() => import('./Map'), {
  ssr: false,  // <-- КЛЮЧЕВОЙ МОМЕНТ: отключаем серверный рендеринг
  loading: () => <div style={{ height: 'calc(100dvh - 330px)', width: '100%', display: 'flex', justifyContent: "center", alignItems: "center" }}>Загрузка карты...</div>
});

export default function NavMapTest(){
    const { userData, loadingStatus, setUserData } = useData()
    const [coordinates, setCoordinates] = useState(null);
    const [driverPosition, setDriverPosition] = useState([])
    //console.log("C", coordinates)

    const handleLocationSelect = (routeCoordinates) => {
        setCoordinates(routeCoordinates.routeCoordinates);
    };
    const handleDriverPosition = (position) => {
        setDriverPosition(position);
        console.log("position", position)
    };

    return(
        <>
            <MapComponent driverPosition={driverPosition} coordinates={coordinates}/>
            {!userData ? <div className='flex w-[100%] h-[330px] items-center flex-col content-center'><Spinner/> <br/> <h3>Синхронизация</h3> </div> : userData.DriverMode == 0 ? 
            <ControlPassengerPanel onDriverPosition={handleDriverPosition} onLocationSelect={handleLocationSelect}/> :
            <ControlDriverPanel onLocationSelect={handleLocationSelect}/>
            }
            
        </>
    )
}