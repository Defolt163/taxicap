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

export default function Install() {
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
                    <AccordionItem className="bg-white">
                        <AccordionTrigger>Инструкция по установке на Android</AccordionTrigger>
                        <AccordionContent>
                            <div className="landing_install_instruction">
                                <div className="install_step">
                                    <p className="mt-8">1. Откройте приложение в браузере Google Chrome, и нажмите на три точки в верхнем правом углу экрана</p>
                                    <Image className="instruction_image" src={AndoidStep1} alt="Первый экран Android"/>
                                </div>
                                <div className="install_step">
                                    <p className="mt-8">2. Выберите пункт «Установить приложение» или «Добавить на главный экран».</p>
                                    <Image className="instruction_image" src={AndoidStep2} alt="Второй экран Android"/>
                                </div>
                                <div className="install_step">
                                    <p className="mt-8">3. Нажмите кнопку «Установить».</p>
                                    <Image className="instruction_image" src={AndoidStep3} alt="Третий экран Android"/>
                                </div>
                                <div className="install_step">
                                    <p className="mt-8">4. Подтвердите установку.</p>
                                    <Image className="instruction_image" src={AndoidStep4} alt="Четвертый экран Android"/>
                                </div>
                                <div className="install_step">
                                    <p className="mt-8">5. Добавьте иконку приложения на главный экран.</p>
                                    <Image className="instruction_image" src={AndoidStep5} alt="Пятый экран Android"/>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem className="bg-white">
                        <AccordionTrigger>Инструкция по установке на iPhone</AccordionTrigger>
                        <AccordionContent>
                            <div className="landing_install_instruction">
                                <div className="install_step">
                                    <p className="mt-8">1. Откройте приложение в браузере Safari, и нажмите на  три горизонтальные полосы в нижей части экрана, где расположен URL.</p>
                                    <Image className="instruction_image" src={IosStep1} alt="Первый экран Ios"/>
                                </div>
                                <div className="install_step">
                                    <p className="mt-8">2. В выпадающем меню нажмите кнопку «Поделиться».</p>
                                    <Image className="instruction_image" src={IosStep2} alt="Второй экран Ios"/>
                                </div>
                                <div className="install_step">
                                    <p className="mt-8">3. Прокрутите меню вниз и выберите «Ещё» или «Показать больше», если такой пункт доступен.</p>
                                    <Image className="instruction_image" src={IosStep3} alt="Третий экран Ios"/>
                                </div>
                                <div className="install_step">
                                    <p className="mt-8">4. Выберите параметр - «На экран «Домой»» или «Add to Home Screen».</p>
                                    <Image className="instruction_image" src={IosStep4} alt="Четвертый экран Ios"/>
                                </div>
                                <div className="install_step">
                                    <p className="mt-8">5. Поставьте галочку «Открыть как веб-приложение», инажмите кнопку «Добавить».</p>
                                    <Image className="instruction_image" src={IosStep5} alt="Пятый экран Ios"/>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </AccordionRoot>
            </div>
        </section>
    )
}
