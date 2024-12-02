'use client'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { AlignRight, Calendar, CirclePlus, Search, Settings, User, X } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

interface AuthResponse {
    isValid: boolean;
    user: {
        email: string;
        id: number;
        username: string;
    };
}

interface NavProps {
    isAuthenticated: boolean;
}

export default function Nav({ isAuthenticated }: NavProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [username, setUsername] = useState<string>('');

    useEffect(() => {
        if (isAuthenticated) {
            const fetchUsername = async () => {
                try {
                    const response = await fetch('/api/auth/validate-token', {
                        method: 'POST',
                        credentials: 'include',
                    });
                    const data: AuthResponse = await response.json();
                    if (data.user?.username) {
                        setUsername(data.user.username);
                    }
                } catch (error) {
                    console.error('Error fetching username:', error);
                }
            };
            fetchUsername();
        }
    }, [isAuthenticated]);

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="flex sm:hidden">
                    <AlignRight className="h-5 w-5 stroke-slate-600" />
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>{isAuthenticated ? `Bonjour, ${username}` : 'Menu'}</SheetTitle>
                </SheetHeader>

                {isAuthenticated ? (
                    // Menu pour utilisateurs connectés
                    <div className="flex flex-col gap-4 mt-8">
                        <div className="flex flex-col gap-2">
                            <h3 className="text-lg font-semibold text-slate-600">Compte</h3>
                            <Link href="/profile" className="flex items-center gap-2 text-slate-600 hover:text-slate-900">
                                <User className="h-5 w-5" />
                                Mon Profil
                            </Link>
                            <Link href="/settings" className="flex items-center gap-2 text-slate-600 hover:text-slate-900">
                                <Settings className="h-5 w-5" />
                                Paramètres
                            </Link>
                        </div>

                        <div className="flex flex-col gap-2">
                            <h3 className="text-lg font-semibold text-slate-600">Agenda</h3>
                            <Link href="/calendar" className="flex items-center gap-2 text-slate-600 hover:text-slate-900">
                                <Calendar className="h-5 w-5" />
                                Mon Agenda
                            </Link>
                            <Link href="/events/new" className="flex items-center gap-2 text-slate-600 hover:text-slate-900">
                                <CirclePlus className="h-5 w-5" />
                                Nouvel Événement
                            </Link>
                            <Link href="/search" className="flex items-center gap-2 text-slate-600 hover:text-slate-900">
                                <Search className="h-5 w-5" />
                                Rechercher
                            </Link>
                        </div>
                    </div>
                ) : (
                    // Menu pour visiteurs
                    <div className="flex flex-col gap-4 mt-8">
                        <Link href="/login">
                            <Button className="w-full" variant="outline">
                                Connexion
                            </Button>
                        </Link>
                        <Link href="/signin">
                            <Button className="w-full">
                                Commencer
                            </Button>
                        </Link>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    )
}
