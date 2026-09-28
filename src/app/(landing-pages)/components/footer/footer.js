import Image from 'next/image'
import logo from '@/../public/logo/logo_new.svg'
import './style.sass'
import Link from 'next/link'
export default function LandingFooter(){
    return(
        <div className="footer">
            <ul className='footer_wrapper'>
                <li className='footer_item'><Link href={'/'}>Главная</Link></li>
                <li className='footer_item'><Link href={'/'}>Политика обработки персональных данных</Link></li>
                <li className='footer_item'><Link href={'/'}>Согласие на обработку персональных данных</Link></li>
                <li className='footer_item'><Link href={'/'}>Политика использования Cookie</Link></li>
            </ul>
        </div>
    )
}