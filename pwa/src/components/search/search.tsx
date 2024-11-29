"use client"

import * as React from "react"
import { Search } from "lucide-react"
import { Card } from "@/components/ui/card"
import EventCard from "@/components/events/eventCard"
import FilterBox from "@/components/search/filter"
import imagess from "@images/image_mairie_limoges.png"
import SearchResult from "@/components/search/searchResult"


export default function SearchBar() {
    const [searchValue, setSearchValue] = React.useState("")
    const [open, setOpen] = React.useState(false)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value)
    }

    React.useEffect(() => {
        // Gestionnaire pour command + k
        const handleKeyDown = (event: KeyboardEvent) => {
            const searchInput = document.getElementById('search') as HTMLInputElement
            if (event.metaKey && event.key === 'k') {
                setOpen(!open)
                if (searchInput && !open) {
                    searchInput.select()
                }
                else if (searchInput && open) {
                    searchInput.blur()
                }
            }
            else if (event.key === 'Escape') {
                setOpen(false)
                if (searchInput) {
                    searchInput.blur()
                }
            }
        }

        // Gestionnaire pour les clics à l'extérieur
        const handleClickOutside = (event: MouseEvent) => {
            const searchBar = document.getElementById('searchBar')
            const searchResult = document.getElementById('searchResult')

            if (searchBar && searchResult &&
                !searchBar.contains(event.target as Node) &&
                !searchResult.contains(event.target as Node)) {
                setOpen(false)
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        document.addEventListener('mousedown', handleClickOutside)

        // Nettoyage des event listeners
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [open])

    const handleClick = function () {
        setOpen(true)
        //select all the text in the search bar
        const searchInput = document.getElementById('search') as HTMLInputElement
        if (searchInput) {
            searchInput.select()
        }
    }


    return (
        <div className="w-full flex items-center justify-center">
            <div id="searchBar" className={`relative border-slate-200 w-60 bg-white border-[1px] px-2 rounded-lg hidden items-center justify-center gap-2 sm:flex  ${open ? 'px-4 py-1 rounded-2xl w-96 shadow-md' : ''} `}>
                <Search size={25} className="stroke-slate-600 " />
                <input
                    type="text"
                    name="search"
                    id="search"
                    value={searchValue}
                    onChange={handleInputChange}
                    placeholder="Rechercher..."
                    className="ring-none placeholder:text-slate-600 text-slate-600 text-sm w-full border-none text-ellipsis focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none rounded-md"
                    onClick={handleClick}
                />
                <kbd className="pointer-events-none absolute right-2 top-[50%] translate-y-[-50%] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex shadow-[0px_0px_10px_7px_#ffffff]">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </div>
            <SearchResult isOpen={open} search={searchValue} />
        </div>
    )
}


