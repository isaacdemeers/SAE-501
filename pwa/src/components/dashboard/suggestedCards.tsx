import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Calendar } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface EventCardProps {
    imageUrl: string
    location: string
    title: string
    description: string
    date: string
    buttonText: string
    id: string
    onRegister: () => void
}

export default function EventCard({
    imageUrl = "image error",
    location = "Location Error",
    title = "Title Error",
    description = "Description Error",
    date = "Date error",
    buttonText = "Voir l'Événement",
    id = "1",
    onRegister = () => console.log("Register clicked"),
}: EventCardProps) {
    return (
        <Card className="overflow-hidden">
            <article className="flex flex-col sm:flex-row gap-4 p-4">
                <div className="w-full sm:w-[200px] h-[130px] overflow-hidden rounded-md">
                    <img
                        width={200}
                        height={130}
                        src={imageUrl}
                        alt="Event Image"
                        className="object-cover w-full h-full"
                    />
                </div>
                <CardContent className="flex-1 flex p-0 flex-col gap-2">
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground ">
                        <MapPin size={16} />
                        <span>{location}</span>
                    </div>
                    <h2 className="text-xl font-bold leading-tight ">{title}</h2>
                    <p className="text-sm text-muted-foreground ">{description}</p>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Calendar size={16} />
                        <span>{date}</span>
                    </div>
                    <Link href={`/event/${id}`}>
                        <Button
                            variant="default"
                            // onClick={onRegister}
                            className="self-start">
                            {buttonText}
                        </Button>
                    </Link>
                </CardContent>
            </article>
        </Card>
    )
}