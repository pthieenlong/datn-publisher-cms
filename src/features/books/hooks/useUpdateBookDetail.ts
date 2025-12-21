import { useCallback, useState } from "react";
import { updateBookDetail } from "../services/books.service";
import type { BookDetail, UpdateBookPayload } from "../types";

interface UseUpdateBookDetailReturn {
  isUpdating: boolean;
  errorMessage: string | null;
  successMessage: string | null;
  updateBook: (slug: string, payload: UpdateBookPayload) => Promise<BookDetail | null>;
  reset: () => void;
}

export function useUpdateBookDetail(): UseUpdateBookDetailReturn {
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const updateBook = useCallback(
    async (slug: string, payload: UpdateBookPayload): Promise<BookDetail | null> => {
      setIsUpdating(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      try {
        const response = await updateBookDetail(slug, payload);
        setSuccessMessage(response.message || "Cập nhật truyện thành công");
        return response.data;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Không thể cập nhật thông tin truyện";
        setErrorMessage(message);
        return null;
      } finally {
        setIsUpdating(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setErrorMessage(null);
    setSuccessMessage(null);
  }, []);

  return {
    isUpdating,
    errorMessage,
    successMessage,
    updateBook,
    reset,
  };
}
