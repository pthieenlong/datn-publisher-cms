import { Alert, Spin, Card, Typography, message } from "antd";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useMemo } from "react";
import { useDocumentTitle } from "@/hooks";
import { useBookDetail } from "../../hooks/useBookDetail";
import { useCategories } from "@/features/categories";
import { updateBookDetail } from "../../services/books.service";
import {
  BookDetailHeader,
  BookDetailStats,
  BookDetailInfo,
  BookDetailChapters,
  BookDetailReviewsComments,
} from "./components";
import type { BookUpdateFormValues, PricingInfo } from "./components";
import "./BookDetailPage.scss";
import { useDeleteBook } from "../../hooks/useDeleteBook";
import { useUnarchiveBook } from "../../hooks/useUnarchiveBook";
import { useUpdateBookThumbnail } from "../../hooks/useUpdateBookThumbnail";

const { Title, Text } = Typography;

export default function BookDetailPage() {
  const { slug } = useParams({ from: "/books/$slug" });
  const navigate = useNavigate();
  const {
    book,
    isLoading,
    errorMessage,
    currentChapters,
    chapterPage,
    chapterPageSize,
    chapterTotalPages,
    setChapterPage,
    refetch,
  } = useBookDetail({ slug });
  const {
    categories,
    isLoading: loadingCategories,
    errorMessage: categoriesError,
  } = useCategories();
  const { deleteExistingBook } = useDeleteBook();
  const { unarchiveExistingBook } = useUnarchiveBook();
  const { updateThumbnail, isUpdating: isUpdatingThumbnail } =
    useUpdateBookThumbnail();
  useDocumentTitle(
    book
      ? `${book.title} - Chi tiết Truyện tranh - CMS`
      : "Chi tiết Truyện tranh - CMS"
  );

  const getStatusTag = (status?: string) => {
    const statusMap: Record<string, { color: string; text: string }> = {
      PUBLISHED: { color: "success", text: "Đã xuất bản" },
      DRAFT: { color: "default", text: "Nháp" },
      ARCHIVED: { color: "warning", text: "Đã lưu trữ" },
      PENDING: { color: "processing", text: "Đang chờ duyệt" },
      REJECTED: { color: "error", text: "Đã từ chối" },
    };
    if (!status) {
      return statusMap.DRAFT;
    }
    return statusMap[status] ?? statusMap.DRAFT;
  };

  const handleBack = () => {
    navigate({ to: "/books" });
  };

  const handleDelete = async () => {
    if (!slug) {
      return;
    }
    const success = await deleteExistingBook(slug);
    console.log(success);
    if (success) {
      refetch();
    }
  };

  const handleUnarchived = async () => {
    if (!slug) {
      return;
    }
    const success = await unarchiveExistingBook(slug);
    if (success) {
      refetch();
    }
  };

  const handleUpdateSubmit = async (values: BookUpdateFormValues) => {
    const payload = {
      title: values.title,
      author: values.author,
      description: values.description,
      isFree: values.isFree,
      isOnSale: values.isOnSale,
      price: values.price,
      salePercent: values.salePercent,
      categories: values.categories,
    };
    const response = await updateBookDetail(slug, payload);
    message.success(response.message || "Cập nhật truyện thành công");
    await refetch();
  };

  const handleChapterPageChange = (page: number) => {
    setChapterPage(page);
  };

  const handleCreateChapter = () => {
    if (!book) return;
    navigate({
      to: "/books/$bookSlug/create-chapter",
      params: { bookSlug: book.slug },
    });
  };

  const handleThumbnailChange = async (file: File) => {
    if (!slug) {
      return;
    }
    const success = await updateThumbnail(slug, file);
    if (success) {
      await refetch();
    }
  };

  const statusInfo = getStatusTag(book?.status);

  const pricingInfo: PricingInfo = useMemo(() => {
    if (!book) {
      return {
        basePrice: 0,
        salePercent: 0,
        salePrice: 0,
        isFree: false,
      };
    }
    const basePrice = book.price;
    const salePercent = book.isOnSale ? book.salePercent : 0;
    const salePrice = book.isFree
      ? 0
      : salePercent > 0
      ? Math.max(0, basePrice - (basePrice * salePercent) / 100)
      : basePrice;
    return {
      basePrice,
      salePercent,
      salePrice,
      isFree: book.isFree,
    };
  }, [book]);

  if (loadingCategories) {
    return <Spin tip="Đang tải danh sách thể loại..." />;
  }

  if (categoriesError) {
    message.error(categoriesError);
    return null;
  }

  return (
    <div className="book-detail-page">
      <BookDetailHeader
        onBack={handleBack}
        onRefetch={refetch}
        onDelete={handleDelete}
        onUnarchived={handleUnarchived}
        isBookLoaded={!!book}
        book={book}
        categories={categories}
        onUpdateSubmit={handleUpdateSubmit}
      />

      {errorMessage && (
        <Alert
          type="error"
          message="Không thể tải chi tiết truyện"
          description={errorMessage}
          showIcon
          closable
          className="book-detail-page__error"
        />
      )}

      {isLoading && !book ? (
        <div className="book-detail-page__loading">
          <Spin tip="Đang tải chi tiết truyện..." />
        </div>
      ) : book ? (
        <>
          <BookDetailStats
            chapterCount={book.chapters.length}
            viewCount={book.view ?? 0}
            likeCount={book.likeCount ?? 0}
            pricingInfo={pricingInfo}
            statusColor={statusInfo.color}
            statusText={statusInfo.text}
          />

          <BookDetailInfo
            book={book}
            statusColor={statusInfo.color}
            statusText={statusInfo.text}
            onThumbnailChange={handleThumbnailChange}
            isUpdatingThumbnail={isUpdatingThumbnail}
          />

          <div className="book-detail-page__content-grid">
            <div className="book-detail-page__reviews-comments">
              <BookDetailReviewsComments
                ratings={book.ratings}
                comments={book.comments}
                loading={isLoading}
              />
            </div>
            <div className="book-detail-page__chapters">
              <BookDetailChapters
                chapters={currentChapters}
                bookSlug={book.slug}
                isLoading={isLoading}
                page={chapterPage}
                pageSize={chapterPageSize}
                totalChapters={book.chapters.length}
                totalPages={chapterTotalPages}
                onPageChange={handleChapterPageChange}
                onCreateChapter={handleCreateChapter}
                onRefresh={refetch}
              />
            </div>
          </div>
        </>
      ) : (
        <Card className="book-detail-page__empty">
          <Title level={4}>Không tìm thấy truyện</Title>
          <Text>Vui lòng kiểm tra lại đường dẫn hoặc thử tải lại trang.</Text>
        </Card>
      )}
    </div>
  );
}
