"use client";

import SuggestedEvents from '@/components/SuggestedEvents'
import MyEvents from '@/components/MyEvents'
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import EventForm from '@/components/event-form';
import { useState, useEffect, useRef } from 'react';

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
]

const suggestedEvents = [
  {
    imageUrl: "/image_mairie_limoges.png",
    location: "Mairie, Limoges",
    title: "Conférence sur le trie et l'écologie pour tout le territoire du limousin",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ut pharetra lectus, ac convallis nisi. Suspendisse pellentesque viverra auctor. Nunc ultricies neque elit, libero tincid...",
    date: "19 Octobre 2024 à 10h",
    buttonText: "S'inscrire"
  },
  {
    imageUrl: "/image_mairie_limoges.png",
    location: "Palais des Congrès, Bordeaux",
    title: "Atelier sur l'économie circulaire en Nouvelle-Aquitaine",
    description: "Découvrez les principes de l'économie circulaire et son impact sur les entreprises locales. Rejoignez-nous pour une session interactive avec des experts de la région...",
    date: "2 Novembre 2024 à 13h30",
    buttonText: "S'inscrire"
  },
  {
    imageUrl: "/image_mairie_limoges.png",
    location: "Université de Poitiers, Poitiers",
    title: "Rencontre sur la transition énergétique et l'innovation",
    description: "Participez à une discussion sur la transition énergétique et comment les innovations locales contribuent à la transformation du secteur. Échangez avec des professionnels et chercheurs...",
    date: "12 Novembre 2024 à 15h15",
    buttonText: "S'inscrire"
  }
]

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  return (
    <div className="container mx-auto p-4 md:p-8 lg:p-12">
      <div className="flex gap-4 py-4">
        <Button>
          <Link href="/login">Login</Link>
        </Button>
        <Button>
          <Link href="/register">Register</Link>
        </Button>
        <Button onClick={handleCreateEventClick}>
          Créer un Event
        </Button>
      </div>
      <h1 className="text-4xl font-bold mb-8">Bienvenue, Fred 👋</h1>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div ref={modalRef} className="bg-white p-4 max-h-[80vh] overflow-y-auto rounded-lg">
            <EventForm  />
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_4fr] gap-8">
        <MyEvents events={myEvents} />
        <SuggestedEvents initialEvents={suggestedEvents} />
      </div>
    </div>
  )
}