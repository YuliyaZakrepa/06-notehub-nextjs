import NotesClient from "./Notes.client";
import { fetchNotes } from "@/lib/api";
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
interface NotesProps {
  params: Promise<{ search: string; page: number }>;
}

export default async function Notes({ params }: NotesProps) {
  const searchParams = await params;
  const search = searchParams.search || "";
  const page = Number(searchParams.page) || 1;
  const perPage = 12;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["notes", search, page, perPage],
    queryFn: () => fetchNotes(search, page, perPage),
    retry: false,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient />
    </HydrationBoundary>
  );
}
