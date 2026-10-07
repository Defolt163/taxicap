import ConsentProcessingPersonalData from "@/app/mobile/components/legal/ConsentProcessingPersonalData";
import PagesHeader from "../../../components/PagesHeader/PagesHeader"
import UserAgreementContent from "../../../components/legal/PersonalDataProcessing"
import '../style.sass'
import {
  AccordionContent,
  AccordionItem,
  AccordionRoot,
  AccordionTrigger
} from "@/components/tailgrids/core/accordion";
import UserAgreement from "@/app/mobile/components/legal/UserAgreement";
import CookiePolicyContent from "@/app/mobile/components/legal/CookiePolicyContent";
import ServiceOpreatingRulesContent from "@/app/mobile/components/legal/ServiceOpreatingRulesContent";

export default function faqPage(){
    return(
        <div className="info_page">
            <div className="container">
                <div className="info-page_header">
                    <PagesHeader ReturnBtn="/mobile/general"/>
                </div>
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
                            <ConsentProcessingPersonalData />
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem>
                        <AccordionTrigger>Пользовательское соглашение &quot;Поехали&quot;</AccordionTrigger>
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
                        <AccordionTrigger>Правила тестовой эксплуатации сервиса &quot;Поехали&quot;</AccordionTrigger>
                        <AccordionContent>
                            <ServiceOpreatingRulesContent />
                        </AccordionContent>
                    </AccordionItem>

                </AccordionRoot>
            </div>
        </div>
    )
}