import { useCallback, useState } from "react";
import { unarchiveChapter } from "../services/books.service";

interface UseUnarchiveChapterReturn {
  isUnarchiving: boolean;
  errorMessage: string | null;
  successMessage: string | null;
  unarchiveExistingChapter: (bookSlug: string, chapterSlug: string) => Promise<boolean>;
  reset: () => void;
}

export function useUnarchiveChapter(): UseUnarchiveChapterReturn {
  const [isUnarchiving, setIsUnarchiving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const unarchiveExistingChapter = useCallback(
    async (bookSlug: string, chapterSlug: string): Promise<boolean> => {
      setIsUnarchiving(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      try {
        const response = await unarchiveChapter(bookSlug, chapterSlug);
        setSuccessMessage(response.message || "Khôi phục chương thành công");
        return true;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Không thể khôi phục chương";
        setErrorMessage(message);
        return false;
      } finally {
        setIsUnarchiving(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setErrorMessage(null);
    setSuccessMessage(null);
  }, []);

  return {
    isUnarchiving,
    errorMessage,
    successMessage,
    unarchiveExistingChapter,
    reset,
  };
}
