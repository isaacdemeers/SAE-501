"use client";

import SuggestedEvents from '@/components/dashboard/suggestedEvents'
import MyEvents from '@/components/dashboard/myEvents'
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import EventForm from '@/components/events/eventForm';
import { useState, useEffect, useRef } from 'react';
import AuthPrompt from '@/components/dashboard/loginPrompt';

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

interface PaginatedEvents {
    events: Event[];
    pagination: {
        current_page: number;
        total_pages: number;
        total_events: number;
        events_per_page: number;
    };
}

const myEvents = [
    {
        imageUrl: "/image_mairie_limoges.png",
        location: "Zénith, Limoges",
        title: "Venez nous rejoindre pour le lancement de cette nouvelle année de MMI !",
        date: "15 Octobre 2024 à 18h30"
    },
    {
        imageUrl: "/image_mairie_limoges.png",
        location: "Trampoline Park, Limoges",
        title: "Soirée pote au parc trampoline",
        date: "18 Octobre 2024 à 16h45"
    }
];

export default function DashboardClient() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState<string>('');
    const [suggestedEvents, setSuggestedEvents] = useState<Event[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const modalRef = useRef<HTMLDivElement>(null);

    const handleCreateEventClick = () => {
        setIsModalOpen(true);
    };

    const closeModal = (): void => {
        setIsModalOpen(false);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
            closeModal();
        }
    };

    // Fetch upcoming events
    const fetchUpcomingEvents = async (page: number = 1) => {
        try {
            const response = await fetch(`/api/events/upcoming?page=${page}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch events');
            }

            const data: PaginatedEvents = await response.json();
            setSuggestedEvents(data.events);
            setCurrentPage(data.pagination.current_page);
            setTotalPages(data.pagination.total_pages);
        } catch (error) {
            console.error('Error fetching upcoming events:', error);
        }
    };

    useEffect(() => {
        if (isModalOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isModalOpen]);

    useEffect(() => {
        const authenticateUser = async () => {
            try {
                const response = await fetch('/api/auth/validate-token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                });

                const data = await response.json();
                console.log('Raw auth response:', data);

                setIsAuthenticated(data.isValid);
                if (data.user?.username) {
                    setUsername(data.user.username);
                }
            } catch (error) {
                console.error('Authentication error:', error);
                setIsAuthenticated(false);
            }
        };

        authenticateUser();
        fetchUpcomingEvents(); // Fetch events when component mounts
    }, []);

    // Function to handle page changes
    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            fetchUpcomingEvents(newPage);
        }
    };

    // Format events for SuggestedEvents component
    const formattedSuggestedEvents = suggestedEvents.map(event => ({
        id: event.id,
        imageUrl: `${event.img}`, // Adjust path according to your setup
        location: event.location,
        title: event.title,
        description: event.description.length > 200
            ? `${event.description.substring(0, 200)}...`
            : event.description,
        date: new Date(event.datestart).toLocaleString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        }),
        buttonText: "Voir l'Événement"
    }));

    return (
        <div className="container mx-auto p-4 md:p-8 lg:p-12">
            <div className="flex gap-4 py-4 w-full justify-end">
                {isAuthenticated && (
                    <Button onClick={handleCreateEventClick}>
                        Créer un Event
                    </Button>
                )}
            </div>
            <h1 className="text-4xl font-bold mb-8">
                {isAuthenticated ? `Bienvenue, ${username} 👋` : "Bienvenue sur Plan-It 👋"}
            </h1>
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div ref={modalRef} className="bg-white p-4 max-h-[80vh] overflow-y-auto rounded-lg">
                        <EventForm />
                    </div>
                </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-[3fr_4fr] gap-8">
                {isAuthenticated ? (
                    <MyEvents events={myEvents} />
                ) : (
                    <AuthPrompt />
                )}
                <SuggestedEvents
                    initialEvents={formattedSuggestedEvents}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
} 