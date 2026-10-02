import PagesHeader from "../../../components/PagesHeader/PagesHeader"
import UserAgreementContent from "../../../components/legal/UserAgreementContent"
import '../style.sass'
import {
  AccordionContent,
  AccordionItem,
  AccordionRoot,
  AccordionTrigger
} from "@/components/tailgrids/core/accordion";

export default function faqPage(){
    return(
        <div className="info_page">
            <div className="container">
                <div className="info-page_header">
                    <PagesHeader ReturnBtn="/mobile/general"/>
                </div>
                <AccordionRoot>
                    <AccordionItem>
                        <AccordionTrigger>Политика обработки персональных данных</AccordionTrigger>
                        <AccordionContent>
                        We offer a 30-day return policy on all unused items in their original
                        packaging.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem>
                        <AccordionTrigger>Согласие на обработку персональных данных</AccordionTrigger>
                        <AccordionContent>
                        Standard shipping typically takes 5-7 business days. Express options
                        are available at checkout.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem>
                        <AccordionTrigger>Политика использования Cookie</AccordionTrigger>
                        <AccordionContent>
                        Standard shipping typically takes 5-7 business days. Express options
                        are available at checkout.
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem>
                        <AccordionTrigger>Пользовательское соглашение приложения REVVO</AccordionTrigger>
                        <AccordionContent>
                        <UserAgreementContent />
                        </AccordionContent>
                    </AccordionItem>
                </AccordionRoot>
            </div>
        </div>
    )
}