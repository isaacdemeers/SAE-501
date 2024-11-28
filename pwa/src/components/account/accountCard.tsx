"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { editUser } from "@/lib/request";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Pencil } from "lucide-react";
import { ProfilePhotoUpload } from "./changePhoto";

const animateHeight =
  "transition-[max-height] duration-300 ease-in-out overflow-hidden";

interface AuthResponse {
  isValid: boolean;
  user: {
    email: string;
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    photo: string;
  };
}

export default function ProfileSettings() {
  const router = useRouter();
  const [userData, setUserData] = useState<AuthResponse["user"] | null>(null);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    newEmail: "",
    confirmEmail: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  // Mémoriser fetchUserData avec useCallback
  const fetchUserData = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/validate-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data: AuthResponse = await response.json();

      if (!data.isValid || !data.user) {
        router.push("/login");
        return;
      }

      setUserData(data.user);
      setFormData((prev) => ({
        ...prev,
        firstname: data.user.firstName || "",
        lastname: data.user.lastName || "",
        username: data.user.username || "",
      }));
    } catch (error) {
      console.error("Error fetching user data:", error);
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  if (!userData) {
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleUpdateAccount = async () => {
    try {
      await editUser(userData!.id, {
        firstname: formData.firstname,
        lastname: formData.lastname,
        username: formData.username,
      });
      alert("Compte mis à jour avec succès !");
      fetchUserData(); // Rafraîchir les données utilisateur
    } catch (error) {
      console.error("Error updating account:", error);
    }
  };

  const handleUpdateEmail = async () => {
    if (formData.newEmail !== formData.confirmEmail) {
      alert("Les e-mails ne correspondent pas !");
      return;
    }

    try {
      await editUser(userData!.id, { email: formData.newEmail });
      alert("E-mail mis à jour avec succès !");
      fetchUserData(); // Rafraîchir les données utilisateur
    } catch (error) {
      console.error("Error updating email:", error);
    }
  };

  const handleUpdatePassword = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      alert("Les nouveaux mots de passe ne correspondent pas !");
      return;
    }

    try {
      await editUser(userData!.id, {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      });
      alert("Mot de passe mis à jour avec succès !");
      setFormData((prev) => ({
        ...prev,
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
      fetchUserData(); // Rafraîchir les données utilisateur
    } catch (error) {
      console.error("Error updating password:", error);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <ProfilePhotoUpload
        userId={userData?.id}
        onUpload={async () => {
          await fetchUserData();
          setIsPhotoModalOpen(false);
        }}
        onCancel={() => setIsPhotoModalOpen(false)}
        open={isPhotoModalOpen}
      />
      <Tabs defaultValue="compte" className={cn("w-full", animateHeight)}>
        <TabsList className="justify-start w-full h-auto p-0 bg-transparent border-b rounded-none">
          <TabsTrigger
            value="compte"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
          >
            Compte
          </TabsTrigger>
          <TabsTrigger
            value="email"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
          >
            E-mail
          </TabsTrigger>
          <TabsTrigger
            value="password"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
          >
            Mot de passe
          </TabsTrigger>
        </TabsList>

        <TabsContent value="compte" className={cn("p-6", animateHeight)}>
          <div className="flex flex-col items-center gap-4 mb-8">
            <div className="relative">
              <Avatar className="w-32 h-32">
                <AvatarImage
                  src={userData?.photo || ""}
                  alt="Photo de profil"
                  onError={(e) => {
                    console.error("Error loading image:", e);
                  }}
                />
                <AvatarFallback>
                  {userData?.firstName?.charAt(0).toUpperCase() || ""}
                  {userData?.lastName?.charAt(0).toUpperCase() || ""}
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="secondary"
                className="absolute bottom-0 right-0 rounded-full"
                onClick={() => setIsPhotoModalOpen(true)}
              >
                <Pencil className="w-4 h-4" />
              </Button>
            </div>
            <h2 className="text-2xl font-bold">{userData?.username}</h2>
          </div>

          <div className="space-y-4">
            <h2 className="mb-4 text-2xl font-bold">Modifier votre compte</h2>
            <div className="space-y-2">
              <Label htmlFor="firstname">Prénom</Label>
              <Input
                id="firstname"
                value={formData.firstname}
                onChange={handleInputChange}
                placeholder={userData?.firstName || ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastname">Nom</Label>
              <Input
                id="lastname"
                value={formData.lastname}
                onChange={handleInputChange}
                placeholder={userData?.lastName || ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Nom d&apos;utilisateur</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder={userData?.username || ""}
              />
            </div>
            <Button className="w-full mt-6" onClick={handleUpdateAccount}>
              Enregistrer les modifications
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="email" className={cn("p-6", animateHeight)}>
          <div className="space-y-4">
            <h2 className="mb-4 text-2xl font-bold">Modifier votre e-mail</h2>

            <div className="space-y-2">
              <Label htmlFor="current-email">E-mail actuel</Label>
              <Input
                id="current-email"
                type="email"
                defaultValue={userData?.email}
                disabled
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newEmail">Nouvel e-mail</Label>
              <Input
                id="newEmail"
                value={formData.newEmail}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmEmail">Confirmer le nouvel e-mail</Label>
              <Input
                id="confirmEmail"
                value={formData.confirmEmail}
                onChange={handleInputChange}
              />
            </div>
            <Button className="w-full mt-6" onClick={handleUpdateEmail}>
              Mettre à jour l&apos;e-mail
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="password" className={cn("p-6", animateHeight)}>
          <div className="space-y-4">
            <h2 className="mb-4 text-2xl font-bold">
              Changer votre mot de passe
            </h2>
            <div className="space-y-2">
              <Label htmlFor="oldPassword">Mot de passe actuel</Label>
              <Input
                id="oldPassword"
                type="password"
                value={formData.oldPassword}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nouveau mot de passe</Label>
              <Input
                id="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                Confirmer le nouveau mot de passe
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
            </div>
            <Button className="w-full mt-6" onClick={handleUpdatePassword}>
              Mettre à jour le mot de passe
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
