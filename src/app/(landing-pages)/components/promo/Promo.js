import Image from 'next/image'
import './style.sass'
import PHONE from '@/../public/landing/image/PHONE.png'
import Link from 'next/link'
export default function LandingPromo(){
    return(
        <div className="landing_promo">
            <div className='landing_promo_wrapper'>
                <div className='promo_content'>
                    <h1>Поехали</h1>
                    <h2>Найди поездку <br/> или создай свою</h2>
                    <p>Участвуйте в открытом бета-тестировании сервиса для создания и бронирования поездок по Шентале</p>
                    <div className='promo_buttons'>
                        <Link href={'/mobile'} className='Button w-max'>Открыть приложение</Link>
                    </div>
                </div>
                <Image className='promo_image' src={PHONE} alt='Приложение'/>
            </div>
        </div>
    )
}