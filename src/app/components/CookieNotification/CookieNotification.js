'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const COOKIE_NAME = 'poehali_cookie_consent';
const COOKIE_VERSION = '1.0';

export default function CookieBanner({}) {
    function setCookies(cookies, days = 365) {
        const expires = new Date();
        expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
        const expiresStr = 'expires=' + expires.toUTCString();

        for (const [name, value] of Object.entries(cookies)) {
            document.cookie = `${name}=${encodeURIComponent(value)}; ${expiresStr}; path=/; SameSite=Lax`;
        }
    }
    const [cookieShow, setCookieShow] = useState(false)

    async function acceptCookies(analyticsStatus){
        const response = await fetch('/api/cookie-consent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(
                { 
                    analytics: analyticsStatus,
                    necessary: true,
                    policy_version: COOKIE_VERSION,
                }
            )
        })
        if(response.ok){
            const data = await response.json()
            setCookies({
                consent_id: data.consentId,
                analytics: analyticsStatus,
                necessary: true,
                policy_version: COOKIE_VERSION
            }, 365)
            setCookieShow(false)
            window.dispatchEvent(new Event('cookie-consent-changed'));
        }
    }

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null; // Если куки нет
    }
    async function checkCookies(){
        const consentId = await getCookie("consent_id")
        if (typeof consentId !== "string" || consentId.trim() === "" ){
            setCookieShow(true)
        }else{
            const response = await fetch('/api/cookie-consent', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            if(response.ok){
                setCookieShow(true)
            }else if(response.status === 400){
                console.log(response.status)
                const data = await response.json()
                setCookies({
                    consent_id: data.consent_id,
                    analytics: data.analytics == 1 ? true : null,
                    necessary: data.necessary == 1 ? true : null,
                    policy_version: data.policy_version
                }, 365)
                setCookieShow(false)
            }
        }
    }
    useEffect(()=>{
        checkCookies()
    }, [])
    if(cookieShow){
        return (
            <div
            role="dialog"
            aria-label="Настройки файлов cookie"
            aria-live="polite"
            className="fixed bottom-4 left-4 right-4 z-[9999] mx-auto max-w-5xl"
            >
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl md:p-6">

                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                <div className="flex-1">
                    <h2 className="mb-2 text-lg font-semibold text-gray-900">
                    Использование файлов cookie
                    </h2>

                    <p className="text-sm leading-6 text-gray-600">
                    Мы используем необходимые файлы cookie для работы
                    сервиса «Поехали». С вашего согласия также могут
                    использоваться аналитические cookie для анализа
                    посещаемости и улучшения работы сервиса.
                    </p>

                    <p className="mt-2 text-sm text-gray-500">
                    Подробнее смотрите в{' '}
                    <Link
                        href="/policy"
                        className="font-medium text-blue-600 underline underline-offset-2 hover:text-blue-700"
                    >
                        Политике использования cookie
                    </Link>
                    .
                    </p>
                </div>

                <div className="flex shrink-0 flex-col gap-2 sm:flex-row">

                    <button
                    type="button"
                    onClick={()=>{acceptCookies(false)}}
                    className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                    Отклонить
                    </button>

                    <button
                        type="button"
                        onClick={()=>{acceptCookies(true)}}
                        className="rounded-xl bg-[#004cf2] px-5 py-3 text-sm font-medium text-white transition active:scale-[0.98]"
                    >
                    Принять
                    </button>

                </div>

                </div>
            </div>
            </div>
        );
    }
}