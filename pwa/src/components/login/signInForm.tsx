'use client'
import * as React from "react"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import PasswordStrengthBar from 'react-password-strength-bar';
import { TestEmail } from "@/lib/request"
import { EyeIcon, EyeOffIcon } from "lucide-react"

interface SigninformProps {
  handleSignData: (data: { email: string; password: string }) => void;
}

export default function Signinform({ handleSignData }: SigninformProps): JSX.Element {
  const [loginerror, setLoginerror] = useState<boolean>(false);
  const [signdata, setSigndata] = useState<{ email: string; password: string }>({ email: "", password: "" });
  const [emailerror, setEmailerror] = useState<boolean>(false);
  const [termserror, setTermserror] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSigndata({ ...signdata, email: e.target.value });
  };

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSigndata({ ...signdata, password: e.target.value });
  };

  const handleLogin = async () => {
    let Terms = document.getElementById('terms');
    if (!emailRegex.test(signdata.email) || signdata.password === "") {
      (document.getElementById('email') as HTMLInputElement).value = "";
      (document.getElementById('password') as HTMLInputElement).value = "";
      setLoginerror(true);
      setTimeout(() => {
        setLoginerror(false);
      }, (5000));
      return;
    }
    else if (Terms && Terms.getAttribute('data-state') === 'unchecked') {
      setTermserror(true);
      setTimeout(() => {
        setTermserror(false);
      }, 5000);
      return;
    }
    let verify = await TestEmail(signdata.email);
    if (verify.message === "Email already exists") {
      setEmailerror(true);
      setTimeout(() => {
        setEmailerror(false);
      }, 5000);
      return;
    }
    else if (verify.message === "OK") {
      handleSignData(signdata);
    }
  };

  return (
    <Card className="w-full lg:w-[450px]">
      <CardHeader className="mb-10">
        <h1 className="text-4xl font-semibold leading-none tracking-tight my-5 mb-2">S'inscrire sur PlanIt</h1>
        <p className="text-sm md:text-base text-gray-400">N'attendez pas, inscrivez-vous dès aujourd'hui car Planit est complètement gratuit pour toujours !</p>
      </CardHeader>
      <CardContent className="pb-2">
        <form>
          <div className="grid w-full items-center gap-6">
            {emailerror ? (
              <div className="text-red-600 flex items-center justify-center bg-red-300 h-full px-4 py-2 text-base md:text-lg w-full">
                Un compte exite déjà avec cet email
              </div>
            ) : null}
            {loginerror ? (
              <div className="text-red-600 flex items-center justify-center bg-red-300 h-12 text-base md:text-lg w-full">
                Email ou mot de passe incorrect
              </div>
            ) : null}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email" className="md:text-base">
                Email*
              </Label>
              <Input
                id="email"
                className={`md:h-12 ${loginerror ? 'border-red-500 placeholder-red-500' : ''}`}
                placeholder="your@email.com"
                onChange={handleEmail}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="md:text-base">
                  Créer un mot de passe*
                </Label>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password..."
                  required
                  className={`md:h-12 text-xs ${loginerror ? 'border-red-500 placeholder-red-500' : ''}`}
                  onChange={handlePassword}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              <PasswordStrengthBar password={signdata.password} />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 justify-between">
        <Button size={"lg"} onClick={() => { handleLogin(); }} className="w-full md:text-lg">
          S'inscrire
        </Button>
        <div className="flex items-center justify-center space-x-2">
          <Checkbox id="terms" className={`${termserror ? 'border-red-500' : 'border-black'}`} />
          <label
            htmlFor="terms"
            className={`text-sm md:text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70`}
          >
            J'accepte les <span><Link className={`appearance-none text-black underline`} href="/cgu">Conditions d'utilisation</Link></span> et la <span><Link className={`appearance-none text-black underline`} href="/confidentiality">Politique de confidentialité</Link></span>
          </label>
        </div>
        {termserror ? (
          <div className="flex items-center justify-center space-x-2 text-red-600 text-sm md:text-base w-full">
            Veuillez accepter les conditions d'utilisation et la politique de confidentialité
          </div>
        ) : null}
        <div className="mt-4 text-center text-sm md:text-md">
          Déjà un compte ?{" "}
          <Link href="/login" className="underline font-bold">
            Se connecter
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}