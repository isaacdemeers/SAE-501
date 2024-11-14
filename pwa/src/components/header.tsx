import Link from "next/link"
import { PlusCircle, Calendar, User, AlignRight } from "lucide-react"
import { abhayalibre, inter } from '@/lib/fonts'
import SearchResult from "@/components/searchResult"
import Nav from "@/components/nav"


import { Button } from "@/components/ui/button"
import SearchBar from "@/components/searchBar"

export default function Header() {
    return (
        <>
            <header className="fixed bg-slate-50 backdrop-blur-md h-20 bg-opacity-95 z-50 top-0 w-screen flex items-center justify-between px-6 py-4 border-b">
                <Link href="/" className={` transition-all transition-300ms drop-shadow-lg hover:drop-shadow-md hover:scale-110 text-4xl font-bold text-slate-600 ${abhayalibre.className}`}>
                    PlanIt
                </Link>

                <SearchBar />

                <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="icon" className="hidden sm:flex">
                        <PlusCircle className="h-5 w-5 stroke-slate-600" />
                        <span className="sr-only">Add new</span>
                    </Button>
                    <Button variant="ghost" size="icon" className="hidden sm:flex">
                        <Calendar className="h-5 w-5 stroke-slate-600" />
                        <span className="sr-only">Calendar</span>
                    </Button>
                    <div className="h-6 w-px bg-gray-200 hidden sm:flex" />
                    <Button variant="ghost" size="icon" className="hidden sm:flex">
                        <User className="h-5 w-5 stroke-slate-600" />
                        <span className="sr-only">User profile</span>
                    </Button>
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