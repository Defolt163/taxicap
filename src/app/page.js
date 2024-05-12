import Image from 'next/image';
import './style.sass'
import Link from "next/link";
import logo from '/public/logo/logotype.png'


export default function Home() {
  return (
    <main className="WelcomePage">
      <div className="container">
        <Image src={logo} alt="logo" style={{height: 'auto', width: '100%', margin: '2rem 0'}}/>
        <div className='StartButtonBlock'>
          <Link className='Button BtnStart' href={'/sign-in'}>Начать пользоваться</Link>
        </div>
      </div>
    </main>
  );
}
