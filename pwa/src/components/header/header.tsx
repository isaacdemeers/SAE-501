import Link from "next/link"
import { PlusCircle, Calendar, User, AlignRight } from "lucide-react"
import { abhayalibre, inter } from '@/lib/fonts'
import SearchResult from "@/components/search/searchResult"
import Nav from "@/components/header/headerNav"


import { Button } from "@/components/ui/button"
import SearchBar from "@/components/search/search"
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
            <header className="fixed  left-0 bg-slate-50 bg-opacity-80 backdrop-blur-lg h-20  z-50 top-0 w-screen flex items-center justify-between px-6 py-4 border-b shadow-sm">
                <Link href="/" className={`  drop-shadow-lg   text-3xl font-bold text-slate-600 w-full flex   items-center justify-start ${abhayalibre.className}`}>
                    <p className="transition-all transition-300ms w-fit hover:scale-105 x hover:drop-shadow-md ">PlanIt</p>
                </Link>

                <SearchBar />

                <div className="flex items-center w-full gap-2 justify-end">
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

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <DropdownMenu >
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="hidden sm:flex">
                                            <User className="h-5 w-5 stroke-slate-600" />
                                            <span className="sr-only">User profile</span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className=" translate-x-2 rounded-lg w-56 bg-slate-50 bg-opacity-90 backdrop-blur-lg" align="end">
                                        <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>
                                            <Link href="/account" className="flex items-center justify-start gap-2">
                                                <UserIcon className="mr-2 h-4 w-4" />
                                                <span>Profil</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Link href="/settings" className="flex items-center justify-start gap-2">
                                                <Settings className="mr-2 h-4 w-4" />
                                                <span>Paramètres</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-red-600">
                                            <Link href="/logout" className="flex items-center justify-start gap-2">
                                                <LogOut className="mr-2 h-4 w-4" />
                                                <span>Déconnexion</span>
                                            </Link>
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
        </>
    )
}