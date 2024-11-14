'use client'
import { useEffect, useState } from 'react'
import './style.sass'
import Link from 'next/link'
export default function EatRestaurants(){
    const [restaurants, setRestaurants] = useState([])
    useEffect(()=>{
        fetch('http://localhost:3000/api/swift-eat/restaurants')
        .then((result) =>{
            return result.json()
        }).then((res)=>{
            setRestaurants(res)
        }).catch(()=>{
            console.error("Error")
        })
    },[])
    return(
        <div className='eat-list-restaurants'>
            <div className='eat-block_header'>Рестораны</div>
            <div className='eat-list-restaurants_block'>
            {restaurants.map((restaurant)=>(
                <Link href={'/eat/user-side/restaurant1'} key={restaurant.RestaurantId} className='eat-list-restaurant' >
                    <div className='restaurant_logo' style={{background: `url(${restaurant.RestaurantLogo}) center center/cover no-repeat`}}></div>
                    <div className='restaurant_descr'>
                        <h2 className='restaurant_name'>{restaurant.RestaurantName}</h2>
                        <h3 className='restaurant_address'>{restaurant.RestaurantAddress}</h3>
                        <div className='restaurant_time-block'>
                            <h5 className='restaurant_time'>{restaurant.TimeUp}</h5><span>-</span>
                            <h5 className='restaurant_time'>{restaurant.TimeOut}</h5>
                        </div>
                    </div>
                </Link>
            ))}
            </div>
        </div>
    )
}