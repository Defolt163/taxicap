'use client'
import './style.sass'
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from 'react'
export default function SignIn(){
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    function signIn(e){
        e.preventDefault()
        console.log("submitted")
        fetch(`/api/swift-eat/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            }),
        })    
        .then((response)=>response.json())
        .then((res)=>{
            console.log(res)
            setCookie('SwiftTrEat', JSON.stringify({
                session_key: res[0].SessionKey
            }), 30)
        })
    }
    function setCookie(name, value) {
        let expires = ""
        let date = new Date()
        date.setTime(date.getTime() + (7 * 24 * 60 * 60 * 1000))
        expires = "; expires=" + date.toUTCString()
    
        document.cookie = name + "=" + decodeURIComponent(value) + expires + "; path=/"
        localStorage.setItem('SwiftEat', value)
    }
    return(
        <div className="auth-page">
            <Card className="auth-form mx-auto max-w-sm">
                <CardHeader>
                <CardTitle className="text-2xl">Аутентификация</CardTitle>
                <CardDescription>
                    Введите ваш Email
                </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={(e)=>{signIn(e)}}>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                value={email}
                                onChange={(e)=>{setEmail(e.target.value)}}
                                required
                            />
                            </div>
                            <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Password</Label>
                                <Link
                                href="#"
                                className="ml-auto inline-block text-sm underline"
                                >
                                Forgot your password?
                                </Link>
                            </div>
                            <Input 
                                id="password" 
                                type="password" 
                                required 
                                value={password}
                                onChange={(e)=>{setPassword(e.target.value)}}
                                />
                            </div>
                            <Button type="submit" className="w-full">
                                Login
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}