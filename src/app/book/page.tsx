import { Suspense } from "react";
import Book from "@/views/book/ui/book";
import { PageLoading } from "@/shared/ui/page-loading";

export default function BookPage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <Book />
    </Suspense>
  );
}
