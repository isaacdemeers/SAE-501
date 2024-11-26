import EventPage from "@/components/events/eventPage";

interface EventPageProps {
  params: {
    id: number;
  };
}

export default function Page({ params }: EventPageProps) {
  return <EventPage params={params} />;
}
