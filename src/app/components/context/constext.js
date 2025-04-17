/* "use client";

import { usePathname, useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";

const DataContext = createContext();

export function DataProvider({ children }) {
    const router = useRouter()
    const userPath = usePathname()
    const [userData, setUserData] = useState(null);
    
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null; // Если куки нет
    }
    function setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        const expiresStr = "expires=" + expires.toUTCString();
        document.cookie = `${name}=${value}; ${expiresStr}; path=/`;
    }

    // Функция для получения данных о пользователе
    function fetchUserData() {
        const token = getCookie('token'); // Получаем токен из куки
    
        return fetch('/api/account-data/sign-in', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })
        .then((response) => {
            if (!response.ok) { 
                if (userPath.startsWith('/mobile/general')) {
                    if (response.status === 401) {
                        router.push('/mobile/sign-in');
                    }
                }
                setCookie('token', 'notAuth', 7)
            }
            else{
                return response.json()
            }
        }).then((res)=>{
            setCookie('token', res.newToken, 7)
            setUserData(res.rows[0])
            console.log("22", res)
        })
        .catch((error) => {
            console.error('Fetch error:', error);
        });
    }

    useEffect(() => {
        fetchUserData();
    }, [userPath]);

    return (
        <DataContext.Provider value={{ userData }}>
            {children}
        </DataContext.Provider>
    );
}

export function useData() {
    return useContext(DataContext);
} */