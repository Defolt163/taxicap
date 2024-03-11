'use client'
import Image from "next/image";
import logoImage from '/public/logo/logotype.png'
import { Helmet } from "react-helmet";
import './style.sass'

export default function LoginLayout({ children }) {
    return (
          <html lang="en">
            <body>
                <Helmet>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
                </Helmet>
                <div className="container">
                    <Image src={logoImage} alt="logo" style={{height: 'auto', width: '100%', margin: '2rem 0'}}/>
                    {children}
                </div>
            </body>
          </html>
    );
}