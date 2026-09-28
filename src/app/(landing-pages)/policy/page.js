import {
  AccordionContent,
  AccordionItem,
  AccordionRoot,
  AccordionTrigger
} from "@/components/tailgrids/core/accordion";
import Header from "../components/header/header";
import './style.sass'
import LandingFooter from "../components/footer/footer";

export default function PolicyPage(){
    return(
        <div className="info_page">
            <Header/>
            <div className="info_page_block">
                <div className="info_page__wrapper">
                    <h1 className="info_header">Информация</h1>
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
                            <AccordionTrigger>Пользовательское соглашение сервиса "Поехали"</AccordionTrigger>
                            <AccordionContent>
                            Standard shipping typically takes 5-7 business days. Express options
                            are available at checkout.
                            </AccordionContent>
                        </AccordionItem>
                    </AccordionRoot>
                </div>
            </div>
            <LandingFooter/>
        </div>
    )
}