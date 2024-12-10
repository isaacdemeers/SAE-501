'use client'

import Link from "next/link"
import { PlusCircle, Calendar, User, AlignRight } from "lucide-react"
import { abhayalibre } from '@/lib/fonts'
import SearchResult from "@/components/search/searchResult"
import Nav from "@/components/header/headerNav"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import SearchBar from "@/components/search/search"
import EventForm from '@/components/events/eventForm'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, Settings, UserIcon } from "lucide-react"
import { useRouter } from "next/navigation"

interface AuthResponse {
    isValid: boolean;
    user: {
        email: string;
        id: number;
        username: string;
    };
}

export default function Header() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showEventForm, setShowEventForm] = useState(false);

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

    const handleEventCreated = () => {
        setShowEventForm(false);
        router.push('/?refresh=' + Date.now());
    };

    return (
        <>
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
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="hidden sm:flex"
                                        onClick={() => setShowEventForm(true)}
                                    >
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

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="hidden sm:flex">
                                        <User className="h-5 w-5 stroke-slate-600" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end">
                                    <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href="/account" className="flex items-center cursor-pointer">
                                            <UserIcon className="mr-2 h-4 w-4" />
                                            <span>Profil</span>
                                        </Link>
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-red-600" asChild>
                                        <Link href="/logout" className="flex items-center cursor-pointer">
                                            <LogOut className="mr-2 h-4 w-4" />
                                            <span>Déconnexion</span>
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
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

            <Dialog open={showEventForm} onOpenChange={setShowEventForm}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
                    <DialogHeader className="px-6 py-4 sticky top-0 bg-white border-b">
                        <DialogTitle className="text-xl">Créer un événement</DialogTitle>
                    </DialogHeader>
                    <div className="px-6 py-4">
                        <EventForm onClose={handleEventCreated} />
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}