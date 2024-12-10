"use client"

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { abhayalibre, inter } from "@/lib/fonts";
import Link from "next/link";

export default function Page() {
    const features = [
        {
            title: "Calendrier Partagé",
            description: "Créez et partagez des événements avec vos amis, votre famille ou vos collègues.",
            icon: "📅"
        },
        {
            title: "Planification Simplifiée",
            description: "Trouvez facilement le meilleur moment pour vos réunions et événements.",
            icon: "✨"
        },
        {
            title: "Notifications",
            description: "Recevez des rappels pour ne jamais manquer un événement important.",
            icon: "🔔"
        },
        {
            title: "Synchronisation",
            description: "Synchronisez vos événements sur tous vos appareils.",
            icon: "🔄"
        }
    ];

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 min-h-screen flex flex-col">
            <Link href="/" className={`drop-shadow-lg text-3xl font-bold text-slate-600 w-full flex items-center justify-start ${abhayalibre.className}`}>
                <p className="transition-all transition-300ms w-fit hover:scale-105 x hover:drop-shadow-md">PlanIt</p>
            </Link>
            <p className="text-xl mb-8">PlanIt est un calendrier partagé pour planifier vos événements simplement et efficacement.</p>

            <div className="flex-1 flex items-center">
                <Carousel className="w-full">
                    <CarouselContent>
                        {features.map((feature, index) => (
                            <CarouselItem key={index}>
                                <FeatureCard {...feature} />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </div>
        </div>
    );
}

function FeatureCard({ title, description, icon }: { title: string, description: string, icon: string }) {
    return (
        <div className="p-8 border rounded-lg shadow-sm hover:shadow-md transition-shadow h-[400px] flex flex-col items-center justify-center text-center">
            <div className="text-6xl mb-6">{icon}</div>
            <h3 className="text-2xl font-semibold mb-4">{title}</h3>
            <p className="text-gray-600 text-lg">{description}</p>
        </div>
    );
}