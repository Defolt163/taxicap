import './global.sass'
import './global.css'
import { Suspense } from 'react'
import { Toaster } from "@/components/ui/sonner"
import CookieBanner from './components/CookieNotification/CookieNotification'
import YandexMetrika from './components/YandexMetrika/YandexMetrika'

export const metadata = {
  metadataBase: new URL('https://poehali163.ru'),
  title: 'Поехали',
  description: 'Заказ поездок в Шенталинском районе',
  icons: {
    icon: [
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [{ url: '/favicon/apple-touch-icon.png', sizes: '180x180' }],
    other: [
      { rel: 'mask-icon', url: '/favicon/safari-pinned-tab.svg', color: '#5bbad5' },
    ],
  },
  appleWebApp: {
    capable: true,
    title: 'Поехали',
    statusBarStyle: 'default',
  },
  openGraph: {
    title: 'Поехали',
    description: 'Заказ поездок в Шенталинском районе',
    url: '/',
    siteName: 'Поехали',
    locale: 'ru_RU',
    type: 'website',
    images: [
      {
        url: '/landing/image/promo1.jpg',
        width: 1200,
        height: 800,
        alt: 'Поехали',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'Поехали',
    description: 'Заказ поездок в Шенталинском районе',
    images: ['/landing/image/promo1.jpg'],
  },
}

export const viewport = {
  themeColor: '#ffffff',
}

export default function RootLayout({ children }) {
  /* useEffect(()=>{
    fetch('https://geolocation-db.com/json/',
      {method: 'GET'}
    ).then((result)=>{
      return result.json()
    }).then((res)=>{
      console.log(res)
      if(res.country_code !== 'RU'){
        toast.warning('Похоже, вы используете VPN 🤨', {
          description: `Отключите его, чтобы использование приложения было более комфортным`,
          duration: Infinity,
      });
      }
    })
  }, []) */
  return (
      <html lang="ru">
        <body>
          <CookieBanner/>
          {children}
          <Suspense>
            <YandexMetrika />
          </Suspense>
          <div><Toaster position="top-center" richColors/></div>
        </body>
      </html>
  )
}
