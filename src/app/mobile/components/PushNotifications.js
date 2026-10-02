'use client'

import { useEffect, useState } from 'react'
import { usePopup } from './PopupContext'
import { useData } from './DataContext'

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
  const { userData } = useData()
  const [supported, setSupported] = useState(false)
  const [subscription, setSubscription] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) return
    if (!userData?.UserId) return

    setSupported(true)
    let cancelled = false

    async function registerAndSync() {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none',
      })
      let currentSubscription = await registration.pushManager.getSubscription()

      if (currentSubscription) {
        const expectedKey = urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY)
        const currentKey = currentSubscription.options.applicationServerKey
        const currentKeyBytes = currentKey ? new Uint8Array(currentKey) : null
        const keyMatches = currentKeyBytes && currentKeyBytes.length === expectedKey.length &&
          expectedKey.every((byte, index) => byte === currentKeyBytes[index])

        if (!keyMatches) {
          await currentSubscription.unsubscribe()
          await fetch('/api/push/subscribe', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${getCookie('token')}`,
            },
            body: JSON.stringify({ endpoint: currentSubscription.endpoint }),
          })
          currentSubscription = null
        }
      }

      if (cancelled) return
      setSubscription(currentSubscription)

      const token = getCookie('token')
      if (!currentSubscription || !token) return

      const response = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(currentSubscription.toJSON()),
      })
      if (!response.ok) throw new Error(`Push subscription sync failed: ${response.status}`)
    }

    registerAndSync().catch((error) => {
      console.error('Push registration error:', error)
      setError('Не удалось синхронизировать push-подписку')
      showPopup('Не удалось синхронизировать push-подписку')
    })

    return () => { cancelled = true }
  }, [userData?.UserId, showPopup])

  async function togglePush() {
    setBusy(true)
    setError('')
    try {
      let nextSubscription = subscription

      if (nextSubscription) {
        const registration = await navigator.serviceWorker.ready
        await nextSubscription.unsubscribe()
        await fetch('/api/push/subscribe', {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${getCookie('token')}` },
          body: JSON.stringify({ endpoint: nextSubscription.endpoint }),
        })
        setSubscription(null)
        return
      }

      if (Notification.permission === 'denied') {
        showPopup('Уведомления заблокированы в настройках сайта Microsoft Edge')
        return
      }

      const permission = Notification.permission === 'granted'
        ? 'granted'
        : await Notification.requestPermission()
      if (permission !== 'granted') {
        showPopup('Разрешите уведомления в настройках браузера')
        return
      }

      const registration = await navigator.serviceWorker.ready
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
