'use client'
import { useEffect, useRef, useState } from 'react'
import NavMap2 from '../../components/NavMap/NavMap2'
import BurgerMenu from '../../components/ui/BurgerMenu/BurgerMenu'
import './style.sass'
import { Helmet } from 'react-helmet'
export default function GeneralPage(){
    
    

    return(
        <>  
            <Helmet>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
            </Helmet>
            <BurgerMenu/>
            <NavMap2/>
        </>
    )
}