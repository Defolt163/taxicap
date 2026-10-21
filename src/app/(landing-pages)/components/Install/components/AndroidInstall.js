import {
  AccordionContent,
  AccordionItem,
  AccordionRoot,
  AccordionTrigger
} from "@/components/tailgrids/core/accordion";
import '../style.sass'
import AndoidStep1 from "@/../public/landing/install/android/android-step-1.png"
import AndoidStep2 from "@/../public/landing/install/android/android-step-2.png"
import AndoidStep3 from "@/../public/landing/install/android/android-step-3.png"
import AndoidStep4 from "@/../public/landing/install/android/android-step-4.png"
import AndoidStep5 from "@/../public/landing/install/android/android-step-5.png"
import Image from "next/image";
export default function AndroidInstall(){
    return(
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
    )
}