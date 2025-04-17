'use client'
import { useRouter } from 'next/navigation'
import '../../../global.sass'
import {DataProvider} from '../../components/DataContext'


export default function AccountLayout({ children }) {

  return (
      <>
        <DataProvider>
          {children}
        </DataProvider>
      </>
  )
}
