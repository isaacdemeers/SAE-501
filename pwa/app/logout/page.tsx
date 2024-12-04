'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function LogoutPage() {
    const router = useRouter()
    const { toast } = useToast()

    useEffect(() => {
        const logout = async () => {
            try {
                const response = await fetch('/api/auth/logout', {
                    method: 'POST',
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error('Logout failed');
                }

                // Force le rafraîchissement du cache de l'application
                await fetch('/api/auth/validate-token', {
                    method: 'POST',
                    credentials: 'include',
                });

                // Redirection vers la page d'accueil
                router.push('/')
                router.refresh() // Force le rafraîchissement des composants

                toast({
                    title: "Déconnexion réussie",
                    description: "À bientôt !",
                })
            } catch (error) {
                console.error('Logout error:', error)
                toast({
                    variant: "destructive",
                    title: "Erreur lors de la déconnexion",
                    description: "Veuillez réessayer.",
                })
                router.push('/')
            }
        }

        logout()
    }, [router, toast])

    return (
        <div className="h-screen w-screen flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
                <p className="text-slate-600">Déconnexion en cours...</p>
            </div>
        </div>
    )
} 