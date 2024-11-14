
import { Badge } from "@/components/ui/badge"
import { Users } from "lucide-react"

export default function CustomBadge({ icon, content, color }: { icon: React.ReactNode, content: string, color: string }) {


    return (
        <Badge variant="default" className={` flex items-center justify-center gap-2 px-2 py-0.5 text-xs font-semibold`}>
            <div className="flex items-center justify-center h-4 w-4  ">
                {icon}
            </div>
            <div className="flex items-center justify-center ">
                {content}
            </div>

        </Badge>

    )
}