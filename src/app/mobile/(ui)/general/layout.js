
import '../../../global.sass'
import {DataProvider} from '../../components/DataContext'
import { PopupProvider } from '../../components/PopupContext'
import GlobalPopup from '../../components/ui/Popups/GlobalPopup'

export const metadata = {
  title: "REVVO",
  description: "Добро пожаловать",
}
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  // Also supported but less commonly used
  // interactiveWidget: 'resizes-visual',
}

export default function AppLayout({ children }) {

  return (
    <>
      <DataProvider>
        <PopupProvider>
          {children}
          <GlobalPopup/>
        </PopupProvider>
      </DataProvider>
    </>
      
  )
}
