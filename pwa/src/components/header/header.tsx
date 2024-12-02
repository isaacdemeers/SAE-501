'use client'

import Link from "next/link"
import { PlusCircle, Calendar, User, AlignRight } from "lucide-react"
import { abhayalibre } from '@/lib/fonts'
import SearchResult from "@/components/search/searchResult"
import Nav from "@/components/header/headerNav"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import SearchBar from "@/components/search/search"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

interface AuthResponse {
    isValid: boolean;
    user: {
        email: string;
        id: number;
        username: string;
    };
}

export default function Header() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const authenticateUser = async () => {
            try {
                const response = await fetch('/api/auth/validate-token', {
                    method: 'POST',
                    credentials: 'include',
                });

                const data: AuthResponse = await response.json();
                setIsAuthenticated(data.isValid);
            } catch (error) {
                console.error('Authentication error:', error);
                setIsAuthenticated(false);
            }
        };

        authenticateUser();
    }, []);

    return (
        <header className="fixed left-0 bg-slate-50 bg-opacity-80 backdrop-blur-lg h-20 z-50 top-0 w-screen flex items-center justify-between px-6 py-4 border-b shadow-sm">
            <Link href="/" className={`drop-shadow-lg text-3xl font-bold text-slate-600 w-full flex items-center justify-start ${abhayalibre.className}`}>
                <p className="transition-all transition-300ms w-fit hover:scale-105 x hover:drop-shadow-md">PlanIt</p>
            </Link>

            <SearchBar />

            <div className="flex items-center w-full gap-2 justify-end">
                {isAuthenticated ? (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="hidden sm:flex">
                                    <PlusCircle className="h-5 w-5 stroke-slate-600" />
                                    <span className="sr-only">Add new</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Nouvel événement</p>
                            </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="hidden sm:flex">
                                    <Link href="/calendar">
                                        <Calendar className="h-5 w-5 stroke-slate-600" />
                                        <span className="sr-only">Calendar</span>
                                    </Link>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Mon Calendrier</p>
                            </TooltipContent>
                        </Tooltip>

                        <div className="h-6 w-px bg-gray-200 hidden sm:flex" />
                    </TooltipProvider>
                ) : (
                    <div className="hidden sm:flex gap-2">
                        <Link href="/login">
                            <Button variant="outline">Connexion</Button>
                        </Link>
                        <Link href="/signin">
                            <Button>Commencer</Button>
                        </Link>
                    </div>
                )}

                <Nav isAuthenticated={isAuthenticated} />
            </div>
        </header>
    )
}