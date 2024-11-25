

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Clock, Users } from "lucide-react"
import Component from "@/components/events/eventForm"
import { Calendar, EventSideShow } from "@/components/calendar/calendar"
import SearchResult from "@/components/search/searchResult"
import Header from "@/components/header/header"

export default function Home() {

    let EventCardProps = {
        title: "Event 1",
        date: "18 janvier 2024",
        isPublic: true,
        attendees: 23,
        imageUrl: "/placeholder.svg?height=200&width=300"
    }

    return (
        <div className=" md:flex-row gap-4 flex-col flex items-start p-4 mb-4 pt-24 h-fit min-h-screen overflow-hidden left-0 w-full">
            {/* <FilterBox />
            <EventCard title="Event sjhdfgkjsGFKSGKDJFHSDKGQFJHGDKJFHQGSDKJHFGSD1" date="10 janvier 3000" isPublic={false} attendees={30} imageUrl="/img.jpg" /> */}
            {/* <Component /> */}
            {/* <SearchResult /> */}
            <Calendar />
            <EventSideShow />


        </div>
    )

}