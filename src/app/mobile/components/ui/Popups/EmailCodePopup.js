'use client'

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { HiMiniXMark } from 'react-icons/hi2'

export default function EmailCodePopup({
  isOpen,
  email,
  value,
  onChange,
  errorMessage,
  onClose,
  onConfirm,
  confirmLabel = 'Подтвердить',
  length = 4,
}) {
  if (!isOpen) return null

  return (
    <>
      <div className="popup popup-input-error popup-email-code popup-open">
        <div className="popup-close-x-mark" onClick={onClose}>
          <HiMiniXMark />
        </div>
        <h3 className="popup-input-error__text">Введите код подтверждения</h3>
        <h4 className="popup-input-error__text">Код подтверждения отправлен вам на Email: {email}</h4>
        <h5 className="mb-3 text-sm">Проверьте папку спам</h5>
        <InputOTP className="popup-input" maxLength={length} value={value} onChange={onChange}>
          <InputOTPGroup>
            {Array.from({ length }, (_, index) => <InputOTPSlot key={index} index={index} />)}
          </InputOTPGroup>
        </InputOTP>
        <h4 className="popup-input-error__text popup-input-error__text_message">{errorMessage}</h4>
        <div style={{ marginTop: '10px' }} className="Button PopupButton" onClick={onConfirm}>
          {confirmLabel}
        </div>
      </div>
      <div className="popup-background popup-open" onClick={onClose} />
    </>
  )
}
