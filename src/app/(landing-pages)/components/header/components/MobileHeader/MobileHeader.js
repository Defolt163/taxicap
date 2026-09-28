import Link from 'next/link'
import './style.sass'
import Image from 'next/image'


export default function MobileHeader({ headerItems }){
    return(
        <div className="header mobile block md:hidden">
            <div className='header_wrapper'>
                <ul className="header_items">
                    {headerItems.map((item, index) => (
                        <li className="header_item" key={index}>
                            <Link href={item.link}>
                                <span className='item_ico'>{item.icon}</span>
                                <span>{item.name}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}