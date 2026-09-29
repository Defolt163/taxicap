import Link from 'next/link'
import './style.sass'

export default function MobileHeader({ headerItems }){
    return(
        <div className="header mobile block md:hidden">
            <div className='header_wrapper'>
                <ul className="header_items">
                    {headerItems.map((item, index) => {
                        const content = (
                            <>
                                <span className='item_ico'>{item.icon}</span>
                                <span>{item.name}</span>
                            </>
                        );

                        return (
                            <li className="header_item" key={index}>
                                {item.onClick ? (
                                    <div className='item_content' onClick={item.onClick}>
                                        {content}
                                    </div>
                                ) : (
                                    <Link className='item_content' href={item.link}>
                                        {content}
                                    </Link>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    )
}