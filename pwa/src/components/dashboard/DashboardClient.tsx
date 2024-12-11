"use client";

import { useState, useEffect } from 'react';
import SuggestedEvents from '@/components/dashboard/SuggestedEvents';
import MyEvents from '@/components/dashboard/MyEvents';
import AuthPrompt from '@/components/dashboard/loginPrompt';
import { useSearchParams } from 'next/navigation';

interface AuthResponse {
    isValid: boolean;
    user: {
        email: string;
        id: number;
        username: string;
    };
}

interface Event {
    id: string;
    title: string;
    description: string;
    datestart: string;
    dateend: string;
    location: string;
    maxparticipant: number;
    img: string;
    sharelink: string;
}

interface FormattedEvent {
    id: string;
    imageUrl: string;
    location: string;
    title: string;
    description: string;
    date: string;
    buttonText: string;
}

export default function DashboardClient() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState<string>('');
    const [suggestedEvents, setSuggestedEvents] = useState<FormattedEvent[]>([]);
    const [myEvents, setMyEvents] = useState<Event[]>([]);
    const [userId, setUserId] = useState<number | null>(null);
    const searchParams = useSearchParams();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Fetch upcoming events
    const fetchUpcomingEvents = async (page: number = 1) => {
        try {
            const response = await fetch(`/api/events/upcoming?page=${page}`);
            if (!response.ok) throw new Error('Failed to fetch events');

            const { events, totalPages } = await response.json();

            const formattedEvents = events.map((event: Event) => ({
                id: event.id,
                imageUrl: event.img,
                location: event.location,
                title: event.title,
                description: event.description,
                date: new Date(event.datestart).toLocaleString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric'
                }),
                buttonText: "Voir l'Événement"
            }));
            setSuggestedEvents(formattedEvents);
        } catch (error) {
            console.error('Error fetching upcoming events:', error);
        }
    };

    // Function to fetch user events
    const fetchUserEvents = async (userId: number) => {
        try {
            const response = await fetch(`/user/${userId}/events`);
            if (!response.ok) throw new Error('Failed to fetch events');
            const data = await response.json();
            setMyEvents(data);
        } catch (error) {
            console.error('Error fetching user events:', error);
        }
    };

    // Function to refresh all events
    const refreshEvents = async () => {
        if (userId) {
            await Promise.all([
                fetchUserEvents(userId),
                fetchUpcomingEvents()
            ]);
        }
    };

    useEffect(() => {
        const authenticateUser = async () => {
            try {
                const response = await fetch('/api/auth/validate-token', {
                    method: 'POST',
                    credentials: 'include',
                });

                const data: AuthResponse = await response.json();
                setIsAuthenticated(data.isValid);
                if (data.user?.username) {
                    setUsername(data.user.username);
                    setUserId(data.user.id);
                }
            } catch (error) {
                console.error('Authentication error:', error);
                setIsAuthenticated(false);
            }
        };

        authenticateUser();
    }, []);

    useEffect(() => {
        if (userId) {
            fetchUserEvents(userId);
        }
    }, [userId]);

    useEffect(() => {
        fetchUpcomingEvents(); // Fetch events when component mounts
    }, []);

    useEffect(() => {
        if (userId) {
            const refresh = searchParams.get('refresh');
            refreshEvents();
        }
    }, [searchParams, userId]);

    return (
        <div className="container mt-16 mx-auto p-4 md:p-8 lg:p-12">

            <h1 className="text-4xl font-bold mb-8 mt-4">
                {isAuthenticated ? `Bienvenue, ${username} 👋` : "Bienvenue sur PlanIt 👋"}
            </h1>
            <div className="grid grid-cols-1 lg:grid-cols-[3fr_4fr] gap-8">
                {isAuthenticated ? (
                    <MyEvents
                        events={myEvents}
                        onEventCreated={refreshEvents}
                    />
                ) : (
                    <AuthPrompt />
                )}
                <SuggestedEvents
                    initialEvents={suggestedEvents}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => {
                        setCurrentPage(page);
                        fetchUpcomingEvents(page);
                    }}
                />
            </div>
        </div>
    );
}