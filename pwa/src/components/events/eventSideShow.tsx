import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import EventInfoTag from "@/components/events/eventInfoTag"
import { X, Eye, MapPin, Users, Lock, Star, Mail } from 'lucide-react'
import CustomBadge from "@/components/utils/badge"
import Link from "next/link"
interface Event {
  id: string;
  title: string;
  image: string;
  dates: string;
  maxparticipant: number;
  visibility: number;
  location: string;
  userCount: number;
}


export default function EventSideShow({ event, user }: { event: Event, user: any ,  onUnsubscribe: () => void;}) {
  console.log(event, user)

  const participantsCount = event.maxparticipant ? event.maxparticipant.toString() : "0";

  return (
    <Card className="flex resize-x flex-col sticky top-0 w-full h-full cursor-default max-w-sm bg-white shadow-lg border-none p-0">
      <CardHeader className="flex h-fit flex-row items-center justify-between px-4  border-b">
        <CardTitle className="text-xl font-bold text-slate-600">{event.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col h-full overflow-y-scroll p-4">
        {/* image */}
        <div className="w-full h-40 bg-slate-100 rounded-lg mb-4">
          <img src={event.image} alt="Event" className="w-full h-full object-cover rounded-lg shadow-md" />
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
        {/* <Button variant="outline" className="w-full text-sm font-semibold">
          <Link href={`/events/${event.id}`} className="w-full flex items-center justify-center flex-row">
            <Pencil className="w-4 h-4 mr-2" />
            Éditer l&apos;événement
          </Link>
        </Button> */}
        <Button variant="outline" className="w-full  hover:bg-red-600 hover:text-white text-sm font-semibold">
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