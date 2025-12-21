import { useState, useCallback } from "react";
import { message } from "antd";
import axiosInstance from "@/lib/axios";

interface UseChapterGalleriesOptions {
  bookSlug: string;
  chapterSlug: string;
  onSuccess?: () => void;
}

interface UseChapterGalleriesReturn {
  isUpdating: boolean;
  removeImages: (imageUrls: string[]) => Promise<boolean>;
  reorderImages: (orderedUrls: string[]) => Promise<boolean>;
  addImages: (files: File[], position?: number) => Promise<boolean>;
}

export function useChapterGalleries({
  bookSlug,
  chapterSlug,
  onSuccess,
}: UseChapterGalleriesOptions): UseChapterGalleriesReturn {
  const [isUpdating, setIsUpdating] = useState(false);

  const removeImages = useCallback(
    async (imageUrls: string[]): Promise<boolean> => {
      if (imageUrls.length === 0) {
        message.warning("Không có ảnh nào được chọn để xóa");
        return false;
      }

      setIsUpdating(true);
      try {
        const response = await axiosInstance.patch(
          `/cms/publisher/books/${encodeURIComponent(
            bookSlug
          )}/chapters/${encodeURIComponent(chapterSlug)}/galleries/remove`,
          { imageUrls }
        );
        console.log(response);
        message.success(response.data.message || "Xóa ảnh thành công");
        onSuccess?.();
        return true;
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "Không thể xóa ảnh";
        message.error(errorMsg);
        return false;
      } finally {
        setIsUpdating(false);
      }
    },
    [bookSlug, chapterSlug, onSuccess]
  );

  const reorderImages = useCallback(
    async (orderedUrls: string[]): Promise<boolean> => {
      if (orderedUrls.length === 0) {
        message.warning("Danh sách ảnh trống");
        return false;
      }

      setIsUpdating(true);
      try {
        const response = await axiosInstance.patch(
          `/cms/publisher/books/${encodeURIComponent(
            bookSlug
          )}/chapters/${encodeURIComponent(chapterSlug)}/galleries/reorder`,
          { imageUrls: orderedUrls }
        );

        message.success(response.data.message || "Sắp xếp ảnh thành công");
        onSuccess?.();
        return true;
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "Không thể sắp xếp ảnh";
        message.error(errorMsg);
        return false;
      } finally {
        setIsUpdating(false);
      }
    },
    [bookSlug, chapterSlug, onSuccess]
  );

  const addImages = useCallback(
    async (files: File[], position?: number): Promise<boolean> => {
      if (files.length === 0) {
        message.warning("Không có ảnh nào để thêm");
        return false;
      }

      setIsUpdating(true);
      try {
        const formData = new FormData();
        files.forEach((file) => {
          formData.append("galleries", file);
        });
        if (position !== undefined) {
          formData.append("position", position.toString());
        }

        const response = await axiosInstance.post(
          `/cms/publisher/books/${encodeURIComponent(
            bookSlug
          )}/chapters/${encodeURIComponent(chapterSlug)}/galleries`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        message.success(response.data.message || "Thêm ảnh thành công");
        onSuccess?.();
        return true;
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "Không thể thêm ảnh";
        message.error(errorMsg);
        return false;
      } finally {
        setIsUpdating(false);
      }
    },
    [bookSlug, chapterSlug, onSuccess]
  );

  return {
    isUpdating,
    removeImages,
    reorderImages,
    addImages,
  };
}
