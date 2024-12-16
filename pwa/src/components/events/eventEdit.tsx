"use client";
import { CalendarIcon, Upload } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { UpdateEvent } from "@/lib/request";
import { Label } from "@/components/ui/label";
import { DeleteEvent } from "@/lib/request";
const formSchema = z.object({
  title: z.string().min(2, {
    message: "Le titre doit contenir au moins 2 caractères.",
  }),
  description: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  location: z.string().min(2, {
    message: "Le lieu est requis.",
  }),
  maxAttendees: z.string(),
  visibility: z.enum(["public", "private"]),
  inviteeEmail: z.string().email().optional().or(z.literal("")),
  image: z.any().optional(),
});

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

interface EventFormProps {
  event: Event;
  onClose: () => void;
  onUpdate: () => void;
}

interface Event {
  id: number;
  title: string;
  description: string;
  datestart: string;
  dateend: string;
  location: string;
  maxparticipant: number;
  img: string;
  sharelink: string;
  visibility: boolean;
  userCount: number;
  adminEmail: string;
  adminUsername: string;
  userevents: string;
}

export default function EventForm({ event, onClose, onUpdate }: EventFormProps) {
  const [image, setImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>("test");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [endTime, setEndTime] = useState("12:00");
  const [startTime, setStartTime] = useState("12:00");

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        title: event.title,
        description: event.description,
        startDate: new Date(event.datestart),
        endDate: new Date(event.dateend),
        location: event.location,
        maxAttendees: event.maxparticipant.toString(),
        visibility: event.visibility ? "public" : "private",
        image: null,
      },
    });


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
  
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
      try {
      setIsSubmitting(true);
      setError(null);

      // Vérifier si la date de début est supérieure à la date de fin
      if (values.startDate && values.endDate && values.startDate > values.endDate) {
        setError("La date de début ne peut pas être supérieure à la date de fin.");
        setIsSubmitting(false);
        return;
      }

      // Créer l'objet de données à envoyer
      const formData: any = {};

      // Ne mettre à jour que les champs modifiés
      if (values.title !== event.title) {
        formData.title = values.title;
      }
      if (values.description !== event.description) {
        formData.description = values.description;
      }
      if (values.startDate) {
        const adjustedStartDate = new Date(values.startDate);
        adjustedStartDate.setDate(adjustedStartDate.getDate() + 1);
        formData.datestart = adjustedStartDate.toISOString().split('.')[0];
      }
      if (values.endDate) {
        const adjustedEndDate = new Date(values.endDate);
        adjustedEndDate.setDate(adjustedEndDate.getDate() + 1);
        formData.dateend = adjustedEndDate.toISOString().split('.')[0];
      }
      if (values.location !== event.location) {
        formData.location = values.location;
      }
      if (values.maxAttendees !== event.maxparticipant.toString()) {
        formData.maxparticipant = parseInt(values.maxAttendees);
      }
      if ((values.visibility === "public") !== event.visibility) {
        formData.visibility = values.visibility;
      }
      if(values.image !== null) {
        formData.image = image;
      }

      // N'envoyer la requête que si des modifications ont été faites
      if (Object.keys(formData).length > 0) {
        const response = await UpdateEvent(event.id, formData);
        if (response.event) {
        onUpdate?.();
        onClose?.();
        }
      } else {
        onClose?.();
      }
      } catch (err) {
      const error = err as Error;
      setError(error.message || "Une erreur est survenue lors de la mise à jour");
      console.error("Erreur lors de la mise à jour:", err);
      } finally {
      setIsSubmitting(false);
    }
  };


  const DeleteEvents = async () => {
    try {
      const response = await(DeleteEvent(event.id));
      if (!response.ok) {
        setError("Une erreur est survenue lors de la suppression de l'évènement");
      }
      window.location.href=("/");
      onUpdate?.();
      onClose?.();
    } catch (err) {
      const error = err as Error;
      setError(error.message || "Une erreur est survenue lors de la suppression");
      console.error("Erreur lors de la suppression:", err);
    }
  }


const handleCancel = () => {
  setIsPopoverOpen(false);
};

const handleDelete = () => {
  DeleteEvents();
  setIsPopoverOpen(false);
};

  return (
    <Card className="w-full max-w-2xl mx-auto">
       {error && (
        <p className="flex items-center justify-center text-red-500 text-sm mt-4">{error}</p>
      )}
   <CardHeader className="flex flex-row justify-between">
      <CardTitle className="text-3xl font-bold">Modifications</CardTitle>
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button className="w-fit" onClick={() => setIsPopoverOpen(true)}>Supprimer l'évènement</Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="p-4">
            <p>Êtes-vous sûr de vouloir supprimer l'évènement ?</p>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={handleCancel}>Annuler</Button>
              <Button variant="destructive" onClick={handleDelete}>Supprimer</Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre</FormLabel>
                  <FormControl>
                    <Input placeholder="Titre de l'événement" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Votre description..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Donner une image à votre événement :</FormLabel>
                    <FormControl>
                      <div
                        className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary"
                        onClick={() =>
                          document.getElementById("image-upload")?.click()
                        }
                      >
                        <input
                          id="image-upload"
                          type="file"
                          className="hidden"
                          accept="image/png,image/jpeg"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              setImage(file);
                              setImagePreview(URL.createObjectURL(file));
                            }
                            field.onChange(e);
                            }}
                          />
                          {imagePreview ? (
                            <div className="mt-4">
                            <img
                              src={imagePreview}
                              alt="Aperçu de l'image"
                              className="max-h-40 mx-auto"
                            />
                            </div>
                          ) : (
                            <>
                            <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                            <p className="mt-2 text-sm text-muted-foreground">
                              Cliquez pour télécharger ou faites glisser et déposez un
                              PNG ou JPEG (max. 10 Mo)
                            </p>
                            </>
                          )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
  
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date de début</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              formatDate(field.value)
                            ) : (
                              <span>Choisir une date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date de fin</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              formatDate(field.value)
                            ) : (
                              <span>Choisir une date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
  
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lieu</FormLabel>
                    <FormControl>
                      <Input placeholder="Adresse de l'événement" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
  
              <FormField
                control={form.control}
                name="maxAttendees"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de personne maximum</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="12" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
  
              <FormField
                control={form.control}
                name="visibility"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Visibilité</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez la visibilité" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="private">Privé</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
  
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Annuler
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Mise à jour..." : "Sauvegarder"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    );
  }