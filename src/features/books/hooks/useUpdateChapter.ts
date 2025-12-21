import { useCallback, useState } from "react";
import { message } from "antd";
import { updateChapter } from "../services/books.service";
import type { UpdateChapterPayload } from "../types";

interface UseUpdateChapterReturn {
  isUpdating: boolean;
  errorMessage: string | null;
  updateExistingChapter: (
    bookSlug: string,
    chapterSlug: string,
    payload: UpdateChapterPayload
  ) => Promise<boolean>;
  reset: () => void;
}

export function useUpdateChapter(): UseUpdateChapterReturn {
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const updateExistingChapter = useCallback(
    async (
      bookSlug: string,
      chapterSlug: string,
      payload: UpdateChapterPayload
    ): Promise<boolean> => {
      setIsUpdating(true);
      setErrorMessage(null);

      try {
        const response = await updateChapter(bookSlug, chapterSlug, payload);
        message.success(response.message || "Cập nhật chương thành công");
        return true;
      } catch (error) {
        const errorMsg =
          error instanceof Error
            ? error.message
            : "Không thể cập nhật chương";
        setErrorMessage(errorMsg);
        message.error(errorMsg);
        return false;
      } finally {
        setIsUpdating(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setErrorMessage(null);
  }, []);

  return {
    isUpdating,
    errorMessage,
    updateExistingChapter,
    reset,
  };
}
