import { Alert, Spin, Button, Space } from "antd";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useMemo } from "react";
import { useDocumentTitle } from "@/hooks";
import { useChapterDetail } from "../../hooks/useChapterDetail";
import { useUpdateChapter } from "../../hooks/useUpdateChapter";
import { ChapterGalleriesEditor } from "../../components/ChapterGalleriesEditor";
import { ChapterEditForm } from "./components";
import type { ChapterEditFormValues } from "./components";
import "./ChapterEditPage.scss";

export default function ChapterEditPage() {
  const { bookSlug, chapterSlug } = useParams({
    from: "/books/$bookSlug/chapters/$chapterSlug/edit",
  });
  const navigate = useNavigate();

  const { chapter, isLoading, errorMessage, refetch } = useChapterDetail({
    bookSlug,
    chapterSlug,
  });

  const { updateExistingChapter, isUpdating: isUpdatingMetadata } = useUpdateChapter();

  useDocumentTitle(`Chỉnh sửa Chương - CMS`);

  // Derive original image URLs from chapter
  const originalImageUrls = useMemo(() => {
    return chapter?.content ?? [];
  }, [chapter]);

  const handleBack = () => {
    navigate({
      to: "/books/$bookSlug/chapters/$chapterSlug",
      params: { bookSlug, chapterSlug },
    });
  };

  const handleSubmit = async (values: ChapterEditFormValues) => {
    if (!chapter) return;

    // Update metadata (price, isFree, etc.)
    // Note: title không thể cập nhật qua API này theo API docs
    const payload = {
      isFree: values.isFree,
      price: values.isFree ? 0 : values.price,
      isOnSale: values.isFree ? false : values.isOnSale,
      salePercent: values.isFree || !values.isOnSale ? 0 : values.salePercent,
    };

    const metadataSuccess = await updateExistingChapter(
      bookSlug,
      chapterSlug,
      payload
    );

    if (metadataSuccess) {
      handleBack();
    }
  };

  const isUpdating = isUpdatingMetadata;

  if (isLoading && !chapter) {
    return (
      <div className="chapter-edit-page">
        <div className="chapter-edit-page__loading">
          <Spin size="large" tip="Đang tải dữ liệu chương..." />
        </div>
      </div>
    );
  }

  if (errorMessage || !chapter) {
    return (
      <div className="chapter-edit-page">
        <Alert
          type="error"
          message="Không thể tải chi tiết chương"
          description={errorMessage || "Chương không tồn tại"}
          showIcon
          closable
        />
      </div>
    );
  }

  const initialValues: ChapterEditFormValues = {
    title: chapter.title,
    isFree: chapter.isFree ?? true,
    price: chapter.price ?? 0,
    isOnSale: chapter.isOnSale ?? false,
    salePercent: chapter.salePercent ?? 0,
  };

  return (
    <div className="chapter-edit-page">
      {/* Header */}
      <div className="chapter-edit-page__header">
        <Space>
          <Button
            icon={<ArrowLeft size={20} />}
            onClick={handleBack}
            disabled={isUpdating}
            className="chapter-edit-page__back-button"
          >
            Quay lại
          </Button>
          <div className="chapter-edit-page__title-section">
            <h2 className="chapter-edit-page__title">Chỉnh sửa Chương</h2>
            <p className="chapter-edit-page__subtitle">
              {chapter.title} • {chapter.book.title}
            </p>
          </div>
        </Space>
      </div>

      {/* Galleries Editor - Standalone với auto-save */}
      <div className="chapter-edit-page__section">
        <ChapterGalleriesEditor
          bookSlug={bookSlug}
          chapterSlug={chapterSlug}
          initialGalleries={originalImageUrls}
          mode="standalone"
          showSaveButton={true}
          onSuccess={refetch}
        />
      </div>

      {/* Metadata Form */}
      <div className="chapter-edit-page__section">
        <ChapterEditForm
          initialValues={initialValues}
          isLoading={isUpdatingMetadata}
          onSubmit={handleSubmit}
          onCancel={handleBack}
        />
      </div>
    </div>
  );
}
