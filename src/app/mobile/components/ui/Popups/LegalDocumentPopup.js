'use client'

import { cloneElement, useEffect, useState } from 'react'
import { HiMiniXMark } from 'react-icons/hi2'

export default function LegalDocumentPopup({ children, title, content }) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setIsOpen(false)
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen])

  const trigger = cloneElement(children, {
    role: children.props.role || 'button',
    tabIndex: children.props.tabIndex ?? 0,
    'aria-haspopup': 'dialog',
    onClick: (event) => {
      event.preventDefault()
      event.stopPropagation()
      children.props.onClick?.(event)
      setIsOpen(true)
    },
    onKeyDown: (event) => {
      children.props.onKeyDown?.(event)
      if (event.defaultPrevented) return
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        event.stopPropagation()
        setIsOpen(true)
      }
    },
  })

  return (
    <>
      {trigger}
      {isOpen ? (
        <>
          <div
            className="popup-background popup-open legal-document-popup-background"
            onClick={() => setIsOpen(false)}
          />
          <div
            className="popup popup-input-error popup-open legal-document-popup"
            role="dialog"
            aria-modal="true"
            aria-label={title}
          >
            <button
              type="button"
              className="popup-close-x-mark"
              aria-label="Закрыть"
              onClick={() => setIsOpen(false)}
            >
              <HiMiniXMark />
            </button>
            <div className="legal-document-popup__content">{content}</div>
          </div>
        </>
      ) : null}
    </>
  )
}
