"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, UploadIcon, X } from "lucide-react"
import API_BASE_URL from '../../utils/apiConfig';

export default function EventForm() {
  const [eventName, setEventName] = useState('');
  const [eventStartDate, setEventStartDate] = useState('');
  const [eventEndDate, setEventEndDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventImage, setEventImage] = useState<File | null>(null);
  const [eventDescription, setEventDescription] = useState('');
  const [eventVisibility, setEventVisibility] = useState('public');
  const [maxParticipants, setMaxParticipants] = useState<number | ''>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      const today = new Date().toISOString().split('T')[0];
      if (eventStartDate < today) {
          setErrorMessage('Event start date cannot be before today.');
          return;
      }

      if (eventEndDate <= eventStartDate) {
          setErrorMessage('Event end date must be after the start date.');
          return;
      }

      const formData = new FormData();
      formData.append('title', eventName);
      formData.append('datestart', new Date(eventStartDate).toISOString());
      formData.append('dateend', new Date(eventEndDate).toISOString());
      formData.append('location', eventLocation);
      if (eventImage) {
          formData.append('img', eventImage, eventImage.name);
      }
      formData.append('description', eventDescription);
      formData.append('visibility', eventVisibility);
      formData.append('maxparticipant', maxParticipants.toString());

      try {
          const response = await fetch(`${API_BASE_URL}/events`, {
              method: 'POST',
              body: formData,
          });

          if (!response.ok) {
              throw new Error('Network response was not ok');
          }

          const result = await response.json();
          console.log('Event created successfully:', result);
      } catch (error) {
          console.error('Error creating event:', error);
      }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          if (file.size > 10 * 1024 * 1024) { // 8MB in bytes
              setErrorMessage('File size should not exceed 8MB');
              setEventImage(null);
              e.target.value = ''; // Clear the input value
          } else {
              setErrorMessage(null);
              setEventImage(file);
          }
      }
  };

  return (
    <Card className=" w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex justify-center items-center text-3xl font-bold">Créer un évènement</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {errorMessage && (
            <div className="p-4 text-red-600 bg-red-100 rounded-md">
              {errorMessage}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre</Label>
              <Input id="title" placeholder="Titre de l'évènement" value={eventName} onChange={(e) => setEventName(e.target.value)} />
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
                <Input id="image" type="file" className="hidden" onChange={handleImageChange} accept="image/png,image/jpeg" />
                {eventImage && (
                  <div className="flex items-center space-x-2">
                    <span>{eventImage.name}</span>
                    <Button variant="ghost" size="icon" onClick={() => setEventImage(null)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground">ou faites glisser et déposez un PNG ou JPEG (max. 10 Mo)</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Votre description..." className="h-32" value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Lieu</Label>
              <Input id="location" placeholder="Limoges, vejvre rve33v 3wevfg" value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max-attendees">Nombre de personne maximum</Label>
              <Input id="max-attendees" type="number" placeholder="12" value={maxParticipants} onChange={(e) => setMaxParticipants(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="visibility">Visibilité</Label>
              <Select value={eventVisibility} onValueChange={setEventVisibility}>
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
                <Input id="start-date" type="datetime-local" className="w-full" value={eventStartDate} onChange={(e) => setEventStartDate(e.target.value)} />
                <CalendarIcon className="w-5 h-5 ml-2 text-muted-foreground" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="end-date">Date de fin</Label>
              <div className="flex items-center">
                <Input id="end-date" type="datetime-local" className="w-full" value={eventEndDate} onChange={(e) => setEventEndDate(e.target.value)} />
                <CalendarIcon className="w-5 h-5 ml-2 text-muted-foreground" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="invitee">Invité des personnes</Label>
              <Input id="invitee" type="email" placeholder="Adresse mail de l'inviter" />
            </div>
          </div>
          <Button className="w-full" type="submit">
            Publier l'évènement
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}