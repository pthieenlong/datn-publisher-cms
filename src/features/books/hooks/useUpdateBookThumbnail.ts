import { useState } from "react";
import { message } from "antd";
import { updateBookThumbnail } from "../services/books.service";

interface UseUpdateBookThumbnailReturn {
  updateThumbnail: (slug: string, thumbnail: File) => Promise<boolean>;
  isUpdating: boolean;
  errorMessage: string | null;
}

export function useUpdateBookThumbnail(): UseUpdateBookThumbnailReturn {
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const updateThumbnail = async (
    slug: string,
    thumbnail: File
  ): Promise<boolean> => {
    setIsUpdating(true);
    setErrorMessage(null);

    try {
      const response = await updateBookThumbnail(slug, thumbnail);
      message.success(response.message || "Cập nhật thumbnail thành công");
      return true;
    } catch (error) {
      const errorMsg =
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi cập nhật thumbnail";
      setErrorMessage(errorMsg);
      message.error(errorMsg);
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    updateThumbnail,
    isUpdating,
    errorMessage,
  };
}
