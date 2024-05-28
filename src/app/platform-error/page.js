import Image from 'next/image';
import './style.sass'
import Link from "next/link";
import logo from '/public/logo/swift-logo.svg'


export default function Home() {
  return (
    <main className="device-error-page">
      <div className="container">
        <div className='device-error-page_wrapper'>
            <Image className='logo-image' src={logo} alt="logo"/>
            <h1>К сожалению, вы не можете войти в приложение😕 <br/> Пожалуйста, используйте мобильное устройство для входа❤️‍🩹</h1>
            <Link className='Button' href='/'>Вернуться на главную</Link>
        </div>
      </div>
    </main>
  );
}