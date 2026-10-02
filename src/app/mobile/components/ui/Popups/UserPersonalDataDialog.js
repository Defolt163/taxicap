import UserPersonalDataContent from '../../legal/UserPersonalDataContent'
import LegalDocumentPopup from './LegalDocumentPopup'

export default function UserPersonalDataDialog({ children }) {
  return (
    <LegalDocumentPopup
      title="Политика обработки персональных данных"
      content={<UserPersonalDataContent />}
    >
      {children}
    </LegalDocumentPopup>
  )
}
