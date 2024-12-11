import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Calendar } from "lucide-react"
import Link from "next/link"

interface MyEventCardProps {
    eventId: string
    imageUrl: string
    location: string
    title: string
    date: string
}

export default function MyEventCard({
    eventId,
    imageUrl,
    location,
    title,
    date,
}: MyEventCardProps) {
    const formattedDate = date ? new Date(date.replace(' ', 'T')).toLocaleString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    }) : 'Date non disponible';


    return (
        <Link href={`/events/${eventId}`}>
            <Card className="overflow-hidden duration-300 hover:cursor-pointer hover:bg-slate-50">
                <div className="grid grid-cols-[1fr_2fr] p-4 gap-4">
                    <div className="w-full overflow-hidden aspect-[200/130] rounded-md">
                        <img
                            width={200}
                            height={130}
                            src={imageUrl || '/default-event-image.jpg'}
                            alt="Event"
                            className="object-cover w-full h-full"
                        />
                    </div>
                    <CardContent className="flex-1 p-0 flex flex-col gap-2 justify-center">
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <MapPin size={18} className="text-gray-500" />
                            <span>{location}</span>
                        </div>
                        <h3 className="text-md leading-tight">{title}</h3>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Calendar size={18} className="text-gray-500" />
                            <span>{formattedDate}</span>
                        </div>
                    </CardContent>
                </div>
            </Card>
        </Link>
    )
}