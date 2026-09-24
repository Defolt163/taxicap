'use client'

import { MapContainer, TileLayer, Marker, Popup, Polyline, Rectangle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef, useState } from 'react';

let mapInstanceId = 0;

const latUp = parseFloat(process.env.NEXT_PUBLIC_LAT_UP);
const lonUp = parseFloat(process.env.NEXT_PUBLIC_LON_UP);
const latBottom = parseFloat(process.env.NEXT_PUBLIC_LAT_BOTTOM);
const lonBottom = parseFloat(process.env.NEXT_PUBLIC_LON_BOTTOM);
export default function Map({ coordinates, driverPosition }) {
  const [mapKey] = useState(() => `taxi-map-${++mapInstanceId}`);
  const mapRef = useRef(null);

  useEffect(() => {
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    // Исправление иконок Leaflet (если нужно)
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });
  }, []);

  const [markerPosFrom, setMarkerPosFrom] = useState(null)
  const markerIconFrom = new L.Icon({
    iconUrl: '/ico/start-mark.png',
    iconSize: [25, 25],
    iconAnchor: [12.5, 12.5],
  });
  const [markerPosTo, setMarkerPosTo] = useState(null)
  const markerIconTo = new L.Icon({
    iconUrl: '/ico/finish-mar.png',
    iconSize: [26, 28],
    iconAnchor: [12.5, 25],
  });
  const markerIconDriver = new L.Icon({
    iconUrl: '/ico/driver-car.png',
    iconSize: [19, 33],
    iconAnchor: [9.5, 16.5],
  });

    useEffect(() => {
      if (coordinates) {
        setMarkerPosFrom(coordinates[0])
        setMarkerPosTo(coordinates.at(-1))
      }else if(coordinates == null){
        setMarkerPosFrom([0,0])
        setMarkerPosTo([0,0])
      }
    }, [coordinates])

  return (
    <MapContainer
      key={mapKey}
      ref={mapRef}
      center={[54.434501, 51.467061]} 
      zoom={13.5} 
      style={{ height: '80dvh', width: '100%' }}
    >
      <TileLayer url="/api/tiles/{z}/{x}/{y}.png" />
        {coordinates !== null ? 
          <Polyline 
            positions={coordinates}
            pathOptions={{ color: '#2563eb', weight: 5, opacity: 1 }}
          /> : null
        }
        <Rectangle
          bounds={[
            [latUp, lonUp],
            [latBottom, lonBottom]
          ]}
          pathOptions={{
            color: 'green',
            weight: 3,
            opacity: 0.8,
            fillColor: 'green',
            fillOpacity: 0.05
          }}
        />
          
          {markerPosFrom !== null && markerPosTo !== null ? (
            <>
              <Marker position={markerPosFrom} icon={markerIconFrom}/>
              <Marker position={markerPosTo} icon={markerIconTo}/>
            </>
          ) : null}
          {driverPosition.length !== 0 ? (
            <>
              <Marker position={driverPosition} icon={markerIconDriver}/>
            </>
          ) : null}
          
          {/* Маркер назначения */}
          {/* {coordinates && coordinates.to.lat && coordinates.to.lon && (
            <Marker position={[parseFloat(coordinates.to.lat), parseFloat(coordinates.to.lon)]}>
              <Popup>
                <strong>Назначение</strong><br />
                Широта: {coordinates.to.lat}<br />
                Долгота: {coordinates.to.lon}
              </Popup>
            </Marker>
          )} */}

    </MapContainer>
  );
}