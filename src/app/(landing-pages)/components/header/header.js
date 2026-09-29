'use client'
import { useEffect, useState } from 'react';
import MobileHeader from './components/MobileHeader/MobileHeader'
import DesktopHeader from './components/DesktopHeader/DesktopHeader'
import { FaArrowDown, FaInfo } from "react-icons/fa6";
import { IoMdHelp } from "react-icons/io";
import appLogo from '@/../public/logo/logo_new_white.svg'
import Image from 'next/image';
import './style.sass'
import { useRouter } from 'next/navigation';

export default function Header(){
    const [installPrompt, setInstallPrompt] = useState(null);
    const router = useRouter()

    useEffect(() => {
        const handleBeforeInstallPrompt = (event) => {
            event.preventDefault();
            setInstallPrompt(event);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const isMobileOrTablet = () => {
        if (typeof window === 'undefined') return false;

        const userAgent = navigator.userAgent || '';
        const isIOS = /iPhone|iPad|iPod/i.test(userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
        const isAndroid = /Android/i.test(userAgent);
        const isTablet = /iPad|android.+(tablet|silk)|Tablet/i.test(userAgent);

        return isIOS || isAndroid || isTablet || /Mobi|Mobile|Touch/i.test(userAgent) || window.matchMedia('(pointer: coarse)').matches;
    };

    const openInstallGuide = () => {
        if (typeof window === 'undefined') return;

        const installSection = document.getElementById('install');

        if (installSection) {
            installSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            return;
        }

        router.push('/#install')
    };

    const handleInstallAction = async () => {
        if (typeof window === 'undefined') return;

        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;

        if (isStandalone) {
            openInstallGuide();
            return;
        }

        if (isMobileOrTablet()) {
            if (installPrompt) {
                installPrompt.prompt();
                const { outcome } = await installPrompt.userChoice;

                if (outcome === 'accepted') {
                    setInstallPrompt(null);
                }
                return;
            }

            openInstallGuide();
            return;
        }

        openInstallGuide();
    };

    const mobileHeaderItems = [
        {name: 'О нас', link: '/#about', icon: <FaInfo/>},
        {name: 'Открыть', link: '/mobile', icon: <Image className='app_ico' src={appLogo} alt='Открыть приложение'/>},
        {name: 'Справка', link: '/policy', icon: <IoMdHelp/>},
        {name: 'Установка', link: '/#install', icon: <FaArrowDown/>, onClick: handleInstallAction}
    ]
    const desktopHeaderItems = [
        {name: 'О нас', link: '/#about'},
        {name: 'Как это работает', link: '/#workis'},
        {name: 'Справочник', link: '/policy'},
        {name: 'Как установить', link: '/#install'}
    ]
    return(
        <>
            <MobileHeader headerItems={mobileHeaderItems}/>
            <DesktopHeader headerItems={desktopHeaderItems}/>
        </>
    )
}