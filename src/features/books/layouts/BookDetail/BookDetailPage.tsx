import { Alert, Spin, Card, Typography, Row, Col, Form, message } from "antd";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useDocumentTitle } from "@/hooks";
import { useBookDetail } from "../../hooks/useBookDetail";
import { useCategories } from "@/features/categories";
import { updateBookDetail } from "../../services/books.service";
import {
  BookDetailHeader,
  BookDetailStats,
  BookDetailInfo,
  BookDetailPricing,
  BookDetailChapters,
  BookQuickEditForm,
} from "./components";
import type { BookQuickEditFormValues } from "./components";
import type { PricingInfo } from "./components/BookDetailPricing";
import "./BookDetailPage.scss";

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
  const [quickEditForm] = Form.useForm<BookQuickEditFormValues>();
  const [isQuickSaving, setIsQuickSaving] = useState(false);
  const {
    categories,
    isLoading: loadingCategories,
    errorMessage: categoriesError,
  } = useCategories();

  useDocumentTitle(
    book
      ? `${book.title} - Chi tiết Truyện tranh - CMS`
      : "Chi tiết Truyện tranh - CMS"
  );

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

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

  const handleDelete = () => {
    // TODO: Implement delete functionality
    console.log("Delete book:", book?.id);
  };

  const handleChapterPageChange = (page: number) => {
    setChapterPage(page);
  };

  const statusInfo = getStatusTag(book?.status);

  useEffect(() => {
    if (!book) {
      quickEditForm.resetFields();
      return;
    }
    quickEditForm.setFieldsValue({
      title: book.title,
      slug: book.slug,
      description: book.description,
      author: book.author,
      policy: book.policy,
      status: book.status,
      price: book.price,
      salePercent: book.salePercent,
      isFree: book.isFree,
      isOnSale: book.isOnSale,
    });
  }, [book, quickEditForm]);

  const handleQuickEditSubmit = async (values: BookQuickEditFormValues) => {
    setIsQuickSaving(true);
    try {
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
    } catch (error: unknown) {
      console.error(error);
      message.error("Không thể lưu thay đổi");
    } finally {
      setIsQuickSaving(false);
    }
  };

  const resetQuickEditForm = () => {
    if (!book) {
      quickEditForm.resetFields();
      return;
    }
    quickEditForm.setFieldsValue({
      title: book.title,
      slug: book.slug,
      description: book.description,
      author: book.author,
      policy: book.policy,
      status: book.status,
      price: book.price,
      salePercent: book.salePercent,
      isFree: book.isFree,
      isOnSale: book.isOnSale,
    });
  };

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

  const priceDisplay = useMemo(() => {
    if (!book) return "0";
    if (book.isFree || pricingInfo.salePrice === 0) {
      return "Miễn phí";
    }
    return formatCurrency(pricingInfo.salePrice);
  }, [book, pricingInfo]);

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
        isBookLoaded={!!book}
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
            priceDisplay={priceDisplay}
          />

          <BookDetailInfo
            book={book}
            statusColor={statusInfo.color}
            statusText={statusInfo.text}
          />

          <div className="book-detail-page__bottom">
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={12}>
                <BookDetailPricing
                  pricingInfo={pricingInfo}
                  statusColor={statusInfo.color}
                  statusText={statusInfo.text}
                />
              </Col>
              <Col xs={24} lg={12}>
                <BookDetailChapters
                  chapters={currentChapters}
                  bookSlug={book.slug}
                  isLoading={isLoading}
                  page={chapterPage}
                  pageSize={chapterPageSize}
                  totalChapters={book.chapters.length}
                  totalPages={chapterTotalPages}
                  onPageChange={handleChapterPageChange}
                />
              </Col>
            </Row>
          </div>

          <BookQuickEditForm
            form={quickEditForm}
            book={book}
            categories={categories}
            isSubmitting={isQuickSaving}
            onSubmit={handleQuickEditSubmit}
            onReset={resetQuickEditForm}
          />
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
