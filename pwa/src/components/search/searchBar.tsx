"use client"

import * as React from "react"
import { Search } from "lucide-react"
import SearchResult from "@/components/search/searchResult"

export default function SearchBar() {
    const [open, setOpen] = React.useState(false)

    React.useEffect(() => {

    }, [])

    return (
        <div className="w-full flex items-center justify-center">
            <div id="searchBar" className="relative border-slate-200 w-60 bg-white border-[1px] px-2 rounded-lg hidden items-center justify-center gap-2 sm:flex focus-within:px-4 focus-within:py-1 focus-within:rounded-2xl focus-within:w-96 focus-within:shadow-md ">
                <Search size={25} className="stroke-slate-600 focus-within:stroke-indigo-600" />
                <input
                    type="text"
                    name="search"
                    id="search"
                    placeholder="Search..."
                    className="ring-none placeholder:text-slate-600 text-slate-600 text-sm w-full border-none text-ellipsis focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
                />
                <kbd className="pointer-events-none absolute right-2 top-[50%] translate-y-[-50%] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex shadow-[0px_0px_10px_7px_#ffffff]">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </div>
        </div>
    )
}