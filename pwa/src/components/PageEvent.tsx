import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import Image from "next/image";
import Link from "next/link";

interface EventPageProps {
  params: {
    id: string;
  };
}

export default async function PageEvent({ params }: EventPageProps) {
  const { id } = params;

  const data = await fetch(`http://php/events/${id}`);
  const eventData = await data.json();
  console.log(eventData);

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

  return (
    <div className="max-w-2xl p-4 mx-auto md:max-w-3xl lg:max-w-5xl md:p-8 lg:p-12">
      <header className="flex justify-between mb-8">
        <Link href="/dashboard" className="md:hidden">
          <Button variant="ghost" size="sm" className="md:hidden">
            <ArrowLeft className="w-4 h-4 mr-2" /> Retour
          </Button>
        </Link>

        <Link href="/dashboard" className="hidden md:flex">
          <Button variant="default" size="sm" className="hidden md:flex">
            <ArrowLeft className="w-4 h-4 mr-2" /> Retour
          </Button>
        </Link>
        <Link href={`/events/${id}/edit`}>
          <Button variant="default" size="sm" className="md:flex">
            <Edit className="w-4 h-4 mr-2" />
            Éditer
          </Button>
        </Link>
      </header>

      <Card className="border-none shadow-none">
        <CardHeader>
          <img
            src={eventData.img}
            alt="Event banner"
            className="object-cover w-full h-48 rounded-xl"
          />
        </CardHeader>
        <CardContent className="md:mt-2 lg:mt-4">
          <CardTitle className="mb-4 text-2xl font-semibold md:text-3xl lg:text-4xl md:font-extrabold">
            {eventData.title}
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
                <Plus className="w-4 h-4 mr-2" /> S&apos;inscrire
              </Button>
            </div>

            <div className="flex flex-col gap-4 mb-3 w-48md:w-72 lg:w-96 md:mb-6">
              <p>
                {isSameDay(eventData.datestart, eventData.dateend)
                  ? `A lieu le ${formatDate(
                      eventData.datestart
                    )} de ${formatTime(eventData.datestart)} à ${formatTime(
                      eventData.dateend
                    )}`
                  : `A lieu du ${formatDate(
                      eventData.datestart
                    )} à ${formatTime(eventData.datestart)} au ${formatDate(
                      eventData.dateend
                    )} à ${formatTime(eventData.dateend)}`}
              </p>
            </div>
          </div>

          <section className="mb-8">
            <h2 className="mb-3 text-2xl font-semibold md:mb-6">Description</h2>
            <p className="text-muted-foreground">{eventData.description}</p>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-semibold">Informations</h2>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
              <div>
                <div className="flex gap-2 pb-2">
                  <MapPin />
                  <h3 className="font-semibold">Lieu</h3>
                </div>
                <p>{eventData.location}</p>
              </div>
              <div>
                <div className="flex gap-2 pb-2">
                  <Clock />
                  <h3 className="font-semibold">Date</h3>
                </div>
                <p>
                  {isSameDay(eventData.datestart, eventData.dateend)
                    ? `Le ${formatDate(eventData.datestart)} de ${formatTime(
                        eventData.datestart
                      )} à ${formatTime(eventData.dateend)}`
                    : `Du ${formatDate(eventData.datestart)} à ${formatTime(
                        eventData.datestart
                      )} au ${formatDate(eventData.dateend)} à ${formatTime(
                        eventData.dateend
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
                <p>30 / {eventData.maxparticipant} places</p>
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
                <p>{eventData.visibility ? "Public" : "Privé"}</p>
              </div>
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
