'use client'
import { useRouter } from 'next/navigation'
import '../../../global.sass'
import Script from 'next/script'
import { useEffect, useState } from 'react'
import { Helmet } from "react-helmet"
import Cookies from 'js-cookie'
import manifest from '/public/manifest.json'


export default function AccountLayout({ children }) {

  const router = useRouter()
  // Установка куки с localstorage
  function setCookie(name, value) {
    let expires = ""
    let date = new Date()
    date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000))
    expires = " expires=" + date.toUTCString()

    document.cookie = name + "=" + decodeURIComponent(value) + expires + " path=/"
    localStorage.setItem('accountSessionId', value)
}
  // Получение sessionId из кук
  const [sessionKey, setSessionKey] = useState('')
  function myHandler() {
    if(sessionKey === ''){
      const cookieValue = Cookies.get('UserData')
      if (cookieValue) {
          try {
              const userData = JSON.parse(cookieValue)
              setSessionKey(userData.session_key)
          } catch (error) {
              console.error("Ошибка при парсинге данных пользователя из cookie:", error)
          }
      }if(!cookieValue){
        try {
          const userData = JSON.parse(localStorage.getItem('accountSessionId'))
          setCookie('UserData', JSON.stringify({
            session_key: userData.session_key
        }), 30)
          setSessionKey(userData.session_key)
        } catch (error) {
            console.error("Ошибка при парсинге данных пользователя из localstorage:", error)
        }
      }
    }
  }
  useEffect(()=>{
      myHandler()
  }, [])

  function getUsersAccountType(){
    if(sessionKey !== ''){
      fetch(`/api/account-data/user-data?sessionId=${sessionKey}`,{
        method: 'GET'
      }).then((result)=>{
          return result.json()
      }).then((res)=>{
        if(res.length !== 0){
            if(res[0].ActiveOrder !== 0){
              router.push('/mobile/general')
            }
        }
        })
      .catch(error =>{
        console.log("ОШИБКАА", error)
        router.push('/mobile/sign-in')
      })
    }
  }
  useEffect(()=>{
    getUsersAccountType()
  }, [sessionKey])


  return (
      <>
        {children}
      </>
  )
}
