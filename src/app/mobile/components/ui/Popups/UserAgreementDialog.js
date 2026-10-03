import UserAgreement from '../../legal/UserAgreement'
import LegalDocumentPopup from './LegalDocumentPopup'

export default function UserAgreementDialog({ children }) {
  return (
    <LegalDocumentPopup
      title="Пользовательское соглашение"
      content={<UserAgreement />}
    >
      {children}
    </LegalDocumentPopup>
  )
}
