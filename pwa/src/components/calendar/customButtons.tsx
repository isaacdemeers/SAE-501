import FullCalendar from '@fullcalendar/react'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

export default function CalendarCustomBtn({ icon, action, calendarRef }: { icon: any, action: String, calendarRef: React.RefObject<FullCalendar> }) {
    let handleAction;

    if (action == 'next') {
        handleAction = () => {
            calendarRef.current?.getApi().next();
        }
    } else if (action == 'prev') {
        handleAction = () => {
            calendarRef.current?.getApi().prev();
        }
    } else if (action == 'today') {
        handleAction = () => {
            calendarRef.current?.getApi().today();
        }
    } else if (action == 'day') {
        handleAction = () => {
            calendarRef.current?.getApi().changeView('timeGridDay');
        }
    }
    else if (action == 'week') {
        handleAction = () => {
            calendarRef.current?.getApi().changeView('timeGridWeek');
        }
    }
    else if (action == 'month') {
        handleAction = () => {
            calendarRef.current?.getApi().changeView('dayGridMonth');
        }
    }

    return (
        <TooltipProvider>
            <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                    <button
                        onClick={handleAction}
                        className='text-slate-600 p-2 rounded-md hover:bg-slate-100 transition-all'>
                        {icon}
                    </button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{action.charAt(0).toUpperCase() + action.slice(1)}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}