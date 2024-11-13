"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, UploadIcon, X, PlusCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

type Invitee = {
  id: string
  value: string
}

export default function Component() {
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [invitees, setInvitees] = useState<Invitee[]>([])
  const [inviteeInput, setInviteeInput] = useState("")

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddInvitee = () => {
    if (inviteeInput.trim() !== "") {
      setInvitees([...invitees, { id: Date.now().toString(), value: inviteeInput.trim() }])
      setInviteeInput("")
    }
  }

  const handleRemoveInvitee = (id: string) => {
    setInvitees(invitees.filter(invitee => invitee.id !== id))
  }



  return (
    <section className=" absolute top-0 left-0 w-screen h-screen flex items-start sm:items-center justify-center bg-slate-950 sm:px-80 sm:py-16 bg-opacity-60">
      <Card className=" relative w-full h-full rounded-none sm:rounded-md overflow-y-scroll">
        <Button variant="ghost" className="absolute top-8 right-8 w-10 h-10 p-0">
          <X className="w-5 h-5" />
        </Button>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Créer un évènement</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titre</Label>
                <Input id="title" placeholder="Titre de l'évènement" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Donner une image à votre évènement :</Label>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="image" className="cursor-pointer">
                    <div className="flex items-center space-x-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md">
                      <UploadIcon className="w-5 h-5" />
                      <span>Cliquez pour télécharger</span>
                    </div>
                  </Label>
                  <Input id="image" type="file" className="hidden" onChange={handleImageUpload} accept="image/png,image/jpeg" />
                  {image && (
                    <div className="flex items-center space-x-2">
                      <span>{image.name}</span>
                      <Button variant="ghost" size="icon" onClick={() => { setImage(null); setImagePreview(null); }}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
                {imagePreview && (
                  <div className="mt-2 w-full max-h-24 ">
                    <img src={imagePreview} alt="Event preview" className=" max-h-24 rounded-md" />
                  </div>
                )}
                <p className="text-sm text-muted-foreground">ou faites glisser et déposez un PNG ou JPEG (max. 10 Mo)</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Votre description..." className="h-32" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Lieu</Label>
                <Input id="location" placeholder="Limoges, vejvre rve33v 3wevfg" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-attendees">Nombre de personne maximum</Label>
                <Input id="max-attendees" type="number" placeholder="12" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="visibility">Visibilité</Label>
                <Select>
                  <SelectTrigger id="visibility">
                    <SelectValue placeholder="Public" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Privé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="start-date">Date de début</Label>
                <div className="flex items-center">
                  <Input id="start-date" type="datetime-local" className="w-full" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">Date de fin</Label>
                <div className="flex items-center">
                  <Input id="end-date" type="datetime-local" className="w-full" />
                </div>
              </div>
              <div className="space-y-2 col-span-full">
                <Label htmlFor="invitee">Inviter des personnes</Label>
                <div className="flex space-x-2">
                  <Input
                    id="invitee"
                    value={inviteeInput}
                    onChange={(e) => setInviteeInput(e.target.value)}
                    placeholder="Email ou nom d'utilisateur"
                    className="flex-grow"
                  />
                  <Button type="button" onClick={handleAddInvitee}>
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Ajouter
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {invitees.map((invitee) => (
                    <Badge key={invitee.id} variant="secondary" className="px-2 py-1">
                      {invitee.value}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-1 h-4 w-4"
                        onClick={() => handleRemoveInvitee(invitee.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <Button className="w-fit" type="submit">
              Publier l'évènement
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  )
}