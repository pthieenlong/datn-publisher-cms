import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchBookDetail } from "../services/books.service";
import type {
  BookChapter,
  BookDetail,
  BookReview,
} from "../types";

interface UseBookDetailOptions {
  slug?: string;
  enabled?: boolean;
  chapterPageSize?: number;
}

interface UseBookDetailReturn {
  book: BookDetail | null;
  message: string;
  reviews: BookReview[];
  isLoading: boolean;
  errorMessage: string | null;
  chapterPage: number;
  chapterPageSize: number;
  chapterTotalPages: number;
  currentChapters: BookChapter[];
  setChapterPage: (page: number) => void;
  nextChapterPage: () => void;
  prevChapterPage: () => void;
  refetch: () => Promise<void>;
}

const REVIEW_MOCKS: BookReview[] = [
  {
    id: "mock-1",
    reviewer: "Nguyễn Văn A",
    content:
      "Cốt truyện chắc tay, nhịp nhanh và không bị lan man. Đọc rất cuốn.",
    createdAt: "2025-11-26T08:30:00.000Z",
  },
  {
    id: "mock-2",
    reviewer: "Trần Thị B",
    content:
      "Art đẹp, các đoạn cao trào được xử lý tốt. Mong sớm có chương mới.",
    createdAt: "2025-11-26T14:10:00.000Z",
  },
  {
    id: "mock-3",
    reviewer: "Lê Minh C",
    content: "Nhân vật chính có chiều sâu, tương tác phụ cũng thú vị.",
    createdAt: "2025-11-27T02:45:00.000Z",
  },
];

export function useBookDetail(
  options: UseBookDetailOptions = {}
): UseBookDetailReturn {
  const {
    slug,
    enabled = true,
    chapterPageSize = 10,
  } = options;
  const normalizedSlug = slug?.trim() ?? "";
  const normalizedPageSize = Math.max(1, chapterPageSize);

  const [book, setBook] = useState<BookDetail | null>(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [chapterPage, setChapterPage] = useState(1);
  const [reviews, setReviews] = useState<BookReview[]>(REVIEW_MOCKS);

  const loadBookDetail = useCallback(
    async (signal?: AbortSignal) => {
      if (!enabled || !normalizedSlug) {
        return;
      }
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const response = await fetchBookDetail(normalizedSlug, signal);
        setBook(response.data);
        setMessage(response.message);
        setReviews(REVIEW_MOCKS);
      } catch (error) {
        if ((error as Error)?.name === "CanceledError") {
          return;
        }
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Không thể tải chi tiết truyện"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [enabled, normalizedSlug]
  );

  useEffect(() => {
    const controller = new AbortController();
    loadBookDetail(controller.signal);

    return () => controller.abort();
  }, [loadBookDetail]);

  useEffect(() => {
    setChapterPage(1);
  }, [normalizedSlug, normalizedPageSize]);

  const chapterTotalPages = useMemo(() => {
    if (!book) {
      return 0;
    }
    const total = Math.ceil(book.chapters.length / normalizedPageSize);
    return total;
  }, [book, normalizedPageSize]);

  useEffect(() => {
    if (chapterTotalPages === 0) {
      if (chapterPage !== 1) {
        setChapterPage(1);
      }
      return;
    }
    if (chapterPage > chapterTotalPages) {
      setChapterPage(chapterTotalPages);
    }
  }, [chapterPage, chapterTotalPages]);

  const currentChapters = useMemo(() => {
    if (!book) {
      return [];
    }
    const startIndex = (chapterPage - 1) * normalizedPageSize;
    return book.chapters.slice(
      startIndex,
      startIndex + normalizedPageSize
    );
  }, [book, chapterPage, normalizedPageSize]);

  const handleSetChapterPage = useCallback(
    (page: number) => {
      if (chapterTotalPages === 0) {
        setChapterPage(1);
        return;
      }
      const nextPage = Math.min(
        Math.max(page, 1),
        chapterTotalPages
      );
      setChapterPage(nextPage);
    },
    [chapterTotalPages]
  );

  const nextChapterPage = useCallback(() => {
    if (chapterTotalPages === 0) {
      return;
    }
    setChapterPage((prev) =>
      Math.min(prev + 1, chapterTotalPages)
    );
  }, [chapterTotalPages]);

  const prevChapterPage = useCallback(() => {
    if (chapterTotalPages === 0) {
      return;
    }
    setChapterPage((prev) => Math.max(prev - 1, 1));
  }, [chapterTotalPages]);

  const refetch = useCallback(async () => {
    await loadBookDetail();
  }, [loadBookDetail]);

  return {
    book,
    message,
    reviews,
    isLoading,
    errorMessage,
    chapterPage,
    chapterPageSize: normalizedPageSize,
    chapterTotalPages,
    currentChapters,
    setChapterPage: handleSetChapterPage,
    nextChapterPage,
    prevChapterPage,
    refetch,
  };
}

