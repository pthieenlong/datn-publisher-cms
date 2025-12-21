import { useCallback, useState } from "react";
import { deleteChapter } from "../services/books.service";

interface UseDeleteChapterReturn {
  isDeleting: boolean;
  errorMessage: string | null;
  successMessage: string | null;
  deleteExistingChapter: (bookSlug: string, chapterSlug: string) => Promise<boolean>;
  reset: () => void;
}

export function useDeleteChapter(): UseDeleteChapterReturn {
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const deleteExistingChapter = useCallback(
    async (bookSlug: string, chapterSlug: string): Promise<boolean> => {
      setIsDeleting(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      try {
        const response = await deleteChapter(bookSlug, chapterSlug);
        setSuccessMessage(response.message || "Xóa chương thành công");
        return true;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Không thể xóa chương";
        setErrorMessage(message);
        return false;
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
    deleteExistingChapter,
    reset,
  };
}
