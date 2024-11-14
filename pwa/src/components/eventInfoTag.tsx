import { MapPin } from "lucide-react";

interface EventInfoTagProps {
    type: string;
    title: string;
    icon: React.ReactNode;
    content: string;
}

export default function EventInfoTag({ type, title, icon, content }: EventInfoTagProps) {
    return (
        type === "full" ? (
            <div className="flex items-center justify-between flex-col bg-slate-50 p-4 gap-2 rounded-lg">
                <div className="flex items-center justify-start gap-2 w-full">
                    <div className="flex items-center justify-center w-4 h-4 text-slate-600">
                        {icon}
                    </div>
                    <p className="text-xs font-semibold text-slate-600">{title}</p>
                </div>
                <div className="flex items-center justify-start gap-2 w-full">
                    <p className="text-xs text-slate-600">{content}</p>
                </div>
            </div>
        ) : (
            <div className="flex items-center justify-between flex-col bg-slate-50 p-4 rounded-lg">
                <div className="flex items-center justify-start gap-2 w-full text-slate-600">
                    {icon}
                    <p className="text-xs text-slate-600">{content}</p>

                </div>
            </div>
        )

    )
}