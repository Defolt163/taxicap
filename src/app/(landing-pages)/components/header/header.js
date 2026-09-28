import MobileHeader from './components/MobileHeader/MobileHeader'
import DesktopHeader from './components/DesktopHeader/DesktopHeader'
import { FaArrowDown, FaInfo } from "react-icons/fa6";
import { IoMdHelp } from "react-icons/io";
import appLogo from '@/../public/logo/logo_new_white.svg'
import Image from 'next/image';

export default function Header(){
    const mobileHeaderItems = [
        {name: 'О нас', link: '#about', icon: <FaInfo/>},
        {name: 'Открыть', link: '#', icon: <Image className='app_ico' src={appLogo} alt='Открыть приложение'/>},
        {name: 'Справка', link: '/policy', icon: <IoMdHelp/>},
        {name: 'Установка', link: '#', icon: <FaArrowDown/>}
    ]
    const desktopHeaderItems = [
        {name: 'О нас', link: '#about'},
        {name: 'Как это работает', link: '#'},
        {name: 'Справочник', link: '#'},
        {name: 'Как установить', link: '#'}
    ]
    return(
        <>
            <MobileHeader headerItems={mobileHeaderItems}/>
            <DesktopHeader headerItems={desktopHeaderItems}/>
        </>
    )
}