import Link from 'next/link'
import './style.sass'
import Image from 'next/image'
export default function DesktopHeader({ headerItems }){
    return(
        <div className="header desktop hidden md:block">
            <div className='header_wrapper'>
                <ul className="header_items">
                    <li className="header_item"><Link className="flex items-center" href={"#"}><Image className="mr-2" src={'/logo/logo_new.svg'} width={50} height={50} alt="Лого"/> <span>Поехали</span></Link></li>
                    {headerItems.map((item, index) => (
                        <li className="header_item" key={index}>
                            <Link href={item.link}>
                                <span>{item.name}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
                <div className="Button small">Открыть приложение</div>
            </div>
        </div>
    )
}