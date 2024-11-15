"use client";

import { useState } from 'react';
import EventCard from '@/components/dashboard/card_suggested';
import { Button } from "@/components/ui/button";

interface Event {
    imageUrl: string;
    location: string;
    title: string;
    description: string;
    date: string;
    buttonText: string;
}

interface SuggestedEventsProps {
    initialEvents: Event[];
}

export default function SuggestedEvents({ initialEvents }: SuggestedEventsProps) {
    const [displayedSuggestedEvents, setDisplayedSuggestedEvents] = useState<Event[]>(initialEvents.slice(0, 2));

    const loadMore = () => {
        const currentLength = displayedSuggestedEvents.length;
        const nextEvents = initialEvents.slice(currentLength, currentLength + 2);
        setDisplayedSuggestedEvents([...displayedSuggestedEvents, ...nextEvents]);
    };

    return (
        <div>
            <h2 className="text-3xl font-semibold mb-4">Événements suggère</h2>
            <div className="space-y-4">
                {displayedSuggestedEvents.map((event, index) => (
                    <EventCard
                        key={index}
                        {...event}
                        id={index.toString()}
                        onRegister={() => console.log(`Registered for ${event.title}`)}
                    />
                ))}
            </div>
            {displayedSuggestedEvents.length < initialEvents.length && (
                <div className="mt-4 text-center">
                    <Button onClick={loadMore} variant="outline">Voir plus</Button>
                </div>
            )}
        </div>
    );
}
