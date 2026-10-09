'use client';

import { usePathname, useSearchParams } from "next/navigation";
import Script from 'next/script';
import { useEffect, useState } from 'react';

const COUNTER_ID = 113570169;
const base = "https://poehali163.ru";

export default function YandexMetrika() {
    const pathName = usePathname();
    const searchParams = useSearchParams();

    const [enabled, setEnabled] = useState(false);
    const [metrikaReady, setMetrikaReady] = useState(false);

    // Чтение cookie
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            return decodeURIComponent(parts.pop().split(';').shift());
        }
        return null;
    }

    // Проверяем согласие и слушаем его изменения
    useEffect(() => {
        const check = () => {
            const analytics = getCookie('analytics');
            setEnabled(analytics === 'true');
        };

        check();

        window.addEventListener('cookie-consent-changed', check);

        return () => {
            window.removeEventListener('cookie-consent-changed', check);
        };
    }, []);

    // Отправляем просмотр только при согласии и готовой Метрике
    useEffect(() => {
        if (!enabled || !metrikaReady || typeof window.ym !== 'function') {
            return;
        }

        const params = searchParams.toString();
        const url = base + pathName + (params ? `?${params}` : '');

        window.ym(COUNTER_ID, 'hit', url);
    }, [enabled, metrikaReady, pathName, searchParams]);

    // Не подключаем Метрику до согласия
    if (!enabled) {
        return null;
    }

    return (
        <Script
            id="metrika"
            strategy="afterInteractive"
            onReady={() => setMetrikaReady(true)}
        >
            {`
                (function(m,e,t,r,i,k,a){
                    m[i]=m[i]||function(){
                        (m[i].a=m[i].a||[]).push(arguments)
                    };
                    m[i].l=1*new Date();

                    for (var j=0;j<document.scripts.length;j++) {
                        if (document.scripts[j].src===r) {
                            return;
                        }
                    }

                    k=e.createElement(t);
                    a=e.getElementsByTagName(t)[0];
                    k.async=1;
                    k.src=r;
                    a.parentNode.insertBefore(k,a);
                })(window,document,"script",
                    "https://mc.yandex.ru/metrika/tag.js","ym");

                window.ym(${COUNTER_ID},"init",{
                    defer:true,
                    clickmap:true,
                    trackLinks:true,
                    accurateTrackBounce:true
                });
            `}
        </Script>
    );
}