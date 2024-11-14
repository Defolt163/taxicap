'use client'
import { useEffect, useState } from 'react'
import './style.sass'
export default function RestaurantInfo(){
    const[restaurant, setRestaurant] = useState([])
    useEffect(()=>{
        fetch("/api/swift-eat/restaurants")
        .then((result)=>{
            return result.json()
        }).then((res)=>{
            setRestaurant(res[0])
        })
    },[])
    return(
        <div className='restaurant-info' style={{background: `url(${restaurant.RestaurantLogo}) center center/cover no-repeat`}}>
            <div className='restaurant-info_text'>
                <div className='restaurant-info_name'>{restaurant.RestaurantName}</div>
                <div className='restaurant-info_address'>{restaurant.RestaurantAddress}</div>
                <div className='restaurant-info_time'>{restaurant.TimeUp}-{restaurant.TimeOut}</div>
            </div>
        </div>
    )
}