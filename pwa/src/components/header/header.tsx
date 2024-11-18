import Link from "next/link"
import { PlusCircle, Calendar, User, AlignRight } from "lucide-react"
import { abhayalibre, inter } from '@/lib/fonts'
import SearchResult from "@/components/search/searchResult"
import Nav from "@/components/header/headerNav"


import { Button } from "@/components/ui/button"
import SearchBar from "@/components/search/searchBar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, Settings, UserIcon } from "lucide-react"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

export default function Header() {
    return (
        <>
            <header className="fixed left-0 bg-slate-50 backdrop-blur-lg h-20 bg-opacity-90 z-50 top-0 w-screen flex items-center justify-between px-6 py-4 border-b shadow-sm">
                <Link href="/" className={` transition-all transition-300ms drop-shadow-lg hover:drop-shadow-md hover:scale-110 text-4xl font-bold text-slate-600 ${abhayalibre.className}`}>
                    PlanIt
                </Link>

                <SearchBar />

                <div className="flex items-center space-x-4">
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
                                    <Calendar className="h-5 w-5 stroke-slate-600" />
                                    <span className="sr-only">Calendar</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Mon Calendrier</p>
                            </TooltipContent>
                        </Tooltip>

                        <div className="h-6 w-px bg-gray-200 hidden sm:flex" />

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <DropdownMenu >
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="hidden sm:flex">
                                            <User className="h-5 w-5 stroke-slate-600" />
                                            <span className="sr-only">User profile</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className=" translate-x-2 rounded-lg w-56 bg-slate-50 bg-opacity-80 backdrop-blur-lg" align="end">
                                        <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>
                                            <UserIcon className="mr-2 h-4 w-4" />
                                            <span>Profil</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Settings className="mr-2 h-4 w-4" />
                                            <span>Paramètres</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-red-600">
                                            <LogOut className="mr-2 h-4 w-4" />
                                            <span>Déconnexion</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TooltipTrigger>
                            <TooltipContent >
                                <p>Profil utilisateur</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <Button variant="ghost" size="icon" className="flex sm:hidden">
                        {/* <AlignRight className="h-5 w-5 stroke-slate-600" /> */}
                        <Nav />

                        <span className="sr-only">mobile menu</span>

                    </Button>

                </div>

            </header>
            <SearchResult />
        </>
    )
}