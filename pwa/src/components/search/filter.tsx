'use client'

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Filter, Heading1, AtSign, Captions, Clock, Lock, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

interface FilterBoxProps {
    onFiltersChange: (filters: string[]) => void;
}

export const filterOptions = [
    { id: "title", label: "Titre", icon: Heading1, color: "bg-indigo-100" },
    { id: "description", label: "Description", icon: Captions, color: "bg-emerald-100" },
    { id: "date", label: "Date", icon: Clock, color: "bg-orange-100" },
    { id: "users", label: "NOT WORKING", icon: AtSign, color: "bg-yellow-100" },
    { id: "private", label: "vos événements privés", icon: Lock, color: "bg-red-100" },
]

export default function FilterBox({ onFiltersChange }: FilterBoxProps) {
    const [activeFilters, setActiveFilters] = React.useState<string[]>(["title"])

    React.useEffect(() => {
        onFiltersChange(["title"]);
    }, []);

    const handleFilterClick = (filterId: string) => {
        if (filterId === "private") {
            setActiveFilters(prev => {
                const newFilters = prev.includes("private")
                    ? prev.filter(f => f !== "private")
                    : [...prev, "private"];
                onFiltersChange(newFilters);
                return newFilters;
            });
        } else if (!activeFilters.includes(filterId)) {
            const newFilters = [filterId];
            if (activeFilters.includes("private")) {
                newFilters.push("private");
            }
            setActiveFilters(newFilters);
            onFiltersChange(newFilters);
        }
    }

    const iconClasses = "transition-[transform,opacity, cubic-bezier(0.5, 0, 0.75, 0)] [animation-delay:600ms] duration-500 w-4 h-4 text-slate-600"
    const buttonClasses = "transition-all duration-300 bg-transparent hover:bg-slate-100 p-2 h-fit"

    return (
        <Card className="w-full flex items-center justify-between px-3 py-2 gap-2 overflow-hidden">
            <h1 className="font-semibold text-slate-600 w-full">Résultats de la recherche</h1>

            <section id="filter-buttons" className={`flex duration-300 items-center justify-start gap-2`} >
                <Button
                    variant="default"
                    className={`${buttonClasses} ${'overflow-hidden'} hover:bg-transparent cursor-default`}
                >
                    <Filter className={`${iconClasses}`} />
                </Button>

                <Separator orientation="vertical" className="h-6" />

                {filterOptions.slice(0, -1).map(option => (
                    <TooltipProvider key={option.id} delayDuration={200}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="default"
                                    className={`${buttonClasses} ${activeFilters.includes(option.id) ? 'bg-slate-200' : ''}`}
                                    onClick={() => handleFilterClick(option.id)}
                                >
                                    <option.icon className={iconClasses} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{option.label}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                ))}

                <Separator orientation="vertical" className="h-6" />

                <TooltipProvider delayDuration={200}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                key="private"
                                variant="default"
                                className={`${buttonClasses} ${activeFilters.includes("private") ? 'bg-slate-200' : ''}`}
                                onClick={() => handleFilterClick("private")}
                            >
                                {React.createElement(filterOptions[filterOptions.length - 1].icon, { className: iconClasses })}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{filterOptions[filterOptions.length - 1].label}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </section>
        </Card>
    )
}