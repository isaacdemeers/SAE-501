'use client'

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Filter, Heading1, AtSign, Captions, Clock, Lock, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface FilterBoxProps {
    onFiltersChange: (filters: string[]) => void;
}

export const filterOptions = [
    { id: "date", label: "Date", icon: Clock, color: "bg-orange-100" },
    { id: "title", label: "Titre", icon: Heading1, color: "bg-indigo-100" },
    { id: "description", label: "Description", icon: Captions, color: "bg-emerald-100" },
    { id: "users", label: "NOT WORKING", icon: AtSign, color: "bg-yellow-100" },
    { id: "private", label: "Vos événements privés", icon: Lock, color: "bg-red-100" },
]

export default function FilterBox({ onFiltersChange }: FilterBoxProps) {
    const [activeFilter, setActiveFilter] = React.useState<string | null>(null)
    const [isCollapsed, setIsCollapsed] = React.useState(true)

    const handleFilterClick = (filterId: string) => {
        const newFilter = activeFilter === filterId ? null : filterId;
        setActiveFilter(newFilter);
        onFiltersChange(newFilter ? [newFilter] : []);
    }

    const iconClasses = "transition-[transform,opacity, cubic-bezier(0.5, 0, 0.75, 0)] [animation-delay:600ms] duration-500 w-4 h-4 text-slate-600"
    const buttonClasses = "transition-all duration-300 bg-transparent hover:bg-slate-100 p-2 h-fit"

    return (
        <Card className="w-full flex items-center justify-between px-3 py-2 gap-2 overflow-hidden">
            <h1 className="font-semibold text-slate-600 w-full">Résultats de la recherche</h1>

            <section id="filter-buttons" className={`flex transition-[transform,opacity, cubic-bezier(0.5, 0, 0.75, 0)] duration-300 items-center justify-start gap-2 ${isCollapsed ? 'translate-x-[89%]' : 'translate-x-0'}`} >
                <Button
                    variant="default"
                    className={`${buttonClasses} ${'overflow-hidden'}`}
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    <Filter className={`${iconClasses} ${'absolute'} ${isCollapsed ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`} />
                    <ChevronRight className={`${iconClasses} ${isCollapsed ? 'opacity-0 translate-x-6' : 'opacity-100 translate-x-0'}`} />
                </Button>
                <Separator orientation="vertical" className="h-6" />

                {/* tous sauf le dernier */}
                {filterOptions.slice(0, -1).map(option => (
                    <Button
                        key={option.id}
                        variant="default"
                        className={`${buttonClasses} ${activeFilter === option.id ? 'bg-slate-200' : ''}`}
                        onClick={() => handleFilterClick(option.id)}
                    >
                        <option.icon className={iconClasses} />
                    </Button>
                ))}

                <Separator orientation="vertical" className="h-6" />
                <Button
                    key="private"
                    variant="default"
                    className={`${buttonClasses} ${activeFilter === "private" ? 'bg-slate-200' : ''}`}
                    onClick={() => handleFilterClick(filterOptions[filterOptions.length - 1].id)}
                >
                    {React.createElement(filterOptions[filterOptions.length - 1].icon, { className: iconClasses })}
                </Button>
            </section>
        </Card>
    )
}