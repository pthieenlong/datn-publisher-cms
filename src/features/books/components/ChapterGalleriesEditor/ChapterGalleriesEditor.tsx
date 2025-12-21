import { useState, useEffect, useMemo, useCallback } from "react";
import { Alert, Card, Button } from "antd";
import { Save } from "lucide-react";
import type { UploadFile } from "antd/es/upload/interface";
import { useChapterGalleries } from "../../hooks/useChapterGalleries";
import GalleriesUploader from "./GalleriesUploader";
import "./ChapterGalleriesEditor.scss";

interface ImageItem extends UploadFile {
  isExisting?: boolean;
}

export interface ChapterGalleriesEditorProps {
  bookSlug: string;
  chapterSlug: string;
  initialGalleries: string[];
  mode?: "standalone" | "embedded";
  showSaveButton?: boolean;
  onSuccess?: () => void;
  onChange?: (hasChanges: boolean) => void;
  onSaveRequest?: (fileList: ImageItem[]) => Promise<void>;
}

export default function ChapterGalleriesEditor({
  bookSlug,
  chapterSlug,
  initialGalleries,
  mode = "embedded",
  showSaveButton = mode === "standalone",
  onSuccess,
  onChange,
  onSaveRequest,
}: ChapterGalleriesEditorProps) {
  const [fileList, setFileList] = useState<ImageItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const { isUpdating, removeImages, reorderImages, addImages } =
    useChapterGalleries({
      bookSlug,
      chapterSlug,
      onSuccess,
    });

  // Initialize file list from initial galleries
  useEffect(() => {
    const existingFiles: ImageItem[] = initialGalleries.map((url, index) => ({
      uid: `existing-${index}`,
      name: `Trang ${index + 1}.jpg`,
      url,
      status: "done" as const,
      isExisting: true,
    }));
    setFileList(existingFiles);
  }, [initialGalleries]);

  // Compute if there are changes
  const hasChanges = useMemo(() => {
    if (initialGalleries.length === 0) return fileList.length > 0;

    const currentUrls = fileList.map((item) => item.url || "");
    return (
      fileList.length !== initialGalleries.length ||
      fileList.some((item) => !item.isExisting) ||
      currentUrls.some((url, index) => url !== initialGalleries[index])
    );
  }, [fileList, initialGalleries]);

  // Notify parent of changes
  useEffect(() => {
    onChange?.(hasChanges);
  }, [hasChanges, onChange]);

  const handleFileListChange = useCallback((newFileList: ImageItem[]) => {
    setFileList(newFileList);
  }, []);

  const handleMoveUp = useCallback((index: number) => {
    setFileList((prev) => {
      if (index === 0) return prev;
      const newList = [...prev];
      [newList[index - 1], newList[index]] = [
        newList[index],
        newList[index - 1],
      ];
      return newList;
    });
  }, []);

  const handleMoveDown = useCallback((index: number) => {
    setFileList((prev) => {
      if (index === prev.length - 1) return prev;
      const newList = [...prev];
      [newList[index], newList[index + 1]] = [
        newList[index + 1],
        newList[index],
      ];
      return newList;
    });
  }, []);

  const handleRemove = useCallback((file: UploadFile) => {
    setFileList((prev) => prev.filter((item) => item.uid !== file.uid));
  }, []);

  const handleSave = async () => {
    if (!hasChanges) return;

    // If parent provides custom save handler (embedded mode)
    if (onSaveRequest) {
      await onSaveRequest(fileList);
      return;
    }

    // Standalone mode - handle save internally
    setIsSaving(true);
    try {
      const currentUrls = fileList
        .map((item) => item.url)
        .filter(Boolean) as string[];
      const newFiles = fileList
        .filter((item) => !item.isExisting && item.originFileObj)
        .map((item) => item.originFileObj as File);

      // 1. Remove deleted images
      const removedUrls = initialGalleries.filter(
        (url) => !currentUrls.includes(url)
      );
      if (removedUrls.length > 0) {
        const success = await removeImages(removedUrls);
        if (!success) return;
      }

      // 2. Add new images
      if (newFiles.length > 0) {
        const firstNewIndex = fileList.findIndex((item) => !item.isExisting);
        const success = await addImages(newFiles, firstNewIndex);
        if (!success) return;
      }

      // 3. Reorder (if order changed and no new files)
      if (newFiles.length === 0 && removedUrls.length === 0) {
        const orderedUrls = fileList
          .filter((item) => item.isExisting)
          .map((item) => item.url)
          .filter(Boolean) as string[];

        const orderChanged = orderedUrls.some(
          (url, index) => url !== initialGalleries[index]
        );

        if (orderChanged) {
          await reorderImages(orderedUrls);
        }
      }
    } finally {
      setIsSaving(false);
    }
  };

  const loading = isUpdating || isSaving;

  if (!bookSlug || !chapterSlug) {
    return (
      <Alert
        type="error"
        message="Thiếu thông tin"
        description="Vui lòng cung cấp bookSlug và chapterSlug"
        showIcon
      />
    );
  }

  return (
    <div className="chapter-galleries-editor">
      {hasChanges && mode === "standalone" && (
        <Alert
          type="info"
          message="Có thay đổi về ảnh"
          description="Bạn đã thêm, xóa hoặc sắp xếp lại ảnh. Nhấn 'Lưu thay đổi' để áp dụng."
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      <Card className="chapter-galleries-editor__card">
        <GalleriesUploader
          fileList={fileList}
          onFileListChange={handleFileListChange}
          onMoveUp={handleMoveUp}
          onMoveDown={handleMoveDown}
          onRemove={handleRemove}
          disabled={loading}
        />

        {fileList.length > 0 && (
          <Card
            type="inner"
            className="chapter-galleries-editor__summary"
            size="small"
          >
            <div className="chapter-galleries-editor__summary-text">
              <strong>Tổng số trang:</strong> {fileList.length} trang
            </div>
          </Card>
        )}

        {showSaveButton && mode === "standalone" && (
          <div className="chapter-galleries-editor__actions">
            <Button
              type="primary"
              icon={<Save size={20} />}
              onClick={handleSave}
              loading={loading}
              disabled={!hasChanges}
              size="large"
            >
              Lưu thay đổi
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
