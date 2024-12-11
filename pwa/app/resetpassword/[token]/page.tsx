'use client'
import * as React from "react"
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
import { usePathname } from "next/navigation"
import { useEffect } from "react";
import { Newpass } from "@/lib/request";
import Link from "next/link";

export default function ChangePassword(): JSX.Element {
  const [passworderror, setPassworderror] = useState<boolean>(false);
  const [passwordstrenghterror, setPasswordstrenghterror] = useState<boolean>(false);
  const [passwordsuccess, setPasswordsuccess] = useState<boolean>(false);
  const [signdata, setSigndata] = useState<{ token: string; password: string }>({ token: "", password: "" });
  const pathname = usePathname();
  useEffect(() => {
    const token = pathname.split('/').pop();
    setSigndata((prevData) => ({ ...prevData, token: token || "" }));
  }, [pathname]);

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSigndata({ ...signdata, password: e.target.value });
  };

  const handleChangePassword = async () => {
    if (signdata.password.length < 4) {
      setPasswordstrenghterror(true);
      setTimeout(() => {
        setPasswordstrenghterror(false);
      }, 5000);
      return;
    }
    let Newpassword = await Newpass(signdata);
    if (Newpassword.message === "Invalid token" || Newpassword.message === "Token is missing" || Newpassword.message === "Token is expired" || Newpassword.message === "User not found" || Newpassword.message === "Password is missing") {
      setPassworderror(true);
      setTimeout(() => {
        setPassworderror(false);
      }, 5000);
      return;
    }
    else if (Newpassword.message === "Password reset") {
      setPasswordsuccess(true);
      setPassworderror(false);
      setPasswordstrenghterror(false);
      setTimeout(() => {
        window.location.href = "/login";
        setPasswordsuccess(false);
      }, 3000);
    }
    else if (Newpassword.message === "Password must be at least 4 characters long") {
      setPassworderror(true);
      setTimeout(() => {
        setPassworderror(false);
      }, 5000);
      return;
    }

  };
  return (
    <div className="flex h-screen items-center justify-center">
      <Card className=" w-96">
        <CardHeader className="mb-5">
          <h1 className="text-4xl font-semibold leading-none tracking-tight my-5 mb-2">Change your Password</h1>
        </CardHeader>
        {passwordsuccess && <p className="text-green-600 flex items-center justify-center bg-green-300 h-full mb-5 px-4 py-2 text-base md:text-lg w-full">Le mot de passe a été modifier</p>}
        {passwordstrenghterror && <p className="text-red-600 flex items-center justify-center bg-red-300 h-full px-4 py-2 mb-10 text-base md:text-lg w-full">Le mot de apsse doit contenir au moins 4 caractères</p>}
        {passworderror && <div className="flex flex-wrap flex-col"><p className="text-red-600 flex items-center justify-center bg-red-300 h-full px-4 py-2 text-base md:text-lg w-full">le token peut être expiré, essayez de renvoyer un email à <span className="underline"><Link href={"https://scaling-disco-jj5v6vp6rg97hq64r-443.app.github.dev/login/forgotpassword"}>ce lien</Link></span></p> </div>}
        <CardContent className="pb-2">
          <form>
            <div className="grid w-full items-center gap-6">
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password" className="md:text-base">
                    Nouveau mot de passe*
                  </Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="&#x25CF;&#x25CF;&#x25CF;&#x25CF;&#x25CF;&#x25CF;&#x25CF;"
                  required
                  className={`md:h-12 text-xs ${passworderror ? 'border-red-500 placeholder-red-500' : ''}`}
                  onChange={handlePassword}
                />
                <PasswordStrengthBar password={signdata.password} />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 justify-between">
          <Button size={"lg"} onClick={() => { handleChangePassword(); }} className="w-full md:text-lg">
            Changer mon mot de passe
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}