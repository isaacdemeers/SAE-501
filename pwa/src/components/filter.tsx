'use client'

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

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

    const handleFilterChange = (filterId: string) => {
        setSelectedFilters((prev) =>
            prev.includes(filterId)
                ? prev.filter((id) => id !== filterId)
                : [...prev, filterId]
        )
    }

    return (
        <Card className="w-40">
            <CardHeader>
                <CardTitle>Filter by</CardTitle>
            </CardHeader>
            <div className="w-full h-px bg-slate-100 mb-4"></div>
            <CardContent>
                <div className="space-y-2">
                    {filterOptions.map((option) => (
                        <div key={option.id} className="flex items-center space-x-2">
                            <Checkbox
                                id={option.id}
                                checked={selectedFilters.includes(option.id)}
                                onCheckedChange={() => handleFilterChange(option.id)}
                            />
                            <Label
                                htmlFor={option.id}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                {option.label}
                            </Label>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}