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
import PasswordStrengthBar from 'react-password-strength-bar';
 
interface SigninformProps {
  handleSignData: (data: { email: string; password: string }) => void;
}

export default function Signinform({ handleSignData }: SigninformProps): JSX.Element {
  const [loginerror, setLoginerror] = useState<boolean>(false);
  const [signdata, setSigndata] = useState<{ email: string; password: string }>({ email: "", password: "" });

const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSigndata({ ...signdata, email: e.target.value });
  };

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSigndata({ ...signdata, password: e.target.value });
  };

  const handleLogin = (): void => {
    if (!emailRegex.test(signdata.email) || signdata.password === "") {
        (document.getElementById('email') as HTMLInputElement).value = "";
        (document.getElementById('password') as HTMLInputElement).value = "";
      setLoginerror(true);
      setTimeout(() => {
        setLoginerror(false);
    }, (5000));  
      return;
    }
    handleSignData(signdata);
  }; 

  return (
    <Card className="w-full lg:w-[450px]">
      <CardHeader className="mb-10">
        <h1 className="text-4xl font-semibold leading-none tracking-tight my-5 mb-2">Sign Up to [name of the app]</h1>
        <p className="text-sm md:text-base text-gray-400">Don’t wait sign up today because [app name] is completely free forever !</p>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-6">
            {/* <div className="flex flex-col space-y-1.5">
              <Button variant="outline" size="lg" className="w-full font-bold text-lg">
                Sign Up with Google
              </Button>
            </div>
            <p className="flex items-center justify-center w-full text-gray-500 my-2">
              <span className="flex-grow border-t border-gray-300"></span>
              <span className="mx-2">or continue with</span>
              <span className="flex-grow border-t border-gray-300"></span>
            </p> */}
            {loginerror ? (
              <div className="text-red-600 flex items-center justify-center bg-red-300 h-12 text-base md:text-lg w-full">
                Invalid email or password
              </div>
            ) : null}
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email" className="md:text-base">
                Email*
              </Label>
              <Input
                id="email"
                className={`md:h-12 ${loginerror ? 'border-red-500 placeholder-red-500' : ''}`}
                placeholder="John.Doe@gmail.com"
                onChange={handleEmail}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password" className="md:text-base">
                  Password*
                </Label>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="&#x25CF;&#x25CF;&#x25CF;&#x25CF;&#x25CF;&#x25CF;&#x25CF;"
                required
                className={`md:h-12 ${loginerror ? 'border-red-500 placeholder-red-500' : ''}`}
                onChange={handlePassword}
              />
               <PasswordStrengthBar password={signdata.password} />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 justify-between">
        <Button size={"lg"} onClick={() => {  handleLogin(); }} className="w-full md:text-lg">
        Sign Up
        </Button>
        <div className="mt-4 text-center text-sm md:text-md">
          Already have an account ?{" "}
          <Link href="/login" className="underline font-bold">
           Log in
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}