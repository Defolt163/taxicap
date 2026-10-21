'use client'
import {
  AccordionContent,
  AccordionItem,
  AccordionRoot,
  AccordionTrigger
} from "@/components/tailgrids/core/accordion";
import './style.sass'
import AndoidStep1 from "@/../public/landing/install/android/android-step-1.png"
import AndoidStep2 from "@/../public/landing/install/android/android-step-2.png"
import AndoidStep3 from "@/../public/landing/install/android/android-step-3.png"
import AndoidStep4 from "@/../public/landing/install/android/android-step-4.png"
import AndoidStep5 from "@/../public/landing/install/android/android-step-5.png"
import Image from "next/image";
import IosStep1 from "@/../public/landing/install/ios/ios-step-1.png"
import IosStep2 from "@/../public/landing/install/ios/ios-step-2.png"
import IosStep3 from "@/../public/landing/install/ios/ios-step-3.png"
import IosStep4 from "@/../public/landing/install/ios/ios-step-4.png"
import IosStep5 from "@/../public/landing/install/ios/ios-step-5.png"
import { useEffect, useState } from "react";
import AndroidInstall from "./components/AndroidInstall";
import IosInstall from "./components/IosInstall";

export default function Install() {
    const [os, setOs] = useState("other");

    useEffect(() => {
        const ua = navigator.userAgent;

        if (/iPhone|iPad|iPod/i.test(ua)) {
            setOs("ios");
        } else if (/Android/i.test(ua)) {
            setOs("android");
        } else {
            setOs("other");
        }
    }, []);
    return (
        <section id="install" className="landing_install">
            <div className="landing_install_wrapper">
                <div className="landing_install_header">
                    <p className="landing_install_label">
                        Установка
                    </p>
                    <h2 className="landing_install_title">
                        Добавьте приложение на рабочий экран
                    </h2>
                </div>

                <div className="landing_install_options">
                    <div className="landing_install_card">
                        <h3>Android</h3>
                        <ol>
                            <li>Откройте приложение «Поехали» в браузере Google Chrome.</li>
                            <li>Нажмите на меню ⋮ в правом верхнем углу экрана.</li>
                            <li>Выберите «Установить приложение» или «Добавить на главный экран».</li>
                            <li>Нажмите «Установить» или подтвердите добавление ярлыка, если появится такой запрос.</li>
                            <li>Если иконка не появилась автоматически, добавьте её на главный экран вручную.</li>
                        </ol>
                        <p className="text-sm font-bold mt-4">Теперь вы сможете запускать «Поехали» прямо с главного экрана телефона.</p>
                    </div>

                    <div className="landing_install_card">
                        <h3>iPhone и iPad</h3>
                        <ol>
                            <li>Откройте приложение «Поехали» в браузере Safari.</li>
                            <li>Нажмите кнопку «Поделиться» в меню браузера.</li>
                            <li>Прокрутите меню вниз и выберите «Ещё» или «Показать больше», если такой пункт доступен.</li>
                            <li>Выберите «На экран «Домой» или «Add to Home Screen».</li>
                            <li>Включите параметр «Открыть как веб-приложение», если он доступен, и нажмите «Добавить».</li>
                        </ol>
                        <p className="text-sm font-bold mt-4">Готово! Иконка «Поехали» появится на главном экране iPhone.</p>
                    </div>
                </div>

                <AccordionRoot className="mt-8">
                    {os == "android" ? 
                        <AndroidInstall/>
                    : os == "ios" ?
                        <IosInstall/>
                    : 
                        <> 
                            <AndroidInstall/> 
                            <IosInstall/> 
                        </>
                    }

                    
                </AccordionRoot>
            </div>
        </section>
    )
}
