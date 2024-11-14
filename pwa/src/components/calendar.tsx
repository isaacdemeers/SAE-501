import FullCalendar from '@fullcalendar/react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid'
import React from 'react';
import EventCard from './eventCard';
import HoverEventCard from './hover-event-card';





export function Calendar() {
    // fonction random HEX
    function randomColor() {
        let letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    return (
        <Card className='p-4  h-full w-full transition-all'>
            <FullCalendar
                plugins={[dayGridPlugin, listPlugin, dayGridPlugin, interactionPlugin, timeGridPlugin]}
                initialView="timeGridWeek"
                eventContent={renderEventContent}
                themeSystem='bootstrap5'
                height={'100%'}
                headerToolbar={{
                    start: 'title', // will normally be on the left. if RTL, will be on the right
                    center: '',
                    end: 'dayGridMonth,timeGridWeek,dayGridDay,listWeek prev,today,next' // will normally be on the right. if RTL, will be on the left
                }}
                events={[
                    { title: 'event 1', start: '2024-10-31', end: '2024-11-30', color: randomColor() },
                    { title: 'event 2', start: '2024-10-31', end: '2024-11-10', color: randomColor() },
                    { title: 'event 2', start: '2024-09-31', end: '2024-10-13', color: randomColor() },
                    { title: 'event 2', start: '2024-10-20', end: '2024-10-25', color: randomColor() },
                    { title: 'event 2', date: '2024-10-31 ', color: randomColor() },
                    { title: 'event 2', date: '2024-10-31', color: randomColor() },
                    { title: 'event 2', date: '2024-10-31', color: randomColor() },
                    { title: 'event 2', date: '2024-10-31', color: randomColor() },
                    //event avec heure format UTC
                    { title: 'event 3', start: '2024-10-31T10:00:00', end: '2024-10-31T12:00:00', color: randomColor() },
                    { title: 'event 4', start: '2024-10-30T14:00:00', end: '2024-10-30T16:00:00', color: randomColor() },
                    { title: 'event 5', start: '2024-10-29T18:00:00', end: '2024-10-31T20:00:00', color: randomColor() },



                ]}

                eventTimeFormat={{
                    hour: 'numeric',
                    minute: '2-digit',
                    meridiem: false
                }}

                slotLabelFormat={{
                    hour: 'numeric',
                    minute: '2-digit',
                    omitZeroMinute: true,
                    meridiem: 'short',
                    hour12: false

                }}


                eventMaxStack={3}
                dayMaxEventRows={true}
                dayPopoverFormat={{ month: 'long', day: 'numeric', year: 'numeric' }}



                // HEADERS
                dayHeaderFormat={{ weekday: 'short', omitCommas: true }}


                navLinks={true}
                weekNumbers={true}
                weekText="s"
                selectable={true}


                dateClick={function (info) {
                    // alert('Clicked on: ' + info.dateStr);
                    // alert('Coordinates: ' + info.jsEvent.pageX + ',' + info.jsEvent.pageY);
                    // alert('Current view: ' + info.view.type);
                    info.dayEl.style.backgroundColor = 'red';
                }}

                eventMouseEnter={renderEventContent}
                selectMinDistance={40}
                select={
                    function (info) {
                        let start = info.startStr;
                        let end = info.endStr;
                        let date = new Date(start);
                        let dateEnd = new Date(end);
                        dateEnd.setDate(dateEnd.getDate() - 1);

                        // TEMPORARY
                        // while (date <= dateEnd) {
                        //     let dateStr = date.toISOString().split('T')[0];
                        //     let day = document.querySelector(`[data-date="${dateStr}"]`);
                        //     day.style.backgroundColor = 'red';
                        //     date.setDate(date.getDate() + 1);
                        // }
                    }}
                eventClick={function (info) {
                    info.el.style.borderColor = 'red';
                    let sideShow = document.querySelector<HTMLDivElement>("#sideShow");
                    sideShow?.classList.toggle("active");
                }}
                eventMouseLeave={function (info) {
                    // reset the border
                    info.el.style.borderColor = 'transparent';
                }}
            />
        </Card>

    )
}

function renderEventContent(eventInfo: any) {
    return (
        <>
            <b>{eventInfo.timeText}</b>
            <i>{eventInfo.event.title}</i>
        </>
    )
}







export function EventSideShow() {
    React.useEffect(() => {
        const input = document.querySelector<HTMLInputElement>("#search");
        const bar = document.querySelector<HTMLDivElement>("#sideShow");



        const showEvent = (e: any) => {

        };

        const handleBlur = () => {
            bar?.classList.remove("active");
        };

        // Ajouter les gestionnaires d'événements
        document.body.addEventListener("click", showEvent);

        // Nettoyer les événements lors du démontage
        return () => {
            document.body.removeEventListener("click", handleBlur);
        };
    }, []);

    return (
        <Card className=" relative w-full md:w-96 h-full p-4 overflow-x-hidden max-h-full">
            <p className="absolute top-1/2 text-center left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-400 font-medium">Rien à afficher</p>
            <section id="sideShow" className="w-full h-full opacity-100 overflow-y-scroll bg-white rounded-sm overflow-hidden">
                <HoverEventCard />
            </section>
        </Card>
    )
}
