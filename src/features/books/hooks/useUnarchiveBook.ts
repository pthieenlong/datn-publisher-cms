import { useCallback, useState } from "react";
import { unarchiveBook } from "../services/books.service";

interface UseUnarchiveBookReturn {
  isUnarchiving: boolean;
  errorMessage: string | null;
  successMessage: string | null;
  unarchiveExistingBook: (slug: string) => Promise<boolean>;
  reset: () => void;
}

export function useUnarchiveBook(): UseUnarchiveBookReturn {
  const [isUnarchiving, setIsUnarchiving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const unarchiveExistingBook = useCallback(
    async (slug: string): Promise<boolean> => {
      setIsUnarchiving(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      try {
        const response = await unarchiveBook(slug);
        setSuccessMessage(response.message || "Khôi phục truyện thành công");
        return true;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Không thể khôi phục truyện";
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
    unarchiveExistingBook,
    reset,
  };
}
