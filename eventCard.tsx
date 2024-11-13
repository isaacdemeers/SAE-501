import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Circle, CirclePlus, Clock, Users, ChevronRight } from "lucide-react"
import { start } from "repl"


interface EventCardProps {
    title: string
    date: string
    isPublic: boolean
    attendees: number
    imageUrl: string
}

export default function EventCard({ title, date, isPublic, attendees, imageUrl }: EventCardProps) {
    return (
        <Card className="w-full relative sm:max-w-md max-w-xs flex h-fit ">

            <ChevronRight className="absolute sm:hidden right-4  h-full stroke-slate-600" />
            <div className="hidden sm:flex relative h-[calc(100% - 2rem)] w-full bg-slate-300 rounded-md m-4">
                <Image
                    src={imageUrl}
                    alt={title}
                    layout="fill"
                    objectFit="cover"
                    className="brightness-75 rounded-md"
                />
            </div>
            <CardContent className="p-4 pl-0 flex flex-col">
                <div className="flex justify-between items-start flex-col gap-2 mx-4 sm:mx-0 sm:gap-4">

                    <h2 className="sm:text-xl text-lg font-bold text-ellipsis w-60 overflow-hidden text-nowrap">{title}</h2>
                    <div className="flex items-center sm:mb-0 mb-1 text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        {date}
                    </div>
                    <div className="flex gap-4">
                        {isPublic && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs font-semibold">
                                PUBLIC
                            </span>
                        )}
                        {!isPublic && (
                            <span className="px-2 py-1 bg-red-100 text-red-800 rounded-md text-xs font-semibold">
                                PRIVATE
                            </span>
                        )}
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-md text-xs font-semibold flex items-center">
                            <Users className="w-3 h-3 mr-1" />
                            {attendees}
                        </span>
                    </div>

                </div>
                <CardFooter className="hidden sm:flex p-0 pt-4 justify-between w-full gap-4 ">
                    <Button variant="outline">Voir l&apos;événement</Button>
                    <Button className="flex gap-2">
                        <CirclePlus size={20} className=" stroke-white" />
                        S'inscrire

                    </Button>
                </CardFooter>
            </CardContent>

        </Card>
    )
}

let event = {

    dates: {
        start: "2024-10-31",
        end: "2024-11-30",
        createdAt: "2024-10-31",
        updatedAt: "2024-11-30",
    },
    creator: {
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com",
        username: "John Doe",
    },
    infos: {
        title: "Event 1",
        description: "Description de l'événement",
        isPublic: true,
        imageUrl: "https://via.placeholder.com/150",
        location: "Paris",
        deleted: '2024-11-30',

    },
    entrants: {
        max: 100,
        count: 50,
        list: [
            {
                id: 1,
                username: "John Doe",
                joinedAt: "2024-10-31"
            }
        ]
    }

}