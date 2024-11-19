'use client'

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Filter, Heading1, AtSign, Captions, Clock, Lock, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

const filterOptions = [
    { id: "date", label: "Date" },
    { id: "title", label: "Title" },
    { id: "description", label: "Description" },
    { id: "private", label: "Private" },
    { id: "subscribed", label: "Subscribed" },
    { id: "users", label: "Users" },
]

export default function FilterBox() {
    const [selectedFilters, setSelectedFilters] = React.useState<string[]>([])
    const [isCollapsed, setIsCollapsed] = React.useState(true)

    const handleFilterChange = (filterId: string) => {
        setSelectedFilters((prev) =>
            prev.includes(filterId)
                ? prev.filter((id) => id !== filterId)
                : [...prev, filterId]
        )
    }

    const iconClasses = "transition-[transform,opacity, cubic-bezier(0.5, 0, 0.75, 0)] [animation-delay:600ms] duration-500 w-4 h-4 text-slate-600 "
    const buttonClasses = "transition-all duration-300 bg-transparent hover:bg-slate-100 p-2 h-fit"

    return (
        <Card className="w-full flex items-center justify-between px-3 py-2 gap-2 overflow-hidden">
            <h1 className="font-semibold text-slate-600 w-full">Résultats de la recherche</h1>

            <section id="filter-buttons" className={`flex transition-[transform,opacity, cubic-bezier(0.5, 0, 0.75, 0)] duration-300 items-center justify-center gap-2 ${isCollapsed ? 'translate-x-[86%]' : 'translate-x-0'}`} >
                <Button
                    variant="default"
                    className={`${buttonClasses} ${'overflow-hidden'} `}
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    <Filter className={`${iconClasses} ${'absolute'} ${isCollapsed ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`} />
                    <ChevronRight className={`${iconClasses} ${isCollapsed ? 'opacity-0 translate-x-6' : 'opacity-100 translate-x-0'}`} />
                </Button>
                <Separator orientation="vertical" className="h-6" />
                <Button variant="default" className={buttonClasses}>
                    <Heading1 className={iconClasses} />
                </Button>

                <Button variant="default" className={buttonClasses}>
                    <Captions className={iconClasses} />
                </Button>
                <Button variant="default" className={buttonClasses}>
                    <AtSign className={iconClasses} />
                </Button>
                <Button variant="default" className={buttonClasses}>
                    <Lock className={iconClasses} />
                </Button>

            </section>
        </Card >
    )
}