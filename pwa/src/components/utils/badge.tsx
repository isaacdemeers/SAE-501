import { Badge } from "@/components/ui/badge"
import { Users } from "lucide-react"
import { cn } from "@/lib/utils"

interface CustomBadgeProps {
    icon: React.ReactNode;
    content: string | number;
    color: number;
}

export default function CustomBadge({ icon, content, color }: CustomBadgeProps) {
    let colorStyle = "bg-slate-700"
    if (color == 1) {
        colorStyle = "bg-blue-100 hover:bg-blue-100"
    } else if (color == 0) {
        colorStyle = "bg-red-100 hover:bg-red-100"
    }
    else if (color == 2) {
        colorStyle = "bg-green-100 hover:bg-green-100"
    }


    return (
        <Badge variant="default" className={cn(`flex items-center ${colorStyle} shadow-md justify-center gap-2 px-2 py-0.5 text-xs font-semibold text-slate-600 `)}>
            <div className="flex items-center justify-center h-4 w-4  ">
                {icon}
            </div>
            <div className="flex items-center justify-center text-slate-600 ">
                {content}
            </div>

        </Badge>

    )
}