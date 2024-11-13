"use client"

import * as React from "react"
import { Search } from "lucide-react"
import Image from 'next/image'
import commandIcon from '@/assets/icons/commandk.svg'


import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"



export default function SearchBar() {
    const [open, setOpen] = React.useState(false)

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
                const input = document.querySelector<HTMLInputElement>("#search")
                input?.focus()
                input?.select()
            }
            //echap
            else if (e.key === "Escape") {
                e.preventDefault()
                setOpen((open) => !open)
                const input = document.querySelector<HTMLInputElement>("#search")
                input?.blur()
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    React.useEffect(() => {
        const input = document.querySelector<HTMLInputElement>("#search");
        const bar = document.querySelector<HTMLDivElement>("#searchBar");
        const s = document.querySelector<HTMLDivElement>("#sideShow");




        const handleFocus = () => {
            bar?.classList.add("active");
            s?.classList.add("active");
        };

        const handleBlur = () => {
            bar?.classList.remove("active");
            s?.classList.remove("active");

        };

        // Ajouter les gestionnaires d'événements
        input?.addEventListener("focus", handleFocus);
        input?.addEventListener("blur", handleBlur);

        // Nettoyer les événements lors du démontage
        return () => {
            input?.removeEventListener("focus", handleFocus);
            input?.removeEventListener("blur", handleBlur);
        };
    }, []);

    return (
        <div id="searchBar" className="  border-slate-200  w-60 transition-all transition-200ms bg-white border-[1px] px-2 rounded-md hidden items-center justify-center gap-2 sm:flex">
            <Search size={25} className=" stroke-slate-600" />
            <input type="text" name="search" id="search" placeholder="Search..." className="ring-none placeholder:text-slate-600 text-slate-600 w-full border-none text-ellipsis" />
            <Image src={commandIcon} className="stroke-slate-600" alt="commandk" width={30} height={30} />
        </div>
    )
}