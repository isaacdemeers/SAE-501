"use client";

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Calendar } from 'lucide-react'
import MyEventCard from '@/components/ui/my_event_card'

interface Event {
    imageUrl: string;
    location: string;
    title: string;
    date: string;
}

interface MyEventsProps {
    events: Event[];
}

export default function MyEvents({ events }: MyEventsProps) {
    return (
        <div className="p-4 bg-slate-50 rounded-xl h-fit lg:sticky top-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Mes événements</h2>
                <Button variant="outline" size="icon" className="rounded-full">
                    <Calendar className="h-4 w-4" />
                </Button>
            </div>
            <div className="flex gap-2 mb-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="rounded-full">
                            Par Date <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem>Aujourd'hui</DropdownMenuItem>
                        <DropdownMenuItem>Cette semaine</DropdownMenuItem>
                        <DropdownMenuItem>Ce mois</DropdownMenuItem>
                        <DropdownMenuItem>Le mois Prochain</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="flex flex-col gap-4">
                {events.map((event, index) => (
                    <MyEventCard key={index} {...event} />
                ))}
            </div>
        </div>
    )
}
