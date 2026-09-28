'use client'

import { useEffect, useState } from 'react'
import { usePopup } from './PopupContext'

function getCookie(name) {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  return parts.length === 2 ? parts.pop().split(';').shift() : null
}

function urlBase64ToUint8Array(value) {
  const padding = '='.repeat((4 - value.length % 4) % 4)
  const base64 = (value + padding).replace(/-/g, '+').replace(/_/g, '/')
  return Uint8Array.from(window.atob(base64), (character) => character.charCodeAt(0))
}

export default function PushNotifications() {
  const { showPopup } = usePopup()
  const [supported, setSupported] = useState(false)
  const [subscription, setSubscription] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) return

    setSupported(true)
    navigator.serviceWorker.register('/sw.js', { scope: '/', updateViaCache: 'none' })
      .then((registration) => registration.pushManager.getSubscription())
      .then(setSubscription)
      .catch((error) => console.error('Push registration error:', error))
  }, [])

  async function togglePush() {
    setBusy(true)
    setError('')
    try {
      const registration = await navigator.serviceWorker.ready
      let nextSubscription = subscription

      if (nextSubscription) {
        await nextSubscription.unsubscribe()
        await fetch('/api/push/subscribe', {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${getCookie('token')}` },
          body: JSON.stringify({ endpoint: nextSubscription.endpoint }),
        })
        setSubscription(null)
        return
      }

      const permission = await Notification.requestPermission()
      if (permission !== 'granted') {
        showPopup('Разрешите уведомления в настройках браузера')
        return
      }

      nextSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY),
      })

      const response = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getCookie('token')}`,
        },
        body: JSON.stringify(nextSubscription.toJSON()),
      })

      if (!response.ok) throw new Error('Failed to save push subscription')
      setSubscription(nextSubscription)
    } catch (error) {
      console.error('Push subscription error:', error)
      showPopup('Не удалось включить уведомления')
    } finally {
      setBusy(false)
    }
  }

  if (!supported) return null

  return (
    <div className='AccountToggleModeBox'>
        <label className='AccountToggleMode' htmlFor='notification'>Уведомления</label>
        <label className="TogglerWrapper">
            <input id='notification' className='TogglerChecker' type="checkbox" checked={Boolean(subscription)} onChange={togglePush} disabled={busy}/>
            <div className="TogglerSlider">
                <div className="TogglerKnob"></div>
            </div>
        </label>
    </div>
  )
}
