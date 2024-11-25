"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogTrigger, DialogContent, DialogHeader , DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Edit,
  Share2,
  Users,
  Plus,
  MapPin,
  Clock,
  Mail,
  Eye,
  UserCog,
} from "lucide-react";
import Link from "next/link";
import { GetEvent } from "@/lib/request"; // Utilisation de votre fichier request.ts
import { useState, useEffect } from "react";

interface EventPageProps {
  params: {
    id: string;
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
  visibility: boolean;
}

export default function PageEvent({ params }: EventPageProps) {
  const { id } = params;

  // Gestion des états
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch de l'événement
  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await GetEvent(parseInt(id)); // Appel via request.ts
        setEvent(data);
      } catch (err) {
        setError("Une erreur est survenue lors du chargement de l'événement.");
        console.error("Erreur lors du chargement de l'événement:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  // Formatage des dates
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  function formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function isSameDay(dateStart: string, dateEnd: string): boolean {
    const start = new Date(dateStart);
    const end = new Date(dateEnd);
    return (
      start.getFullYear() === end.getFullYear() &&
      start.getMonth() === end.getMonth() &&
      start.getDate() === end.getDate()
    );
  }

  // Gestion des cas de chargement ou d'erreur
  if (loading) {
    return <p>Chargement de l'événement...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!event) {
    return <p>Aucun événement trouvé.</p>;
  }

  // Rendu principal
  return (
    <div className="max-w-2xl p-4 mx-auto md:max-w-3xl lg:max-w-5xl md:p-8 lg:p-12">
      <header className="flex justify-between mb-8">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" /> Retour
          </Button>
        </Link>
        <Link href={`/events/${id}/edit`}>
          <Button variant="default" size="sm">
            <Edit className="w-4 h-4 mr-2" />
            Éditer
          </Button>
        </Link>
      </header>

      <Card className="border-none shadow-none">
        <CardHeader>
          <img
            src={event.img}
            alt="Event banner"
            className="object-cover w-full h-48 rounded-xl"
          />
        </CardHeader>
        <CardContent className="md:mt-2 lg:mt-4">
          <CardTitle className="mb-4 text-2xl font-semibold md:text-3xl lg:text-4xl md:font-extrabold">
            {event.title}
          </CardTitle>
          <div className="flex flex-col justify-between md:flex-row-reverse md:mt-8 lg:mt-12 mb-">
            <div className="flex flex-wrap gap-4 mt-2 mb-8 md:mt-0">
              <Button
                variant="default"
                className="bg-green-500 md:flex hover:bg-green-400"
              >
                <Users className="w-4 h-4 mr-2" /> 23
              </Button>
              <Button variant="default" className="">
                <Share2 className="w-4 h-4 mr-2" /> Partager
              </Button>
              <Button variant="default">
                <Plus className="w-4 h-4 mr-2" /> S'inscrire
              </Button>
              <Dialog>
      <DialogTrigger asChild>
        <Button>S'inscrire</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <h2 className="text-lg font-bold">S'inscrire</h2>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Pour vous inscrire, connectez-vous ou fournissez un email.
          </p>
          <div className="flex flex-col gap-4">
            <Link href="/login" passHref>
              <Button variant="secondary">Se connecter</Button>
            </Link>
            <form onSubmit={handleSubmit} className="space-y-2">
              <Label htmlFor="email">Votre email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Entrez votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit">S'inscrire avec votre email</Button>
            </form>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setEmail("")}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
            </div>
            <div className="flex flex-col gap-4 mb-3 w-48md:w-72 lg:w-96 md:mb-6">
              <p>
                {isSameDay(event.datestart, event.dateend)
                  ? `A lieu le ${formatDate(event.datestart)} de ${formatTime(
                      event.datestart
                    )} à ${formatTime(event.dateend)}`
                  : `A lieu du ${formatDate(event.datestart)} à ${formatTime(
                      event.datestart
                    )} au ${formatDate(event.dateend)} à ${formatTime(
                      event.dateend
                    )}`}
              </p>
            </div>
          </div>

          <section className="mb-8">
            <h2 className="mb-3 text-2xl font-semibold md:mb-6">Description</h2>
            <p className="text-muted-foreground">{event.description}</p>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-semibold">Informations</h2>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
              <div>
                <div className="flex gap-2 pb-2">
                  <MapPin />
                  <h3 className="font-semibold">Lieu</h3>
                </div>
                <p>{event.location}</p>
              </div>
              <div>
                <div className="flex gap-2 pb-2">
                  <Clock />
                  <h3 className="font-semibold">Date</h3>
                </div>
                <p>
                  {isSameDay(event.datestart, event.dateend)
                    ? `Le ${formatDate(event.datestart)} de ${formatTime(
                        event.datestart
                      )} à ${formatTime(event.dateend)}`
                    : `Du ${formatDate(event.datestart)} à ${formatTime(
                        event.datestart
                      )} au ${formatDate(event.dateend)} à ${formatTime(
                        event.dateend
                      )}`}
                </p>
              </div>
              <div>
                <div className="flex gap-2 pb-2">
                  <Mail />
                  <h3 className="font-semibold">E-mail</h3>
                </div>
                <p>github.git@github.com</p>
              </div>
              <div>
                <div className="flex gap-2 pb-2">
                  <Users />
                  <h3 className="font-semibold">Places restantes</h3>
                </div>
                <p>30 / {event.maxparticipant} places</p>
              </div>
              <div>
                <div className="flex gap-2 pb-2">
                  <UserCog />
                  <h3 className="font-semibold">Organisateurs</h3>
                </div>
                <p>@MairieDeLimoges</p>
              </div>
              <div>
                <div className="flex gap-2 pb-2">
                  <Eye />
                  <h3 className="font-semibold">Visibilité</h3>
                </div>
                <p>{event.visibility ? "Public" : "Privé"}</p>
              </div>
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
