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
import { useEffect, useState } from "react"

interface FilterBoxProps {
    onFiltersChange: (filters: string[]) => void;
}

interface AuthResponse {
    isValid: boolean;
    user: {
        email: string;
        id: number;
        username: string;
    };
}

export const filterOptions = [
    { id: "title", label: "Titre", icon: Heading1, color: "bg-indigo-100" },
    { id: "description", label: "Description", icon: Captions, color: "bg-emerald-100" },
    { id: "date", label: "Date", icon: Clock, color: "bg-orange-100" },
    { id: "private", label: "vos événements privés", icon: Lock, color: "bg-red-100", requireAuth: true },
]

export default function FilterBox({ onFiltersChange }: FilterBoxProps) {
    const [activeFilters, setActiveFilters] = React.useState<string[]>(["title"])
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const authenticateUser = async () => {
            try {
                const response = await fetch('/api/auth/validate-token', {
                    method: 'POST',
                    credentials: 'include',
                });

                const data: AuthResponse = await response.json();
                setIsAuthenticated(data.isValid);
            } catch (error) {
                console.error('Authentication error:', error);
                setIsAuthenticated(false);
            }
        };

        authenticateUser();
    }, []);

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

    // Filtrer les options en fonction de l'authentification
    const visibleFilterOptions = filterOptions.filter(option =>
        !option.requireAuth || (option.requireAuth && isAuthenticated)
    );

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

                {visibleFilterOptions.map((option, index) => (
                    <React.Fragment key={option.id}>
                        <TooltipProvider delayDuration={200}>
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
                        {index < visibleFilterOptions.length - 1 && option.id === "date" && (
                            <Separator orientation="vertical" className="h-6" />
                        )}
                    </React.Fragment>
                ))}
            </section>
        </Card>
    )
}