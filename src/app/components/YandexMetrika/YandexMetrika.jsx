'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

const COUNTER_ID = 113570169;

export default function YandexMetrika() {
    const [enabled, setEnabled] = useState(false);

    // Функция чтения cookie
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    // Проверяем согласие при монтировании и слушаем изменения
    useEffect(() => {
        const check = () => {
            const analytics = getCookie('analytics');
            // analytics === 'true' — согласие дано
            setEnabled(analytics === 'true');
        };

        check();

        // Слушаем кастомное событие, которое будет вызывать баннер
        window.addEventListener('cookie-consent-changed', check);
        return () => window.removeEventListener('cookie-consent-changed', check);
    }, []);

    if (!enabled) return null;

    return (
        <>
            <Script
                id="yandex-metrika"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
                        (function(m,e,t,r,i,k,a){
                            m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                            m[i].l=1*new Date();
                            for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
                            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
                        })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=${COUNTER_ID}', 'ym');

                        ym(${COUNTER_ID}, 'init', {
                            ssr:true,
                            webvisor:true,
                            clickmap:true,
                            ecommerce:"dataLayer",
                            referrer: document.referrer,
                            url: location.href,
                            accurateTrackBounce:true,
                            trackLinks:true
                        });
                    `,
                }}
            />
            <noscript>
                <div>
                    <img
                        src={`https://mc.yandex.ru/watch/${COUNTER_ID}`}
                        style={{ position: 'absolute', left: '-9999px' }}
                        alt=""
                    />
                </div>
            </noscript>
        </>
    );
}