import UserAgreementContent from '../../legal/UserAgreementContent'
import LegalDocumentPopup from './LegalDocumentPopup'

export default function UserAgreementDialog({ children }) {
  return (
    <LegalDocumentPopup
      title="Пользовательское соглашение"
      content={<UserAgreementContent />}
    >
      {children}
    </LegalDocumentPopup>
  )
}
