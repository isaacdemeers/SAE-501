'use client'
import SignInForm from "@/components/login/signInForm";
import { useState } from "react";
import PersonnalInfo from "@/components/login/personnalInfo";
import Addimage from "@/components/login/imageProfile";
import SignRecap from "@/components/login/signInRecap";
import { AddUser } from "@/lib/request";
import { useEffect } from "react";
import { IsAuthentificated , LoginUser } from "@/lib/request";
import { useRouter } from 'next/navigation';

interface SignData {
    [key: string]: any;
    image?: File;
}

export default function Signin() {
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [signdata, setSigndata] = useState<SignData>({});
    const [personnalinfo, setPersonnalinfo] = useState<boolean>(false);
    const [addimage, setAddimage] = useState<boolean>(false);
    const [recap, setRecap] = useState<boolean>(false);

    useEffect(() => {
        async function checkAuth() {
            const isAuth = await IsAuthentificated();
            if (isAuth.isValid === true) {
                router.push('/');
            } else {
                setLoading(false); // Arrêtez le loader si non authentifié
            }
        }
        checkAuth();
    }, [router]);

    if (loading) {
        return <div>Loading...</div>; // Loader temporaire
    }

    const handleSignData = (data: SignData) => {
        setSigndata((prevData: SignData) => ({ ...prevData, ...data }));
        setPersonnalinfo(true);
    };

    const handlePersonnalData = (data: SignData) => {
        setSigndata((prevData: SignData) => ({ ...prevData, ...data }));
        setAddimage(true);
    };

    const handleImageData = (data: File) => {
        setSigndata((prevData: SignData) => ({ ...prevData, image: data }));
    }

    const handleRecap = () => {
        if (recap == true) {
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
        const data = await AddUser(signdata);
        if (data.message === "User created successfully") {
            const auth = await LoginUser(signdata);
             router.push('/login');
        }
    }

    return (
        <div className="w-full h-full flex items-center justify-center p-10">
            {recap ? (
                <div>
                    <SignRecap signdata={signdata} pushdata={pushdata} handleRecap={handleRecap} />
                </div>
            ) : personnalinfo == false ? (
                <div>
                    <SignInForm handleSignData={handleSignData} />
                </div>
            ) : addimage == false ? (
                <div>
                    <PersonnalInfo signdata={signdata} handlePersonnalData={handlePersonnalData} />
                </div>
            ) : (
                <div>
                    <Addimage signdata={signdata} handleImageData={handleImageData} handleRecap={handleRecap} handleBack={handleBack} />
                </div>
            )}
        </div>
    );
}
