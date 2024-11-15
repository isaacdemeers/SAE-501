import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import EventInfoTag from "@/components/events/eventInfoTag"
import { X, Share, Eye, Pencil, MapPin, Users, Lock, Star, Mail } from 'lucide-react'
import CustomBadge from "@/components/badge"
import Image from "next/image"
import eventImage from "@/image_mairie_limoges.png"

export default function HoverEventCard() {
  return (
    <Card className="flex flex-col w-full h-full max-w-sm bg-white shadow-lg">
      <CardHeader className="flex h-fit flex-row items-center justify-between px-4  border-b">
        <CardTitle className="text-xl font-bold text-slate-600">Event 1</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col h-full overflow-y-scroll p-4">
        {/* image */}
        <div className="w-full h-40 bg-slate-100 rounded-lg mb-4">
          <Image
            src=""
            alt="Event"
            width={300}
            height={160}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        <h3 className="font-semibold mb-2 text-sm">Dates</h3>
        <p className="text-xs text-slate-600 mb-4">Du 14 au 15 novembre 2024</p>
        <h3 className="font-semibold mb-2 text-sm">Tags</h3>

        <div className="flex items-center justify-start gap-2  mb-4">
          <CustomBadge icon={<Users />} content="23" color="red" />
          <CustomBadge icon={<Lock />} content="PUBLIC" color="blue" />
        </div>
        <h3 className="font-semibold mb-2 text-sm">Informations</h3>
        <ul className="flex flex-col gap-2">


          <EventInfoTag
            type="full"
            title="Lieu"
            icon={<MapPin />}
            content="24 Avenue du maréchal Juffre"
          />
          <EventInfoTag
            type="full"
            title="Organisateur"
            icon={<Star />}
            content="@MairiedeLimoges"
          />
          <EventInfoTag
            type="full"
            title="Contact"
            icon={<Mail />}
            content="mairie@limoges.fr"
          />

        </ul>


      </CardContent>

      <CardFooter className="flex flex-col justify-between pt-6 gap-2 border-t">
        <Button variant="outline" className="w-full  hover:bg-red-600 hover:text-white text-sm font-semibold">
          <X className="w-4 h-4 mr-2" />
          Quitter l&apos;événement
        </Button>
        <Button variant="outline" className="w-full text-sm font-semibold">
          <Pencil className="w-4 h-4 mr-2" />
          Éditer l&apos;événement
        </Button>
        <Button variant="default" className="w-full text-sm font-semibold">
          <Share className="w-4 h-4 mr-2" />
          Partager
        </Button>




        <Button variant="default" className="w-full text-sm font-semibold">
          <Eye className="w-4 h-4 mr-2 " />
          Voir l&apos;événement
        </Button>

      </CardFooter>
    </Card>
  )
}