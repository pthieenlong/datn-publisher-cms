import { useCallback, useState } from "react";
import { message } from "antd";
import { createChapter } from "../services/books.service";
import type { CreateChapterPayload } from "../types";

interface UseCreateChapterReturn {
  isCreating: boolean;
  errorMessage: string | null;
  createNewChapter: (
    bookSlug: string,
    payload: CreateChapterPayload
  ) => Promise<boolean>;
  reset: () => void;
}

export function useCreateChapter(): UseCreateChapterReturn {
  const [isCreating, setIsCreating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const createNewChapter = useCallback(
    async (bookSlug: string, payload: CreateChapterPayload): Promise<boolean> => {
      setIsCreating(true);
      setErrorMessage(null);

      try {
        const response = await createChapter(bookSlug, payload);
        message.success(response.message || "Thêm chương mới thành công");
        return true;
      } catch (error) {
        const errorMsg =
          error instanceof Error
            ? error.message
            : "Không thể tạo chương mới";
        setErrorMessage(errorMsg);
        message.error(errorMsg);
        return false;
      } finally {
        setIsCreating(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setErrorMessage(null);
  }, []);

  return {
    isCreating,
    errorMessage,
    createNewChapter,
    reset,
  };
}
