import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchBooks } from "../services/books.service";
import type { Book, BookListFilters, PaginationMeta } from "../types";

interface UseBooksOptions {
  filters?: BookListFilters;
  enabled?: boolean;
}

interface UseBooksReturn {
  books: Book[];
  pagination: PaginationMeta | null;
  isLoading: boolean;
  errorMessage: string | null;
  message: string;
  refetch: () => Promise<void>;
}

export function useBooks(options: UseBooksOptions = {}): UseBooksReturn {
  const { filters, enabled = true } = options;
  const [books, setBooks] = useState<Book[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const normalizedFilters = useMemo(() => filters ?? {}, [filters]);

  const loadBooks = useCallback(
    async (signal?: AbortSignal) => {
      if (!enabled) {
        return;
      }
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const result = await fetchBooks({
          filters: normalizedFilters,
          signal,
        });
        setBooks(result.data);
        setPagination(result.pagination);
        setMessage(result.message);
      } catch (error) {
        if ((error as Error)?.name === "CanceledError") {
          return;
        }
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Không thể tải danh sách truyện"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [normalizedFilters, enabled]
  );

  useEffect(() => {
    const controller = new AbortController();
    loadBooks(controller.signal);

    return () => controller.abort();
  }, [loadBooks]);

  const refetch = useCallback(async () => {
    await loadBooks();
  }, [loadBooks]);

  return {
    books,
    pagination,
    isLoading,
    errorMessage,
    message,
    refetch,
  };
}
