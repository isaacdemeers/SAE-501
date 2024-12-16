import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import EventInfoTag from "@/components/events/eventInfoTag"
import { X, Share, Eye, Pencil, MapPin, Users, Lock, Star, Mail, UserCog } from 'lucide-react'
import CustomBadge from "@/components/utils/badge"
import Image from "next/image"
import eventImage from "@images/image_mairie_limoges.png"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useState } from "react"
import EventModerate from "./eventModerate"
import EventEdit from "./eventEdit"

interface Event {
  id: string;
  title: string;
  image: string;
  dates: string;
  maxparticipant: number;
  visibility: number;
  location: string;
  adminEmail: string;
  description: string;
}

interface User {
  id: number;
  email: string;
  username: string;
}

export default function EventSideShow({
  event,
  user,
  refreshSidePanel
}: {
  event: Event,
  user: User,
  refreshSidePanel: (eventId: string) => Promise<void>
}) {
  const [showModerateDialog, setShowModerateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const participantsCount = event.maxparticipant ? event.maxparticipant.toString() : "0";

  // Helper function to parse date strings
  const parseDateString = (dateStr: string) => {
    const months: { [key: string]: number } = {
      'janvier': 0, 'février': 1, 'mars': 2, 'avril': 3, 'mai': 4, 'juin': 5,
      'juillet': 6, 'août': 7, 'septembre': 8, 'octobre': 9, 'novembre': 10, 'décembre': 11
    };

    const parseDate = (str: string) => {
      const [day, month, year] = str.trim().split(' ');
      return new Date(parseInt(year), months[month.toLowerCase()], parseInt(day));
    };

    const parseTime = (timeStr: string) => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return { hours, minutes };
    };

    if (dateStr.includes('au')) {
      // Format: "Du 15 mars 2024 à 14:00 au 16 mars 2024 à 15:00"
      const [startPart, endPart] = dateStr.split(' au ');
      const startDateStr = startPart.replace('Du ', '').split(' à ')[0];
      const startTimeStr = startPart.split(' à ')[1];
      const endDateStr = endPart.split(' à ')[0];
      const endTimeStr = endPart.split(' à ')[1];

      const startDate = parseDate(startDateStr);
      const endDate = parseDate(endDateStr);
      const startTime = parseTime(startTimeStr);
      const endTime = parseTime(endTimeStr);

      startDate.setHours(startTime.hours, startTime.minutes);
      endDate.setHours(endTime.hours, endTime.minutes);

      return { startDate, endDate };
    } else {
      // Format: "Le 15 mars 2024, de 14:00 à 15:00"
      const datePart = dateStr.replace('Le ', '').split(', ')[0];
      const timePart = dateStr.split(', de ')[1];
      const [startTimeStr, endTimeStr] = timePart.split(' à ');

      const date = parseDate(datePart);
      const startTime = parseTime(startTimeStr);
      const endTime = parseTime(endTimeStr);

      const startDate = new Date(date);
      const endDate = new Date(date);
      startDate.setHours(startTime.hours, startTime.minutes);
      endDate.setHours(endTime.hours, endTime.minutes);

      return { startDate, endDate };
    }
  };

  const { startDate, endDate } = parseDateString(event.dates);

  const formattedEvent = {
    id: Number(event.id),
    title: event.title,
    description: event.description,
    datestart: startDate.toISOString(),
    dateend: endDate.toISOString(),
    location: event.location,
    maxparticipant: event.maxparticipant,
    img: event.image,
    sharelink: "",
    visibility: event.visibility === 1,
    userCount: 0,
    adminEmail: event.adminEmail,
    adminUsername: user.username,
    userevents: ""
  };

  const refreshEventData = async () => {
    try {
      // Close the dialog
      setShowEditDialog(false);

      // Refresh the side panel with updated data
      await refreshSidePanel(event.id);

    } catch (error) {
      console.error('Error refreshing event data:', error);
    }
  };

  return (
    <Card className="flex resize-x flex-col sticky top-0 w-full h-full cursor-default max-w-sm bg-white shadow-lg border-none p-0">
      <CardHeader className="flex h-fit flex-row items-center justify-between px-4  border-b">
        <CardTitle className="text-xl font-bold text-slate-600">{event.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col h-full overflow-y-scroll p-4">
        {/* image */}
        <div className="w-full h-40 bg-slate-100 rounded-lg mb-4">
          <img src={eventImage.src} alt="Event" className="w-full h-full object-cover rounded-lg shadow-md" />
        </div>

        <h3 className="font-semibold mb-2 text-sm">Dates</h3>
        <p className="text-xs text-slate-600 mb-4">{event.dates}</p>
        <h3 className="font-semibold mb-2 text-sm">Tags</h3>

        <div className="flex items-center justify-start gap-2  mb-4">
          <CustomBadge icon={<Users />} content={participantsCount} color={2} />
          <CustomBadge icon={<Lock />} content={event.visibility === 1 ? "PUBLIC" : "PRIVATE"} color={1} />
        </div>
        <h3 className="font-semibold mb-2 text-sm">Informations</h3>
        <ul className="flex flex-col gap-2">


          <EventInfoTag
            type="full"
            title="Lieu"
            icon={<MapPin />}
            content={event.location}
          />
          <EventInfoTag
            type="full"
            title="Organisateur"
            icon={<Star />}
            content={user.username}
          />
          <EventInfoTag
            type="full"
            title="Contact"
            icon={<Mail />}
            content={user.email}
          />

        </ul>


      </CardContent>

      <CardFooter className="flex flex-col justify-between pt-6 gap-2 border-t">
        <Button variant="default" className="w-full text-sm font-semibold">
          <Link href={`/events/${event.id}`} className="w-full flex items-center justify-center flex-row">
            <Eye className="w-4 h-4 mr-2 " />
            Voir l&apos;événement
          </Link>
        </Button>

        <>
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <Button
              variant="outline"
              className="w-full text-sm font-semibold"
              onClick={() => setShowEditDialog(true)}
            >
              <Pencil className="w-4 h-4 mr-2" />
              Éditer l&apos;événement
            </Button>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="hidden text-lg font-bold">
                  Éditer l&apos;événement
                </DialogTitle>
              </DialogHeader>
              <EventEdit
                event={formattedEvent}
                onClose={() => setShowEditDialog(false)}
                onUpdate={refreshEventData}
              />
            </DialogContent>
          </Dialog>

          <Dialog open={showModerateDialog} onOpenChange={setShowModerateDialog}>
            <Button
              variant="outline"
              className="w-full text-sm font-semibold"
              onClick={() => setShowModerateDialog(true)}
            >
              <UserCog className="w-4 h-4 mr-2" />
              Modérer l&apos;événement
            </Button>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="hidden text-lg font-bold">
                  Modérer l&apos;événement
                </DialogTitle>
              </DialogHeader>
              <EventModerate eventId={Number(event.id)} />
            </DialogContent>
          </Dialog>
        </>

        <Button variant="outline" className="w-full hover:bg-red-600 hover:text-white text-sm font-semibold">
          <X className="w-4 h-4 mr-2" />
          Quitter l&apos;événement
        </Button>

        {/* <Button variant="default" className="w-full text-sm font-semibold">
          <Share className="w-4 h-4 mr-2" />
          Partager
        </Button> */}






      </CardFooter>
    </Card>
  )
}