"use client"

import * as React from "react"
import { Search } from "lucide-react"
import Image from 'next/image'



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
        // const s = document.querySelector<HTMLDivElement>("#sideShow");




        const handleFocus = () => {
            bar?.classList.add("active");
            // s?.classList.add("active");
        };

        const handleBlur = () => {
            bar?.classList.remove("active");
            // s?.classList.remove("active");

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
        <div id="searchBar" className=" relative border-slate-200  w-60 transition-all transition-200ms bg-white border-[1px] px-2 rounded-md hidden items-center justify-center gap-2 sm:flex">
            <Search size={25} className=" stroke-slate-600" />
            <input type="text" name="search" id="search" placeholder="Search..." className="ring-none placeholder:text-slate-600 text-slate-600 text-sm w-full border-none text-ellipsis focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none" />
            <kbd className="pointer-events-none absolute right-2 top-[-1px] translate-y-1/2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex shadow-[0px_0px_10px_7px_#ffffff]">
                <span className="text-xs">⌘</span>K
            </kbd>
        </div>
    )
}