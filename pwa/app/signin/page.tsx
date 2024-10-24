'use client'
import Signinform from "@/components/Signinform";
import { useState } from "react";
import Personnalinfo from "@/components/personnalinfo";
import Addimage from "@/components/ImageProfile";
import SignRecap from "@/components/SignRecap";
import { AddUser } from "@/lib/request";
interface SignData {
    [key: string]: any;
    image?: File;
}

export default function Signin() {
    const [signdata, setSigndata] = useState<SignData>({});
    const [personnalinfo, setPersonnalinfo] = useState<boolean>(false);
    const [addimage, setAddimage] = useState<boolean>(false);
    const [recap, setRecap] = useState<boolean>(false);

    const handleSignData = (data: SignData) => {
        setSigndata((prevData: SignData) => ({ ...prevData, ...data }));
        console.log("Data from child:", data);
        setPersonnalinfo(true);
    };

    const handlePersonnalData = (data: SignData) => {
        setSigndata((prevData: SignData) => ({ ...prevData, ...data }));
        console.log("Personnal data from child:", data);
        setAddimage(true);
    };

    const handleImageData = (data: File) => {
        setSigndata((prevData: SignData) => ({ ...prevData, image: data }));
        console.log("Image data from child:", data);
        console.log(signdata);
    }

    const handleRecap = () => {
        if(recap == true) {
            setRecap(false);
            return;
        }
        setRecap(true);
    }

    const handleBack = () => {
        setAddimage(false);
    }

    const pushdata = async () => {
            const formData = new FormData();
            Object.entries(signdata).forEach(([key, value]) => {
                formData.append(key, value instanceof File ? value : String(value));
            });
            console.log(formData);
            const data = await AddUser(signdata);
            if(data.message === "User created successfully"){
                window.location.href = "/";
            }
        } 

    return (
        <>
            {recap ? (
                <div>
                    <SignRecap signdata={signdata} pushdata={pushdata} handleRecap={handleRecap}/>
                </div>
            ) : personnalinfo == false ? (
                <div>
                    <Signinform handleSignData={handleSignData} />
                </div>
            ) : addimage == false ? (
                <div>
                    <Personnalinfo signdata={signdata} handlePersonnalData={handlePersonnalData} />
                </div>
            ) : (
                <div>
                    <Addimage signdata={signdata} handleImageData={handleImageData} handleRecap={handleRecap} handleBack={handleBack} />
                </div>
            )}
        </>
    );
}
