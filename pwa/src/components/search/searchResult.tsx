'use client'
import Link from "next/link"
import React, { useState, useEffect } from "react"
import { PlusCircle, Calendar, User, AlignRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import EventCard from "@/components/events/eventCard"
import FilterBox from "@/components/search/filter"
import imagess from "@images/image_mairie_limoges.png"
import { GetAllEvents } from "@/lib/request"

interface Event {
    id: number;
    title: string;
    datestart: string;
    dateend: string;
    description: string;
    img: string;
    location: string;
    maxparticipant: string;
    sharelink: string;
    isPublic: boolean;
}

interface SearchResultProps {
    isOpen: boolean
}

export default function SearchResult({ isOpen }: SearchResultProps) {
    const [events, setEvents] = useState<Event[]>([])
    useEffect(() => {
        GetAllEvents().then(setEvents)
    }, [])
    return (
        <Card
            id="searchResult"
            className={`bg-slate-50 bg-opacity-100 backdrop-blur-lg transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] fixed top-0 z-40 left-1/2 w-2/3 transform -translate-x-1/2 
             items-center justify-between p-4 mt-24 flex origin-top-left flex-col gap-4 max-h-[80vh] rounded-xl shadow-lg
             ${isOpen ? 'opacity-100 blur-0 translate-y-0' : 'opacity-0 blur-md -translate-y-4 pointer-events-none'}`}
        >
            <header className="flex items-center justify-between w-full">
                <FilterBox />
            </header>

            <div className="flex items-center justify-start mt-2 w-full">
                <h4 className="font-normal text-slate-600 text-xs bg-slate-100 rounded-md py-1 px-2">4 results</h4>
            </div>

            <ul className="flex flex-wrap items-start justify-evenly w-full max-h-[80vh] overflow-y-scroll rounded-lg gap-2">
                {events.map((event) => (
                    <EventCard
                        key={event.id.toString()}
                        event={{
                            id: event.id.toString(),
                            title: event.title,
                            date: event.datestart,
                            isPublic: event.isPublic,
                            attendees: parseInt(event.maxparticipant),
                            imageUrl: event.img
                        }}
                        type="searchResult"
                    />
                ))}
            </ul>
        </Card>
    )
}