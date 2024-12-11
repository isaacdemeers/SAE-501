'use client'
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { useState } from "react"
import { ResetPassword } from "@/lib/request"
export default function ForgotPassword() {
  const [formData, setFormData] = useState<{ email: string }>({ email: "" })
  const [error, setError] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, email: e.target.value })
  }

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!emailRegex.test(formData.email)) {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 5000);
      return;
    }
    else {
      let email = await ResetPassword(formData.email);
      if (email.message === "Password reset email sent") {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          window.location.href = "/login";
        }
          , 3000);
      }
      else if (email.message === "Email not found") {
        setError(true);
        setTimeout(() => {
          setError(false);
        }, 5000);
        return;
      }
    }
    const email = formData.email;
  }




  return (
    <Card className="w-full  md:w-[450px]">
      <CardHeader>
        <h1 className="text-4xl font-bold leading-none tracking-tight my-5 mb-2">Mot de passe oublié ?</h1>
        <p className="text-gray-400">Nous vous enverrons un email qui vous permettra de réinitialiser votre mot de passe.</p>
        {success && <p className="text-green-500 text-sm">Un email de réinitialisation de mot de passe a été envoyé à votre adresse email</p>}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleForgotPassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Adresse email</Label>
            <Input onChange={handleChange} className={`md:h-12 ${error ? 'border-red-500 placeholder-red-500' : ''}`} id="email" type="email" placeholder="Entrer votre adresse email" required />
          </div>
          {error && <p className="text-red-500 text-sm">Veuillez entrer une adresse email valide</p>}
          <Button type="submit" className="w-full">
            Réinitialiser le mot de passe
          </Button>
        </form>
        <div className="text-sm md:text-base mt-4">
          Vous vous en souvenez ?{" "}
          <Link href="/login" className="font-bold underline" prefetch={false}>
            Connectez-vous
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}