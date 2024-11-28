'use client'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AlignRight, Calendar, CirclePlus, Search, Settings, User, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function Nav() {
    const [isOpen, setIsOpen] = useState(false)

    let elementStyle = `flex items-center gap-4 delay-300 duration-300 p-4 origin-center  ${isOpen ? "opacity-100 blur-0  scale-100" : "opacity-0 blur-md "}`


    // if (isOpen) {
    //     document.body.style.overflow = 'hidden'
    // } else {
    //     document.body.style.overflow = 'auto'
    // }
    return (
        <>
            {isOpen ? <X onClick={() => setIsOpen(false)} className="h-5 w-5 stroke-slate-600" /> : <AlignRight onClick={() => setIsOpen(!isOpen)} className="h-5 w-5 stroke-slate-600" />}

            <nav className={`bg-white transition-all ${isOpen ? 'translate-y-0' : 'translate-y-full'} absolute left-0 top-0 z-30 h-screen mt-20 w-screen flex flex-col `}>
                <ul className="flex flex-col items-start justify-center opacity-100  p-4">
                    <li className={elementStyle}>
                        <h3 className="text-3xl font-bold text-slate-600 mb-4">Compte</h3>
                    </li>
                    <li className={elementStyle}>
                        <User className="h-8 w-8 stroke-slate-600" />
                        <Link className={`text-xl font-bold text-slate-600 `} href="/">Mon Profil</Link>
                    </li>
                    <li className={elementStyle}>
                        <Settings className="h-8 w-8 stroke-slate-600" />
                        <Link className={`text-xl font-bold text-slate-600 `} href="/">Paramètres</Link>
                    </li>

                </ul>
                <ul className="flex flex-col items-start justify-center  p-4">
                    <li className={elementStyle}>
                        <h3 className="text-3xl font-bold text-slate-600 mb-4">Agenda</h3>
                    </li>
                    <li className={elementStyle}>
                        <Calendar className="h-8 w-8 stroke-slate-600" />
                        <Link className={`text-xl font-bold text-slate-600 `} href="/calendar">Mon Agenda</Link>
                    </li>
                    <li className={elementStyle}>
                        <CirclePlus className="h-8 w-8 stroke-slate-600" />
                        <Link className={`text-xl font-bold text-slate-600 `} href="/">Ajouter un Evenement</Link>
                    </li>
                    <li className={elementStyle}>
                        <Search className="h-8 w-8 stroke-slate-600" />
                        <Link className={`text-xl font-bold text-slate-600 `} href="/">Rechercher</Link>
                    </li>

                </ul>
            </nav>

        </>
    )
}
