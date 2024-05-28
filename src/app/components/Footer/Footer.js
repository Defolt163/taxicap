import Image from "next/image";
import Link from "next/link";
import Logo from '/public/logo/swift-logo-white.svg'
import './style.sass'

export default function FooterPageComponent(){
    return(
        <div className="footer">
            <div className="container">
                <div className="footer_wrapper">
                    <Link href='/' className="footer_logo"><Image src={Logo} alt="Swift Logo"/></Link>
                    <ul className="footer_link_block">
                        <li className="footer_link__wrapper">Компания</li>
                        <li className="footer_link__wrapper"><Link href='/' className="footer_link">О нас</Link></li>
                        <li className="footer_link__wrapper"><Link href='/' className="footer_link">Условия использования</Link></li>
                        <li className="footer_link__wrapper"><Link href='/' className="footer_link">Приложение</Link></li>
                    </ul>
                    <ul className="footer_link_block footer_link-smm_block">
                        <li className="footer_link-smm__wrapper">Социальные сети</li>
                        <li className="footer_link-smm__wrapper"><Link href='/' className="footer_link"><i className="fa-brands fa-telegram"></i></Link></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}