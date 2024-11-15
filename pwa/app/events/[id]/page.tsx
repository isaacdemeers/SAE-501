import PageEvent from "@/components/PageEvent";

interface EventPageProps {
  params: {
    id: string;
  };
}

export default function Page({ params }: EventPageProps) {
  return <PageEvent params={params} />;
}
