import Link from "next/link";
import "../style.sass"
import Image from "next/image";
import LandingPromo from "../components/promo/Promo";
import AboutComponent from "../components/about/About";
import HowItsWorked from "../components/HowItsWorked/HowItsWorked";
import LandingFooter from "../components/footer/footer";
import Header from "../components/header/header";

export default function MainPage(){
    return(
        <div className="landing">
            <Header/>
            <LandingPromo/>
            <AboutComponent/>
            <HowItsWorked/>
            <LandingFooter/>
        </div>
    )
}