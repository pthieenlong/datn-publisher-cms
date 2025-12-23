import { useState } from "react";
import { message } from "antd";
import { deleteComment } from "../services/books.service";

interface UseDeleteCommentOptions {
  bookSlug: string;
  onSuccess?: () => void;
}

interface UseDeleteCommentReturn {
  isDeleting: boolean;
  deleteComment: (commentId: string, userId: string) => Promise<void>;
}

export function useDeleteComment({
  bookSlug,
  onSuccess,
}: UseDeleteCommentOptions): UseDeleteCommentReturn {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (commentId: string, userId: string) => {
    setIsDeleting(true);
    try {
      const response = await deleteComment(bookSlug, commentId, userId);
      if (response.success) {
        message.success(response.message || "Xóa bình luận thành công");
        onSuccess?.();
      } else {
        message.error(response.message || "Xóa bình luận thất bại");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi xóa bình luận");
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    isDeleting,
    deleteComment: handleDelete,
  };
}
