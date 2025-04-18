"use client";
import jwt from 'jsonwebtoken';
import { usePathname, useRouter } from 'next/navigation';
import React, { createContext, useContext, useEffect, useState } from "react";
const crypto = require('crypto'); // Для Node.js

const DataContext = createContext();

export function DataProvider({ children }) {
    const router = useRouter()
    const userPath = usePathname()
    const [userData, setUserData] = useState(null);
    const [loadingStatus, setLoadingStatus] = useState(true);
    
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
    async function fetchUserData() {
        const token = getCookie('token'); // Получаем токен из куки
        const checkStartPage = getCookie('firstScreen');
        if (token !== null && checkStartPage !== null){
            try{
                const response = await fetch('/api/account-data/sign-in', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                })
                const result = await response.json();
                if(!response.ok || response.status == 401 ){
                    if (userPath.startsWith('/mobile/general')) {
                        if (response.status === 401) {
                            router.push('/mobile/sign-in');
                        }
                    }
                    setCookie('token', 'notAuth', 7)
                } else {
                    console.log("Резул", result)
                    setCookie('token', result.newToken, 7);
                    decryptData(result.user.encryptedData, result.user.iv)
                    setLoadingStatus(false)
                    if (!userPath.startsWith('/mobile/general')){
                        router.push('/mobile/general');
                    }
                }
            } catch (error){
                alert(`ошибка в контексте: ${error}`)
            }
        }else if (checkStartPage !== null && userPath.startsWith('/mobile/general')){
            router.push('/mobile/sign-in');
        }else{
            router.push('/mobile/');
        }
    }

    useEffect(() => {
        fetchUserData();
    }, [userPath]);
    async function decryptData(encodedMessage, messageIv) {
        
        // Преобразуем ключ и IV из шестнадцатеричного формата
        const key = Buffer.from('16cf126a9dc4e39e405a03ad0fb2f31d91f6b73342c7d7647772e104aa8d7e39', 'hex'); // Ключ AES-256
        const iv = Buffer.from(messageIv, 'hex'); // IV (инициализационный вектор)

        // Зашифрованные данные, полученные с сервера
        //const encryptedData = 'cfcb8759af160c6ac29aad5fe6afb2febad2f87f15ebb20ecfd570b81547a6cb0f0ff7e331038f9bc786837810f4e92f78a2880d6c696aa7b8cd2efd130850ddee5a879dbc5799d7e56b5206e3e94a3087fed032fdbec0565395fe407487311cfe9e7c5790c5d566436e7150beaced8b01cc2c9cb97eda68fc0c8be6ac7014acf99536ad397b3f402c65d73740d99f8d0109b5f44367872e1ecb61d1503342f97036f9b4ed6eae19b74d9639a819f5c41b191160d39e0b67c8e56e51ef14c0d4ff7cd308d5bcd76c942b6a417aae3845c107fa222ecaeb5803589f3202b2b19433b419f2ffc29eb4b981d8931894907372de21c275fa39c657750099cc0e0d0f56070c208e1c61022097b72ab9fcccedbe94ce4b6e5ea2912ec92ad58257d48b787046a0c714c7e4f87b4f071fdcf6f8';

        // Преобразуем зашифрованные данные в Buffer
        const encryptedBuffer = Buffer.from(encodedMessage, 'hex');

        // Создаем расшифровщик
        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

        // Расшифровка данных
        let decrypted = decipher.update(encryptedBuffer, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        let parsedData = JSON.parse(decrypted)
        setUserData(parsedData[0])
        // Выводим расшифрованные данные
        console.log('Резул', parsedData[0]);

    }
    
    return (
        <DataContext.Provider value={{ userData, setUserData, loadingStatus }}>
            {children}
        </DataContext.Provider>
    );
}

export function useData() {
    return useContext(DataContext);
}
