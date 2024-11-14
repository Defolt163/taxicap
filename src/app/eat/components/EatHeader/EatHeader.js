import Link from 'next/link'
import './style.sass'
export default function EatHeader(){
    return(
        <div className="eat-header">
            <Link href={'/eat/user-side'} className="eat-header_logo">Swift Transport</Link>
            <div className="eat-header_account-block">
                <div className="eat-header_account-block_cart"><div className='Button small'><i className="fa-solid fa-cart-shopping"></i> Корзина</div></div>
                <div className="eat-header_account-block_profile"><div className='Button small'>Профиль</div></div>
            </div>
        </div>
    )
}