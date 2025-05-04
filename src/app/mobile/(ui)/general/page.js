'use client'
import { useEffect, useRef, useState } from 'react'
import NavMap2 from '../../components/NavMap/NavMap2'
import NavMap from '../../components/NavMap/NavMap'
import BurgerMenu from '../../components/ui/BurgerMenu/BurgerMenu'
import './style.sass'
import { subscribeUser, unsubscribeUser, sendNotification } from '../../components/actions'


export default function GeneralPage(){
    
    
    return(
        <> 
            <BurgerMenu/>
            <NavMap/>
        </>
    )
}