"use client";

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { ChevronDown, Calendar, CalendarX2 } from 'lucide-react'
import MyEventCard from '@/components/dashboard/myEventCard'
import Link from 'next/link'
import EventForm from '@/components/events/eventForm'
import { useState } from 'react'

interface Event {
    eventId: string;
    img: string;
    location: string;
    title: string;
    description: string;
    datestart: string;
    dateend: string;
}

interface MyEventsProps {
    events: Event[];
    onEventCreated: () => void;
}

type TimeFrame = 'all' | 'today' | 'week' | 'month' | 'nextMonth';

const timeFrameLabels: Record<TimeFrame, string> = {
    all: 'Tous',
    today: "Aujourd'hui",
    week: 'Cette semaine',
    month: 'Ce mois',
    nextMonth: 'Le mois prochain'
};

export default function MyEvents({ events, onEventCreated }: MyEventsProps) {
    const [showEventForm, setShowEventForm] = useState(false);
    const [timeFrame, setTimeFrame] = useState<TimeFrame>('all');

    const handleEventCreated = () => {
        setShowEventForm(false);
        onEventCreated();
    };

    const filterEventsByTimeFrame = (events: Event[], timeFrame: TimeFrame): Event[] => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 7);

        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);

        const nextMonthStart = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        const nextMonthEnd = new Date(today.getFullYear(), today.getMonth() + 2, 0, 23, 59, 59);

        return events.filter(event => {
            const eventDate = new Date(event.datestart.replace(' ', 'T'));

            switch (timeFrame) {
                case 'today':
                    return eventDate >= today && eventDate < tomorrow;
                case 'week':
                    return eventDate >= weekStart && eventDate < weekEnd;
                case 'month':
                    return eventDate >= monthStart && eventDate <= monthEnd;
                case 'nextMonth':
                    return eventDate >= nextMonthStart && eventDate <= nextMonthEnd;
                default:
                    return true;
            }
        });
    };

    const filteredEvents = filterEventsByTimeFrame(events, timeFrame);

    return (
        <div className="p-4 bg-slate-50 rounded-xl h-fit">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Mes événements</h2>
                <Link href="/calendar">
                    <Button variant="outline" size="icon" className="rounded-lg">
                        <Calendar className="h-4 w-4" />
                    </Button>
                </Link>
            </div>
            <div className="flex gap-2 mb-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="rounded-lg">
                            {timeFrameLabels[timeFrame]} <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {Object.entries(timeFrameLabels).map(([key, label]) => (
                            <DropdownMenuItem
                                key={key}
                                onClick={() => setTimeFrame(key as TimeFrame)}
                                className={timeFrame === key ? 'bg-accent' : ''}
                            >
                                {label}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Events container */}
            <div className="flex-1">
                {filteredEvents.length > 0 ? (
                    <div className="flex flex-col gap-4 mb-4">
                        {filteredEvents.map((event, index) => (
                            <MyEventCard
                                key={index}
                                eventId={event.eventId}
                                imageUrl={event.img}
                                location={event.location}
                                title={event.title}
                                date={event.datestart}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg p-6 text-center border border-gray-200 mb-4">
                        <CalendarX2 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <h3 className="text-lg font-semibold mb-2">Aucun événement</h3>
                        <p className="text-gray-600 mb-4">
                            Aucun événement trouvé pour cette période.
                        </p>
                    </div>
                )}
            </div>

            {/* Create event section at the bottom */}
            <div className="bg-white rounded-lg border border-gray-200 text-center p-6">
                <h3 className="text-lg font-semibold mb-2">Vous n'avez pas trouvé l'événement parfait ?</h3>
                <p className="text-gray-600 mb-4">Créez-le et partagez-le avec la communauté !</p>
                <Button
                    className="rounded-lg"
                    onClick={() => setShowEventForm(true)}
                >
                    Créer un événement
                </Button>
            </div>

            {/* Event Form Dialog */}
            <Dialog open={showEventForm} onOpenChange={setShowEventForm}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
                    <DialogHeader className="px-6 py-4 sticky top-0 bg-white border-b">
                        <DialogTitle className="text-xl">Créer un événement</DialogTitle>
                    </DialogHeader>
                    <div className="px-6 py-4">
                        <EventForm onClose={handleEventCreated} />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
