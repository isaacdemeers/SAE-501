"use client"

import Image from "next/image"
import Background from "@images/bg.svg"
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { abhayalibre, inter } from "@/lib/fonts";
import { spawn } from "child_process";

export default function Page() {
    const router = useRouter();

    const steps = [
        { title: "Bienvenue sur PlanIt", description: "L'agenda partagé pour tous vos événements.", button: "Commencer" },
        { title: "Créer et collaborer", description: "Créez et participez à des événements avec vos amis ou contacts.", button: "Suivant" },
        { title: "Inviter", description: "Invitez vos amis ou contacts à l'événement pour gérer vos événements ensemble.", button: "Suivant" },
        { title: "Accéder à PlanIt", description: `En continuant, vous acceptez les `, terms: <Link href="/cgu" className="font-bold text-slate-700">termes et conditions.</Link>, button: "Accéder à PlanIt" },
    ];

    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        if (currentStep === steps.length) {
            router.push("/");
        }
    }, [currentStep, router]);

    const handleNextStep = () => {
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    function Step({ title, description, index, button, terms }: { title: string; description: string; index: number; button: string; terms: React.ReactNode }) {
        console.log(currentStep, index)
        return (
            <li className={`w-[40rem] absolute top-0 left-0 gap-6 flex-col h-full flex items-center justify-between px-8 py-10 rounded-3xl  ${currentStep > index ? "-translate-x-full " : currentStep === index ? `translate-x-0 active` : "translate-x-full blur-3xl"} transition-all duration-300 `}>
                <div className="flex w-full h-full flex-col gap-2 items-center justify-center">
                    <h1 className={`text-5xl mt-10 text-slate-700 font-bold ${abhayalibre.className}`}>{title}</h1>
                    <p className={`text-sm text-gray-500 ${inter.className}`}>
                        {description} {terms}
                    </p>

                </div>

                <Button onClick={handleNextStep} className={`rounded-lg mt-4 bg-blue-500 text-white shadow-lg hover:bg-blue-600 transition-all duration-300 ${currentStep === index ? "bg-blue-600" : ""}`}>
                    {button}
                </Button>
            </li>
        );
    }

    return (
        <section className="w-screen h-screen flex items-center justify-center relative">
            <Image src={Background} alt="Background" className="absolute top-0 left-0 w-full h-full" />
            <div className="w-screen h-screen bg-slate-100 bg-opacity-65 backdrop-blur-3xl flex items-center justify-center">
                <div className={` ${currentStep === 4 ? 'blur-2xl opacity-0' : ''} flex items-center justify-start bg-slate-50 bg-opacity-20 overflow-hidden backdrop-blur-3xl w-[40rem] h-1/2 rounded-3xl shadow-2xl transition-all duration-500`}>
                    <ul className="w-full h-full relative flex  rounded-3xl ">
                        {steps.map((step, index) => (
                            <Step key={index} title={step.title} description={step.description} index={index} button={step.button} terms={step.terms} />
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}

