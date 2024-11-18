import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Circle, CirclePlus, Clock, Users, ChevronRight, Eye, Lock, LockOpen } from "lucide-react"
import CustomBadge from "@/components/utils/badge"
import EventInfoTag from "@/components/events/eventInfoTag"
import { Separator } from "@/components/ui/separator"


interface EventCardProps {
    title: string
    date: string
    isPublic: boolean
    attendees: number
    imageUrl: string
    type: string
}



export default function EventCard({ title, date, isPublic, attendees, imageUrl, type }: EventCardProps) {
    let tags = ''
    return (
        type === "searchResult" ? (
            <Card className={`w-full flex relative text-slate-600  overflow-hidden`}>

                <section className=" absolute  w-full h-full flex items-center justify-center ">
                    <Image
                        src={imageUrl}
                        alt={title}
                        layout="fill"
                        objectFit="cover"
                        className="brightness-75 rounded-md opacity-70"
                    />
                    <div className=" absolute top-0 left-0 bg-gradient-to-r from-white  via-white to-transparent h-full w-full"></div>
                </section>

                <CardContent className="flex z-10 flex-col w-full p-4 gap-2 bg-transparent">

                    <h2 className="sm:text-xl text-lg font-bold text-ellipsis w-11/12 overflow-hidden text-nowrap">{title}</h2>

                    <div className="flex gap-4 w-full  justify-between items-center">
                        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-start gap-4">
                            <div className="flex items-center justify-between h-10  gap-2 rounded-lg">
                                <Clock className="w-4 h-4 mr-1" />
                                <p className="text-xs text-slate-600">{date}</p>
                            </div>
                            <Separator orientation="vertical" className="h-5" />
                            <ul className="flex items-center justify-between h-10  gap-2 rounded-lg">
                                <li>
                                    {isPublic && (
                                        <CustomBadge color="blue" content="PUBLIC" icon={<LockOpen />} />
                                    )}
                                    {!isPublic && (
                                        <CustomBadge color="red" content="PRIVATE" icon={<Lock />} />
                                    )}
                                </li>
                                <li>
                                    <CustomBadge color="green" content={attendees.toString()} icon={<Users />} />
                                </li>
                            </ul>
                        </div>
                        <div className="flex flex-col lg:flex-row gap-2 items-end justify-center lg:items-center   rounded-lg">
                            <Button variant="outline">
                                <Eye className="w-4 h-4 mr-2 " />
                                Voir l&apos;événement
                            </Button>
                            <Button className="flex gap-2">
                                <CirclePlus size={16} className=" stroke-white" />
                                S'inscrire
                            </Button>
                        </div>

                    </div>

                </CardContent>
            </Card>
        ) : (
            <Card className={`w-full flex relative sm:max-w-md max-w-xs`}>
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