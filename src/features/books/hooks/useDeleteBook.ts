import { useCallback, useState } from "react";
import { deleteBook } from "../services/books.service";
import type { DeleteBookResponse } from "../types";

interface UseDeleteBookReturn {
  isDeleting: boolean;
  errorMessage: string | null;
  successMessage: string | null;
  deleteExistingBook: (
    slug: string
  ) => Promise<DeleteBookResponse["data"] | null>;
  reset: () => void;
}

export function useDeleteBook(): UseDeleteBookReturn {
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const deleteExistingBook = useCallback(
    async (slug: string): Promise<DeleteBookResponse["data"] | null> => {
      setIsDeleting(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      try {
        const response = await deleteBook(slug);
        console.log(response);
        setSuccessMessage(response.message || "Xóa truyện thành công");
        return response.data;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Không thể xóa truyện";
        setErrorMessage(message);
        return null;
      } finally {
        setIsDeleting(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setErrorMessage(null);
    setSuccessMessage(null);
  }, []);

  return {
    isDeleting,
    errorMessage,
    successMessage,
    deleteExistingBook,
    reset,
  };
}
