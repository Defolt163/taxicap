import {
  AccordionContent,
  AccordionItem,
  AccordionRoot,
  AccordionTrigger
} from "@/components/tailgrids/core/accordion";
import Header from "../components/header/header";
import './style.sass'
import LandingFooter from "../components/footer/footer";
import UserAgreementContent from "@/app/mobile/components/legal/PersonalDataProcessing";
import ConsentProcessingPersonalData from "@/app/mobile/components/legal/ConsentProcessingPersonalData";
import UserAgreement from "@/app/mobile/components/legal/UserAgreement";
import CookiePolicyContent from "@/app/mobile/components/legal/CookiePolicyContent";
import ServiceOpreatingRulesContent from "@/app/mobile/components/legal/ServiceOpreatingRulesContent";

export default function PolicyPage(){
    return(
        <div className="info_page">
            <Header/>
            <div className="info_page_block">
                <div className="info_page__wrapper">
                    <h1 className="info_header">Информация</h1>
                    <AccordionRoot>

                        <AccordionItem>
                            <AccordionTrigger>Политика использования персональных данных</AccordionTrigger>
                            <AccordionContent>
                                <UserAgreementContent />
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem>
                            <AccordionTrigger>Согласие на обработку персональных данных</AccordionTrigger>
                            <AccordionContent>
                                <ConsentProcessingPersonalData/>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem>
                            <AccordionTrigger>Пользовательское соглашение "Поехали"</AccordionTrigger>
                            <AccordionContent>
                                <UserAgreement />
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem>
                            <AccordionTrigger>Политика использования Cookie и локального хранилища</AccordionTrigger>
                            <AccordionContent>
                                <CookiePolicyContent />
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem>
                            <AccordionTrigger>Правила тестовой эксплуатации сервиса "Поехали"</AccordionTrigger>
                            <AccordionContent>
                                <ServiceOpreatingRulesContent />
                            </AccordionContent>
                        </AccordionItem>

                    </AccordionRoot>
                </div>
            </div>
            <LandingFooter/>
        </div>
    )
}