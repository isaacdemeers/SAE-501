import EventPage from "@/components/events/eventPage";

interface EventPageProps {
  params: {
    id: string;
  };
}

export default function Page({ params }: EventPageProps) {
  return <EventPage params={params} />;
}
