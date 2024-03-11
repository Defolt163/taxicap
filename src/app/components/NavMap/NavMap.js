'use client'
import { useEffect, useRef } from 'react';
import tt from "@tomtom-international/web-sdk-maps"
import { services } from '@tomtom-international/web-sdk-services';

export default function NavMap(){
    const mapElementRef = useRef(null);
  const mapInstanceRef = useRef(null)

  useEffect(() => {
    const map = tt.map({
      key: 'NALS3ZASME74GuNHgT2zsJbTCgsmCA9m',
      container: mapElementRef.current,
      center: [51.466315, 54.433658],
      zoom: 15
    });
    map.setLanguage('ru-RU');
    mapInstanceRef.current = map;

    const startPoint = [51.466315, 54.433658];
    const endPoint = [51.474481, 54.425374];

    // Определите параметры запроса
    const routingOptions = {
      key: 'NALS3ZASME74GuNHgT2zsJbTCgsmCA9m',
      locations: `${startPoint[0]},${startPoint[1]}:${endPoint[0]},${endPoint[1]}`,
      computeBestOrder: false,
    };

    // Выполните запрос на построение маршрута
    services
      .calculateRoute(routingOptions)
      .then((response) => {
        // Обработка полученного маршрута
        const route = response.routes[0];
        console.log(route.summary);  // Общая информация о маршруте
        console.log(route.legs);  // Сегменты маршрута (отрезки между точками

      })
      .catch((error) => {
        // Обработка ошибок
        console.error(error);
      });

    return () => {
      map.remove();
    };
  }, []);
    return (
        <div ref={mapElementRef} style={{ width: '100%', height: '100vh' }} />
        
    );
  };
  