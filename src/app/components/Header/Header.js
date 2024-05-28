'use client'
import Image from "next/image";
import Link from "next/link";
import Logo from '/public/logo/swift-logo.svg'
import './style.sass'
import { useState } from "react";

export default function HeaderPageComponent(props){
    const [togglerSidebar, setTogglerSidebar] = useState('')
    return(
        <div className={`header ${togglerSidebar}`}>
            <div className="header_wrapper">
                <Link href='/' className="header_logo"><Image src={Logo} alt="Swift Logo"/></Link>
                <ul className={`header_link_block ${togglerSidebar}`}>
                    <li className="header_link__wrapper"><Link href={props.FirstLink} className="header_link">{props.FirstLabel}</Link></li>
                    <li className="header_link__wrapper"><Link href='/privacy-policy' className="header_link">Условия использования</Link></li>
                    <li className="header_link__wrapper"><Link href='/mobile' className="header_link">Приложение</Link></li>
                    <div className="devices-btn" onClick={()=>{togglerSidebar === '' ? setTogglerSidebar('sidebar-open') : setTogglerSidebar('')}}></div>
                </ul>
            </div>
        </div>
    )
}