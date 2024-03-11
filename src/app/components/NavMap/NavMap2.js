'use client'
import { useEffect, useRef, useState } from 'react';
import ReactMapGL, { Source, Layer, Map, Marker } from "react-map-gl"
import 'maplibre-gl/dist/maplibre-gl.css';
import './style.sass'
import carIco from '/public/ico/car.png'
import cashIco from '/public/ico/cash-ico.svg'
import SearchCarIco from '/public/image/carAndMap.svg'
import userIco from '/public/ico/man-user.svg'
import Image from 'next/image';
import Link from 'next/link';

export default function NavMap2(){
  const {MAP_API_KEY} = process.env
  const [addressFrom, setAddressFrom] = useState("")
  const [addressTo, setAddress] = useState("")

    //Открытие - Закрытие Окна выбора тарифа
    const [togglerPriceBlock, setTogglerPriceBlock] = useState("")
    
  const encodedAddressFrom = encodeURIComponent(addressFrom)
  const encodedAddressTo = encodeURIComponent(addressTo)


  // Получение адреса
  const [addressToCoordinate, setAddressToCoordinate] = useState([54.4374232,51.4637213])
  const [addressFromCoordinate, setAddressFromCoordinate] = useState([54.4374232,51.4637213])

  //Убрать коммент
  /* async function getAddress(){
    if(addressTo !== ""){
      await fetch(`https://api.geoapify.com/v1/geocode/search?text=${encodedAddressFrom}&filter=rect:51.25456616016618,54.330347902222314,51.629709692889264,54.5140980931572&format=json&apiKey=3f92ee1c9c6946c59edce5b1227a9078`)
      .then(response => response.json())
      .then((result)=>{
        setAddressToCoordinate([result.results[0].lat,result.results[0].lon])
        console.log(`To: ${result.results[0].lat, result.results[0].lon}`)
      })
      .catch(error => console.log('Ошибка получения адреса', error));
    }if(addressFrom !== ""){
      await fetch(`https://api.geoapify.com/v1/geocode/search?text=${encodedAddressTo}&filter=rect:51.25456616016618,54.330347902222314,51.629709692889264,54.5140980931572&format=json&apiKey=3f92ee1c9c6946c59edce5b1227a9078`)
      .then(response => response.json())
      .then((result)=>{
        setAddressFromCoordinate([result.results[0].lat,result.results[0].lon])
        console.log(`From: ${result.results[0].lat,result.results[0].lon}`)
      })
      .catch(error => console.log('Ошибка получения адреса', error));
    }
    if(addressTo === ""){

    }
    handleNextStep()
  } */
  
  // Построение маршрута
  const [geoRes, setGeoRes] = useState([])
  const [geoJSONRoute, setGeoJSONRoute] = useState([])
  const [routePrice, setRoutePrice] = useState(0)
  //убрать коммент
  /* function requestOptions(){
    fetch(`https://api.geoapify.com/v1/routing?waypoints=${addressFromCoordinate}|${addressToCoordinate}&mode=drive&apiKey=3f92ee1c9c6946c59edce5b1227a9078`)
    .then(response => response.json())
    .then((routeResult) =>{
        setGeoRes(routeResult.features[0].geometry.coordinates[0])
        setRoutePrice(routeResult.features[0].properties.distance * 0.045)
        console.log(routeResult)
    })
    .catch(error => console.log('Ошибка установки маршрута', error));
  };
  
  useEffect(()=>{
      requestOptions()
  },[addressToCoordinate, addressFromCoordinate])
  useEffect(()=>{
      function createGeoJSON(coordinates) {
          return {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: coordinates[0]
            }
          };
      }
      setGeoJSONRoute(createGeoJSON([geoRes]))
  }, [geoRes]) */
    
  const layerStyle = {
      id:"route",
        type:"line",
        paint:{
          'line-color': '#2196F3',
          'line-width': 5,
        }
  };
  ///////////////////////////////
  // Маркер пользователя Не готово
  const userPosition = {
    type: 'FeatureCollection',
    features: [
      { type: 'Feature', geometry: { type: 'Point', coordinates: [51.4637213,54.4374232] } }
    ]
  };
  const markerUserStyle = {
    id: 'point',
    type: 'symbol',
    'layout': {
      'icon-image': 'https://api.geoapify.com/v1/icon/?type=material&color=red&icon=cloud&iconType=awesome&apiKey=3f92ee1c9c6946c59edce5b1227a9078',
      'icon-anchor': 'bottom',
      'icon-offset': [0, 5],
      'icon-allow-overlap': true
    }
  };

  //Шаги оформления заказа
  const [step, setStep] = useState(0)
  function handleNextStep(){
    setStep(step + 1);
  };

  function handlePrevStep(){
      setStep(step - 1);
  };

  const renderStepClient = () => {
    switch (step) {
      case 0:
        return(
          <>
            <div className={`AddressInputBlock`}>
                <h3 className='PopupHeader PopupAddressHeader'>Куда едем?</h3>
                <div className='AddressInputBlockItem'>
                    <label className='AddressInputLabel' htmlFor="input-from"><i className="fa-solid AddressInputIco fa-angles-down"></i></label>
                    <input className='InputUiMap' placeholder='Текущий адрес' id='input-from' value={addressFrom} onChange={(e)=>setAddressFrom(e.target.value)}/>
                </div>
                <div className='AddressInputBlockItem AddressFuckedInputBlockItem'>
                    <label className='AddressInputLabel' htmlFor="input-to"><i className="fa-solid AddressInputIco fa-shop"></i></label>
                    <input className='InputUiMap' placeholder='Куда поедете?' id='input-to' value={addressTo} onChange={(e)=>setAddress(e.target.value)}/>
                </div>
                <div className='Button' onClick={()=>{addressFrom === "" || addressTo === "" ? setTogglerPopup('popup-open') : getAddress()}}>Поиск</div>
              </div>
          </>
        )
      case 1:
        return(
          <>
            <div className={`AddressInputBlock CarVariant`}>
                <div className='AddressInputBlockReturn' onClick={()=>{handlePrevStep()}}>
                  <i className="fa-solid fa-chevron-left"></i>
                </div>
                <h3 className='PopupHeader PopupAddressHeader'>Можем предложить...</h3>
                <div className='CarVariantBlock'>
                  <div className='CarVariantBlockItem'>
                    <div className='CarVariantBlockItemWrapper'>
                      <Image src={carIco} alt='car'/>
                      <div className='CarVariantBlockItemDescr'>
                        <div className='CarVariantBlockItemHeader'>Эконом</div>
                        <div className='CarVariantBlockItemPlaces'>3 Места</div>
                      </div>
                    </div>
                    <div className='CarVariantBlockItemPrice'>{Math.round(routePrice)}₽</div>
                  </div>
                  <div className='PaymentMethod'>
                    <h4>Способ оплаты</h4>
                    <div className='PaymentMethodItem'>
                      <div className='PaymentMethodItemIcoWrapper'>
                        <Image className='PaymentMethodItemIco' src={cashIco}/>
                      </div>
                      <div className='PaymentMethodItemText'>Наличные</div>
                    </div>
                  </div>
                  <div className='Button' onClick={()=>{handleNextStep()}}>Подтвердить</div>
                </div>
              </div>
          </>
        )
      case 2:
        return(
          <>
            <div className={`AddressInputBlock SearchCar`}>
              <Image src={SearchCarIco} className='SearchCarIco' alt="Car And Map"/>
              <div className='SearchCarDetail'>
                <div className='SearchCarDetailLoading'></div>
                <div className='SearchCarDetailDescr'>Пожалуйста, подождите! Мы ищем ближайшего водителя</div>
              </div>
              <div className='Button' onClick={()=>{handlePrevStep()}}>Отменить</div>
            </div>
          </>
        )
      case 3:
        return(
          <>
            <div className='AddressInputBlock DriveActive'>
              <h3 className='ItemsHeader ItemsHeader__center'>Водитель прибудет через <br/> 5 минут</h3>
              <div className='AccountBlock'>
                <Image className='AccountIco' src={userIco} alt="user ico"/>
                <div className='AccountBlockInfo'>
                  <h4 className='AccountName'>Павел</h4>
                  <div className='CarInfo'>
                    <div className='CarModel'>Синий LADA 2114 <br/> <strong>Н323НВ163</strong></div>
                  </div>
                </div>
                <Link href='tel:123' className='CallUser'><i className="fa-solid fa-phone"></i></Link>
              </div>
              <div className='AddressOrderBlock'>
                <div className='AddressOrderItem'>
                  <i className="fa-solid AddressInputIco fa-angles-down"></i>
                  <div className='AddressOrderText'>Шентала, Мичурина 23</div>
                </div>
                <div className='AddressOrderItem'>
                  <i class="fa-solid AddressInputIco fa-check"></i>
                  <div className='AddressOrderText'>Шентала, Победы 7</div>
                </div>
              </div>
              <div className='Payment'>
                <div className='PaymentItem'>
                  <div className='PaymentHeader'>Способ оплаты:</div>
                  <h4 className='PaymentInfo'>Наличные</h4>
                </div>
                <div className='PaymentItem'>
                  <div className='PaymentHeader'>Стоимость:</div>
                  <h4 className='PaymentInfo'>{Math.round(routePrice)}</h4>
                </div>
              </div>
            </div>
          </>
        )
    }}
    const renderStepDriver = () => {
      switch (step) {
        case 0:
          return(
            <>
              <div className='OrderWrapper'>
                <div className='AccountBlock'>
                  <Image className='AccountIco' src={userIco} alt="user ico"/>
                  <div className='AccountBlockInfo'>
                    <h4 className='AccountName'>Павел</h4>
                    <div className='OrderInfoBlock'>
                      <div className='OrderInfo'>Дистанция: 2км</div>
                    </div>
                  </div>
                  <Link href='tel:123' className='CallUser'><i className="fa-solid fa-phone"></i></Link>
                </div>
                <div className='OrderAddress'>
                  <div className='OrderAddressItem'>
                    <h3 className='AddressHeader'>От</h3>
                    <div className='Address'>Шентала, Мичурина 23</div>
                  </div>
                  <div className='OrderAddressItem'>
                    <h3 className='AddressHeader'>До</h3>
                    <div className='Address'>Шентала, Победы 7</div>
                  </div>
                </div>
                <div className='OrderActions'>
                  <div className='OrderAction'>
                    <i className="fa-solid fa-xmark"></i>
                  </div>
                  <div className='OrderAction'>
                    <i className="fa-solid fa-check"></i>
                  </div>
                </div>
                <div className='Button'>Завершить поездку</div>
              </div>
            </>
          )
      }}

  // Сообщения об ошибках не введенных инпутов
  const [togglerPopup, setTogglerPopup] = useState("")
  return (
      <div className="Map">
          <div className={`MapUi ${togglerPriceBlock}`}>
            {renderStepClient()}
          </div>
          <Map
              className="MapWrapper"
              initialViewState={{
                  longitude: 51.466315,
                  latitude: 54.433658,
                  zoom: 13
              }}
              style={{width: '100vw', height: '100vh'}}
              mapStyle="https://maps.geoapify.com/v1/styles/osm-bright/style.json?apiKey=3f92ee1c9c6946c59edce5b1227a9078"
          >
            {/* <Source id="user-marker" type="geojson" data={userPosition}><Layer {...markerUserStyle} /></Source> */}
              <Source id="my-data" type="geojson" data={geoJSONRoute}>
                <Layer {...layerStyle} />
              </Source>
          </Map>
          <div className={`popup popup-input-error ${togglerPopup}`}>
            <h3 className='popup-input-error__text'>{
                addressFrom === "" && addressTo === "" ? 'Откуда и Куда вы направляетесь?' :
                addressFrom === "" ? "Откуда вы направляетесь?" : 
                addressTo === "" ? 'Куда вы направляетесь?' : "Ошибка"
              }</h3>
            <div className='Button PopupButton' onClick={()=>{setTogglerPopup('')}}>Закрыть</div>
          </div>
          <div className={`popup-background ${togglerPopup}`}></div>
      </div>
    );
  };
  