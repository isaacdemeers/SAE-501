'use client'
import Link from "next/link"
import React from "react"
import { PlusCircle, Calendar, User, AlignRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import EventCard from "@/components/events/eventCard"
import FilterBox from "@/components/search/filter"
import imagess from "@images/image_mairie_limoges.png"

interface SearchResultProps {
    isOpen: boolean
}

export default function SearchResult({ isOpen }: SearchResultProps) {
    return (
        <Card
            id="searchResult"
            className={` transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] fixed top-0 z-40 left-1/2 w-2/3 transform -translate-x-1/2 
            bg-slate-50 bg-opacity-80 items-center justify-between p-4 mt-24  flex origin-top-left flex-col gap-4 max-h-[80vh] rounded-xl shadow-lg opacity-100 `}
        >
            <header className="flex items-center justify-between w-full">
                <FilterBox />
            </header>

            <div className="flex items-center justify-start mt-2 w-full">
                <h4 className="font-normal text-slate-600 text-xs bg-slate-100 rounded-md py-1 px-2">4 results</h4>
            </div>

            <ul className="flex flex-wrap items-start justify-evenly w-full max-h-[80vh] overflow-y-scroll rounded-lg gap-2">
                <EventCard title="Event 1" date="10 janvier 3000" isPublic={false} attendees={30} imageUrl={imagess.src} type="searchResult" />
                <EventCard title="Event 2" date="10 janvier 3000" isPublic={false} attendees={30} imageUrl={imagess.src} type="searchResult" />
                <EventCard title="Event 3" date="10 janvier 3000" isPublic={false} attendees={30} imageUrl={imagess.src} type="searchResult" />
                <EventCard title="Event 4" date="10 janvier 3000" isPublic={false} attendees={30} imageUrl={imagess.src} type="searchResult" />
            </ul>
        </Card>
    )
}