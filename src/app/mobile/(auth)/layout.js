import Image from "next/image";
import logo from '/public/favicon/android-chrome-512x512.png'
import './style.sass'
import { PopupProvider } from "../components/PopupContext";
import GlobalPopup from "../components/ui/Popups/GlobalPopup";

export default function LoginLayout({ children }) {
    return (
        <>
            <PopupProvider>
                <div className="container h-dvh" style={{paddingTop: '2rem'}}>
                    <Image src={logo} alt="logo" className='image_logo'/>
                    {children}
                </div>
                <GlobalPopup />
            </PopupProvider>
        </>
    );
}