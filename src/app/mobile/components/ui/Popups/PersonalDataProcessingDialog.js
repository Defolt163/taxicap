import ConsentProcessingPersonalData from '../../legal/ConsentProcessingPersonalData'
import LegalDocumentPopup from './LegalDocumentPopup'

export default function UserPersonalDataDialog({ children }) {
  return (
    <LegalDocumentPopup
      title="Политика обработки персональных данных"
      content={<ConsentProcessingPersonalData />}
    >
      {children}
    </LegalDocumentPopup>
  )
}
