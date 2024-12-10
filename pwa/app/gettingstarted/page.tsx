"use client"

import Image from "next/image"
import Background from "@images/bg.svg"
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {

    const steps = [
        { title: "Créer un événement", description: "Créez un événement pour commencer à planifier vos événements." },
        { title: "Inviter des amis", description: "Invitez vos amis à l'événement pour les encourager à venir." },
        { title: "Suivre l'avancée", description: "Suivez l'avancée de l'événement et les invitations envoyées." },
    ]


    return (
        <section className="w-screen h-screen flex items-center justify-center relative">
            <Image src={Background} alt="Background" className="absolute top-0 left-0 w-full h-full" />
            <div className="w-screen h-screen bg-slate-100 bg-opacity-65  backdrop-blur-3xl flex items-center justify-center">
                <div className="flex items-center justify-center bg-white bg-opacity-20 backdrop-blur-3xl w-1/2 h-1/2 rounded-3xl shadow-2xl">
                    <ul>
                        {steps.map((step, index) => (
                            <li key={index}>
                                <Button>
                                    {step.title}
                                </Button>
                            </li>
                        ))}
                    </ul>

                </div>
            </div>
        </section>
    );
}

