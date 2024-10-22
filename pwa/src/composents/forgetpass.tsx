'use client'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card , CardHeader , CardContent } from "@/components/ui/card"
import { useState } from "react"
import { ResetPassword } from "@/lib/request"
export default function ForgotPassword() {
const [formData , setFormData] = useState<{email: string}>({email: ""})
const [error , setError] = useState<boolean>(false);
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
setFormData({...formData , email: e.target.value})
console.log(formData)
}

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!emailRegex.test(formData.email)){
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 5000);
      return;
    }
    else{
      let email = await ResetPassword(formData.email);
      console.log(email);
    }
    const email = formData.email;
    console.log(email);
  }




  return (
    <Card className="w-full  md:w-[450px]">
    <CardHeader>
      <h1 className="text-4xl font-bold leading-none tracking-tight my-5 mb-2">Forgot Your Password</h1>
      <p className="text-gray-400"> We will send you an email that will allow you to reset your password.</p>
    </CardHeader>
    <CardContent>
        <form onSubmit={handleForgotPassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input onChange={handleChange} className={`md:h-12 ${error ? 'border-red-500 placeholder-red-500' : ''}`} id="email" type="email" placeholder="Enter your email" required />
          </div>
          {error && <p className="text-red-500 text-sm">Please enter a valid email address</p>}
          <Button type="submit" className="w-full">
            Reset Password
          </Button>
        </form>
        <div className="text-sm md:text-base mt-4">
          Just Remember it ?{" "}
          <Link href="/login" className="font-bold underline" prefetch={false}>
            Log in
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}