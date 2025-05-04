import Image from "next/image";
import logoImage from '/public/logo/logo-colored.svg'
import './style.sass'
import Head from 'next/head';

export default function LoginLayout({ children }) {
    return (
        <div className="container h-dvh" style={{paddingTop: '2rem'}}>
            <Image src={logoImage} alt="logo" style={{height: 'auto', width: '100%', margin: '0 0 2rem 0'}}/>
            {children}
        </div>
    );
}