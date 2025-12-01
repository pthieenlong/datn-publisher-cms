import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchChapterDetail } from "../services/books.service";
import type { ChapterDetail } from "../types";

interface UseChapterDetailOptions {
  bookSlug?: string;
  chapterSlug?: string;
  enabled?: boolean;
}

interface UseChapterDetailReturn {
  chapter: ChapterDetail | null;
  message: string;
  isLoading: boolean;
  errorMessage: string | null;
  contentCount: number;
  refetch: () => Promise<void>;
}

export function useChapterDetail(
  options: UseChapterDetailOptions = {}
): UseChapterDetailReturn {
  const {
    bookSlug,
    chapterSlug,
    enabled = true,
  } = options;
  const normalizedBookSlug = bookSlug?.trim() ?? "";
  const normalizedChapterSlug = chapterSlug?.trim() ?? "";

  const [chapter, setChapter] = useState<ChapterDetail | null>(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadChapter = useCallback(
    async (signal?: AbortSignal) => {
      if (!enabled || !normalizedBookSlug || !normalizedChapterSlug) {
        return;
      }
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const response = await fetchChapterDetail(
          normalizedBookSlug,
          normalizedChapterSlug,
          signal
        );
        setChapter(response.data);
        setMessage(response.message);
      } catch (error) {
        if ((error as Error)?.name === "CanceledError") {
          return;
        }
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Không thể tải chi tiết chương"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [enabled, normalizedBookSlug, normalizedChapterSlug]
  );

  useEffect(() => {
    const controller = new AbortController();
    loadChapter(controller.signal);

    return () => controller.abort();
  }, [loadChapter]);

  const refetch = useCallback(async () => {
    await loadChapter();
  }, [loadChapter]);

  const contentCount = useMemo(() => {
    return chapter?.content.length ?? 0;
  }, [chapter]);

  return {
    chapter,
    message,
    isLoading,
    errorMessage,
    contentCount,
    refetch,
  };
}

