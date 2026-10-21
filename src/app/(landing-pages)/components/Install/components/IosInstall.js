import {
  AccordionContent,
  AccordionItem,
  AccordionRoot,
  AccordionTrigger
} from "@/components/tailgrids/core/accordion";
import '../style.sass'
import Image from "next/image";
import IosStep1 from "@/../public/landing/install/ios/ios-step-1.png"
import IosStep2 from "@/../public/landing/install/ios/ios-step-2.png"
import IosStep3 from "@/../public/landing/install/ios/ios-step-3.png"
import IosStep4 from "@/../public/landing/install/ios/ios-step-4.png"
import IosStep5 from "@/../public/landing/install/ios/ios-step-5.png"

export default function IosInstall(){
    return(
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
    )
}