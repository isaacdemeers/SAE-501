"use client";

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
  Check,
} from "lucide-react";
import Image from "next/image";
import eventImage from "@images/event-background-desktop.png";
import Link from "next/link";
import { Dialog, DialogTrigger, DialogContent , DialogHeader , DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { IsAuthentificated, JoinEvent } from "@/lib/request";
import { DialogClose } from "@radix-ui/react-dialog";

interface EventPageProps {
  params: {
    id: number;
  };
}

export default function EventPage({ params }: EventPageProps) {
  const { id } = params;
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      alert(`Email enregistré : ${email}`);
      setEmail(""); // Réinitialiser l'email après soumission
    }
  }

  useEffect(() => {
    const checkAuthentication = async () => {
      let isAuthenticated = await IsAuthentificated();
      if (isAuthenticated.isValid) {
        setIsAuthenticated(true);
      }
    };

    checkAuthentication();
  }, []);

  useEffect(() => {
    const checkUserSubscription = async () => {
      if (isAuthenticated) {
        const response = await fetch(`https://caverned-incantation-r4gq9q597xqq3wr-443.app.github.dev/userevents/${id}`);
        const data = await response.json();
        if (data.isLog) {
          setIsSubscribed(true);
        }
      }
    };

    checkUserSubscription();
  }, [id, isAuthenticated]);

  async function handleSubscribe() {
    let sub = await JoinEvent(id);
    if (sub.message === "User successfully joined the event") {
      setIsSubscribed(true);
      alert("Vous avez rejoint l'événement avec succès");
    }
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
        <Link href={`/event/${id}/edit`}>
          <Button
            // onClick={() => router.push(`/event/${id}/edit`)}
            variant="default"
            size="sm"
            className="md:flex"
          >
            <Edit className="w-4 h-4 mr-2" />
            Éditer
          </Button>
        </Link>
      </header>

      <Card className="border-none shadow-none">
        <CardHeader>
          <Image
            src={eventImage}
            alt="Event banner"
            className="object-cover w-full h-48 rounded-xl"
            priority
          />
        </CardHeader>
        <CardContent className="md:mt-2 lg:mt-4">
          <CardTitle className="mb-4 text-2xl font-semibold md:text-3xl lg:text-4xl md:font-extrabold">
            Conférence sur le trie et l&apos;écologie pour tout le territoire du
            limousin
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
    {isAuthenticated ? (
      isSubscribed ? (
        <Button variant="default" className="bg-blue-500 md:flex hover:bg-blue-400">
          <Check className="w-4 h-4 mr-2" /> Inscrit
        </Button>
      ) : (
        <Button variant="default" onClick={handleSubscribe}>
          <Plus className="w-4 h-4 mr-2" /> S&apos;inscrire
        </Button>
      )
    ) : (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="default">
            <Plus className="w-4 h-4 mr-2" /> S&apos;inscrire
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <h2 className="text-lg font-bold">S'inscrire à l'évènement</h2>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Pour vous inscrire, connectez-vous.
            </p>
            <div className="flex flex-col gap-4">
              <Link href={`/login?returnUrl=/event/${id}`} passHref>
                <Button className="flex w-full items-center justify-center" variant="secondary">Se connecter</Button>
              </Link>
              <p className="text-sm text-muted-foreground">
                ou inscrivez-vous avec votre email
              </p>
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
            <DialogClose>
              <Button variant="outline" onClick={() => setEmail("")}>
                Fermer
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )}
    )}
            </div>

            <div className="flex flex-col gap-4 mb-3 md:mb-6">
              <p className="text-lg">A lieu le 18 janvier 2024</p>
              <p className="text-sm text-muted-foreground">De 18h30 à 19h30</p>
            </div>
          </div>

          <section className="mb-8">
            <h2 className="mb-3 text-2xl font-semibold md:mb-6">Description</h2>
            <p className="text-muted-foreground">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-semibold">Informations</h2>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
              <div>
                <div className="flex gap-2 pb-2">
                  <MapPin />
                  <h3 className="font-semibold">Lieu</h3>
                </div>
                <p>24 Avenue du maréchal Jauffre</p>
              </div>
              <div>
                <div className="flex gap-2 pb-2">
                  <Clock />
                  <h3 className="font-semibold">Date</h3>
                </div>
                <p>18 janvier 2024 / 18h30 - 19h30</p>
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
                <p>30 / 53 places</p>
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
                <p>Public</p>
              </div>
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
