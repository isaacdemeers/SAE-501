"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, UploadIcon, X } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { AddEvent } from "@/lib/request";

export default function EventForm({ onClose }: { onClose: () => void }) {
  const [eventName, setEventName] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [startTime, setStartTime] = useState("12:00");
  const [endDate, setEndDate] = useState<Date>();
  const [endTime, setEndTime] = useState("12:00");
  const [eventLocation, setEventLocation] = useState("");
  const [eventImage, setEventImage] = useState<File | null>(null);
  const [eventDescription, setEventDescription] = useState("");
  const [eventVisibility, setEventVisibility] = useState("public");
  const [maxParticipants, setMaxParticipants] = useState<number | "">("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [invitees, setInvitees] = useState<string[]>([]);
  const [inviteeEmail, setInviteeEmail] = useState("");

  const handleAddInvitee = () => {
    if (inviteeEmail && !invitees.includes(inviteeEmail)) {
      setInvitees([...invitees, inviteeEmail]);
      setInviteeEmail("");
    }
  };

  const handleRemoveInvitee = (email: string) => {
    setInvitees(invitees.filter((invitee) => invitee !== email));
  };

  // Function to combine date and time
  const combineDateAndTime = (
    date: Date | undefined,
    time: string
  ): Date | undefined => {
    if (!date) return undefined;
    const [hours, minutes] = time.split(":").map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours, minutes);
    return newDate;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      setErrorMessage("Veuillez sélectionner les dates de début et de fin.");
      return;
    }

    const fullStartDate = combineDateAndTime(startDate, startTime);
    const fullEndDate = combineDateAndTime(endDate, endTime);

    if (!fullStartDate || !fullEndDate) {
      setErrorMessage("Dates invalides.");
      return;
    }

    if (fullEndDate <= fullStartDate) {
      setErrorMessage("La date de fin doit être après la date de début.");
      return;
    }

    const formData = new FormData();
    formData.append("title", eventName);
    formData.append("datestart", fullStartDate.toISOString());
    formData.append("dateend", fullEndDate.toISOString());
    formData.append("location", eventLocation);
    if (eventImage) {
      formData.append("img", eventImage, eventImage.name);
    }
    formData.append("description", eventDescription);
    formData.append("visibility", eventVisibility);
    formData.append("maxparticipant", maxParticipants.toString());
    formData.append("invitees", JSON.stringify(invitees));

    let response = await AddEvent(formData);
    if (response.message === "Event created successfully") {
      onClose();
    } else {
      setErrorMessage(
        "An error occurred while adding the event. Please try again."
      );
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        // 8MB in bytes
        setErrorMessage("File size should not exceed 8MB");
        setEventImage(null);
        e.target.value = ""; // Clear the input value
      } else {
        setErrorMessage(null);
        setEventImage(file);
      }
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit}>
        {errorMessage && (
          <div
            className={`mb-4 p-4 rounded-md ${errorMessage === "Event created successfully"
              ? "text-green-600 bg-green-100"
              : "text-red-600 bg-red-100"
              }`}
          >
            {errorMessage}
          </div>
        )}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                placeholder="Titre de l'évènement..."
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Votre description..."
                className="h-32"
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Lieu</Label>
              <Input
                id="location"
                placeholder="Lieu de l'évènement..."
                value={eventLocation}
                onChange={(e) => setEventLocation(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image de l&apos;évènement</Label>
              <div className="flex items-center space-x-2">
                <Label htmlFor="image" className="cursor-pointer">
                  <div className="flex items-center px-4 py-2 space-x-2 rounded-md bg-secondary text-secondary-foreground">
                    <UploadIcon className="w-5 h-5" />
                    <span>Télécharger</span>
                  </div>
                </Label>
                <Input
                  id="image"
                  type="file"
                  className="hidden"
                  onChange={handleImageChange}
                  accept="image/png,image/jpeg"
                />
                {eventImage && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">{eventImage.name}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEventImage(null)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                PNG ou JPEG (max. 10 Mo)
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col space-y-6">
            <div className="space-y-6 flex-1">
              {/* Date inputs */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date et heure de début</Label>
                  <div className="flex flex-col gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !startDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? (
                            format(startDate, "PPP", { locale: fr })
                          ) : (
                            <span>Sélectionner une date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                          initialFocus
                          locale={fr}
                        />
                      </PopoverContent>
                    </Popover>
                    <div className="flex items-center gap-2">
                      <Label className="w-20">Heure :</Label>
                      <Select value={startTime} onValueChange={setStartTime}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Sélectionner l'heure" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }, (_, hour) =>
                            Array.from({ length: 4 }, (_, quarterHour) => {
                              const minutes = quarterHour * 15;
                              const timeString = `${hour
                                .toString()
                                .padStart(2, "0")}:${minutes
                                  .toString()
                                  .padStart(2, "0")}`;
                              return (
                                <SelectItem key={timeString} value={timeString}>
                                  {timeString}
                                </SelectItem>
                              );
                            })
                          ).flat()}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Date et heure de fin</Label>
                  <div className="flex flex-col gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !endDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? (
                            format(endDate, "PPP", { locale: fr })
                          ) : (
                            <span>Sélectionner une date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          initialFocus
                          locale={fr}
                          disabled={(date) =>
                            startDate ? date < startDate : false
                          }
                        />
                      </PopoverContent>
                    </Popover>
                    <div className="flex items-center gap-2">
                      <Label className="w-20">Heure :</Label>
                      <Select value={endTime} onValueChange={setEndTime}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Sélectionner l'heure" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }, (_, hour) =>
                            Array.from({ length: 4 }, (_, quarterHour) => {
                              const minutes = quarterHour * 15;
                              const timeString = `${hour
                                .toString()
                                .padStart(2, "0")}:${minutes
                                  .toString()
                                  .padStart(2, "0")}`;
                              return (
                                <SelectItem key={timeString} value={timeString}>
                                  {timeString}
                                </SelectItem>
                              );
                            })
                          ).flat()}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Max attendees and visibility */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="max-attendees">Nombre maximum</Label>
                  <Input
                    id="max-attendees"
                    type="number"
                    placeholder="-"
                    value={maxParticipants}
                    min={0}
                    onChange={(e) =>
                      setMaxParticipants(
                        e.target.value === "" ? "" : parseInt(e.target.value)
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="visibility">Visibilité</Label>
                  <Select
                    value={eventVisibility}
                    onValueChange={setEventVisibility}
                  >
                    <SelectTrigger id="visibility">
                      <SelectValue placeholder="Public" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Privé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Invitees section */}
              <div className="space-y-2">
                <Label htmlFor="invitee">Inviter des personnes</Label>
                <div className="flex gap-2">
                  <Input
                    id="invitee"
                    type="email"
                    placeholder="Adresse mail de l'invité..."
                    value={inviteeEmail}
                    onChange={(e) => setInviteeEmail(e.target.value)}
                  />
                  <Button
                    type="button"
                    onClick={handleAddInvitee}
                    disabled={!inviteeEmail || invitees.includes(inviteeEmail)}
                  >
                    Ajouter
                  </Button>
                </div>
                {invitees.length > 0 && (
                  <ul className="mt-2 space-y-2">
                    {invitees.map((email, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between w-fit pl-3 pr-0 border-black border-2 rounded-full"
                      >
                        <span className="pr-3">{email}</span>
                        <Button
                          className="rounded-full bg-inherit hover:text-white text-black"
                          size="icon"
                          onClick={() => handleRemoveInvitee(email)}
                        >
                          <X className="w-4 h-4 rounded-full font-bold" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Publish button at the bottom */}
            <div className="flex justify-end">
              <Button type="submit" className="w-1/2">
                Publier l&apos;évènement
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
