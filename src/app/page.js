import './style.sass'
import Link from "next/link";


export default function Home() {
  return (
    <main className="WelcomePage">
      <div className="container">
        <Link href={'/sign-in'}>Начать пользоваться</Link>
      </div>
    </main>
  );
}
