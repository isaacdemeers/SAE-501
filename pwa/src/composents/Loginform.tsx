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
import { redirect, usePathname } from "next/navigation"
import { LoginUser } from "@/lib/request"


export default function Loginform(): JSX.Element {
  const [loginerror, setLoginerror] = useState<boolean>(false);
  const [logdata, setLogdata] = useState<{ email: string; password: string }>({ email: "", password: "" });
const pathname = usePathname();

const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setLogdata({ ...logdata, email: e.target.value });
  };

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setLogdata({ ...logdata, password: e.target.value });
  };

    const handleLogin = async() => {
      if (!emailRegex.test(logdata.email) || logdata.password === "") {
        errorlog();
        return;
      }
      let log = await LoginUser(logdata);
      console.log(log)
      if(log.message === "Invalid credentials."){
        errorlog();
      }
      else if (log.message === "Authentication successful"){
       window.location.href = "/";
      }
    }; 
  // function to handle the error message when the user input is in
  const errorlog = (): void => {
    setLoginerror(true);
    setLogdata({ email: "", password: "" });
    (document.getElementById('email') as HTMLInputElement).value = "";
    (document.getElementById('password') as HTMLInputElement).value = "";
    setTimeout(() => {
      setLoginerror(false);
    }, 5000);
  };

  return (
    <Card className="w-full  md:w-[450px]">
      <CardHeader>
        <h1 className="text-4xl font-semibold leading-none tracking-tight my-5">Welcome back to [name of the app]</h1>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-6">
            {/* <div className="flex flex-col space-y-1.5">
              <Button variant="outline" size="lg" className="w-full font-bold text-lg">
                Login with Google
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
                Email
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
                  Password
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
              <Link href={`${pathname}/forgotpassword`} className="text-gray-500 pl-2 text-sm">
                Forgot your password?
              </Link>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 justify-between">
        <Button size={"lg"} onClick={() => {  handleLogin(); }} className="w-full md:text-lg">
          Login
        </Button>
        <div className="mt-4 text-center text-sm md:text-md">
          Not registered yet?{" "}
          <Link href="/signin" className="underline font-bold">
            Sign up
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}