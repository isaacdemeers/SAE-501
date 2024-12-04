'use client'

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { ArrowLeft, Home } from "lucide-react"
import Link from "next/link"
import { abhayalibre } from "@/lib/fonts"

export default function NotFound() {
    const router = useRouter()

    return (
        <div className="h-screen w-screen flex flex-col gap-8 items-center justify-center">
            <Link href="/" className={`drop-shadow-lg text-6xl font-bold text-slate-600 mb-8 ${abhayalibre.className}`}>
                <p className="transition-all transition-300ms hover:scale-105 hover:drop-shadow-md">
                    PlanIt
                </p>
            </Link>
            <Card className="p-8 flex flex-col items-center justify-center gap-4 max-w-md">

                <h1 className="text-6xl font-bold text-slate-800">404</h1>
                <h2 className="text-2xl font-semibold text-slate-600">Page introuvable</h2>
                <p className="text-slate-500 text-center">
                    Désolé, la page que vous recherchez n&apos;existe pas ou a été déplacée.
                </p>
                <div className="flex gap-4 mt-4">
                    <Button
                        variant="outline"
                        onClick={() => router.back()}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Retour
                    </Button>
                    <Link href="/">
                        <Button className="flex items-center gap-2">
                            <Home className="w-4 h-4" />
                            Accueil
                        </Button>
                    </Link>
                </div>
            </Card>
        </div>
    )
} 