import {
  Typography,
  Button,
  Space,
  Card,
  Tag,
  Image,
  Alert,
  Spin,
  Carousel,
} from "antd";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import "./ChapterDetailPage.scss";
import { useDocumentTitle } from "@/hooks";
import { useChapterDetail } from "../../hooks/useChapterDetail";
import type { CarouselRef } from "antd/es/carousel";
import { useDeleteChapter } from "../../hooks/useDeleteChapter";
import { useUnarchiveChapter } from "../../hooks/useUnarchiveChapter";

const { Title, Text } = Typography;
const { PreviewGroup } = Image;

function ChapterDetailPage() {
  const { bookSlug, chapterSlug } = useParams({
    from: "/books/$bookSlug/chapters/$chapterSlug",
  });
  const navigate = useNavigate();
  const { chapter, isLoading, errorMessage, contentCount, refetch } =
    useChapterDetail({
      bookSlug,
      chapterSlug,
    });
  const { isDeleting, deleteExistingChapter } = useDeleteChapter();
  const { unarchiveExistingChapter } = useUnarchiveChapter();

  const carouselRef = useRef<CarouselRef | null>(null);
  const prevChapterIdRef = useRef<string | undefined>(undefined);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Reset slide khi chapter thay đổi (sync logic)
  if (chapter?.id !== prevChapterIdRef.current) {
    prevChapterIdRef.current = chapter?.id;
    if (currentSlide !== 0) {
      setCurrentSlide(0);
    }
  }

  useDocumentTitle(
    chapter
      ? `${chapter.title} - Chi tiết Chương - CMS`
      : "Chi tiết Chương - CMS"
  );

  const formatDate = (dateString?: string | null): string => {
    if (!dateString) {
      return "-";
    }
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  };

  const getStatusTag = (status: string) => {
    return status === "PUBLISHED"
      ? { color: "success", text: "Đã xuất bản" }
      : { color: "default", text: "Nháp" };
  };

  const handleBack = () => {
    navigate({ to: `/books/${bookSlug}` });
  };

  const handleEdit = () => {
    navigate({
      to: "/books/$bookSlug/chapters/$chapterSlug/edit",
      params: { bookSlug, chapterSlug },
    });
  };

  const handleDelete = async () => {
    if (!chapter) {
      return;
    }
    const success = await deleteExistingChapter(bookSlug, chapterSlug);
    if (success) {
      refetch();
    }
  };

  const handlePublish = async () => {
    if (!chapter) {
      return;
    }
    const success = await unarchiveExistingChapter(bookSlug, chapterSlug);
    if (success) {
      refetch();
    }
  };

  const statusInfo = getStatusTag(chapter?.status ?? "DRAFT");

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.goTo(0, false);
    }
  }, [chapter?.id]);

  const handlePrev = () => {
    carouselRef.current?.prev();
  };

  const handleNext = () => {
    carouselRef.current?.next();
  };

  return (
    <div className="chapter-detail-page">
      {/* Header Section */}
      <div className="chapter-detail-header">
        <Space>
          <Button
            icon={<ArrowLeft size={20} />}
            onClick={handleBack}
            className="chapter-detail-back-button"
          >
            Quay lại
          </Button>
          <Title level={2} className="chapter-detail-title">
            Chi tiết Chương
          </Title>
        </Space>
        <Button onClick={refetch}>Tải lại</Button>
      </div>

      {/* Action Buttons */}
      <div className="chapter-detail-actions">
        <Space>
          <Button
            type="primary"
            icon={<Edit size={20} />}
            onClick={handleEdit}
            className="chapter-detail-action-button"
          >
            Chỉnh sửa
          </Button>
          {chapter?.status !== "ARCHIVED" ? (
            <Button
              danger
              icon={<Trash2 size={20} />}
              onClick={handleDelete}
              disabled={!chapter || isDeleting}
              className="chapter-detail-action-button"
            >
              Lưu trữ
            </Button>
          ) : (
            <Button
              type="primary"
              icon={<Eye size={20} />}
              onClick={handlePublish}
              className="chapter-detail-action-button"
              disabled={!chapter}
            >
              Khôi phục
            </Button>
          )}
        </Space>
      </div>

      {errorMessage && (
        <Alert
          type="error"
          message="Không thể tải chi tiết chương"
          description={errorMessage}
          showIcon
          closable
          className="chapter-detail-error"
        />
      )}

      {isLoading && !chapter ? (
        <div className="chapter-detail-loading">
          <Spin tip="Đang tải chi tiết chương..." />
        </div>
      ) : chapter ? (
        <>
          {/* Chapter Info Section */}
          <div className="chapter-detail-info">
            <Card className="chapter-detail-info-card">
              <div className="chapter-detail-content">
                <div className="chapter-detail-header-info">
                  <Title level={3} className="chapter-detail-content-title">
                    {chapter.title}
                  </Title>
                  <Tag
                    color={statusInfo.color}
                    className="chapter-detail-status-tag"
                  >
                    {statusInfo.text}
                  </Tag>
                </div>
                <Text className="chapter-detail-content-slug">
                  {chapter.slug}
                </Text>
                <div className="chapter-detail-content-meta">
                  <div className="chapter-detail-meta-item">
                    <Text strong>Thuộc truyện:</Text>
                    <Text>{chapter.book.title}</Text>
                  </div>
                  <div className="chapter-detail-meta-item">
                    <Text strong>Số chương:</Text>
                    <Text>{chapter.chapterNumber}</Text>
                  </div>
                  <div className="chapter-detail-meta-item">
                    <Text strong>Ngày phát hành:</Text>
                    <Text>{formatDate(chapter.publishedAt)}</Text>
                  </div>
                  <div className="chapter-detail-meta-item">
                    <Text strong>Ngày tạo:</Text>
                    <Text>{formatDate(chapter.createdAt)}</Text>
                  </div>
                  <div className="chapter-detail-meta-item">
                    <Text strong>Cập nhật:</Text>
                    <Text>{formatDate(chapter.updatedAt)}</Text>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Chapter Content - Album */}
          <div className="chapter-detail-content-section">
            <Card className="chapter-detail-content-card">
              <div className="chapter-detail-content-header">
                <Title level={4} className="chapter-detail-section-title">
                  Nội dung chương
                </Title>
                <Text>
                  {chapter.content.length > 0
                    ? `Trang ${currentSlide + 1}/${contentCount}`
                    : "0 trang"}
                </Text>
              </div>
              <div className="chapter-detail-album">
                {chapter.content.length > 0 ? (
                  <PreviewGroup>
                    <div className="chapter-detail-carousel">
                      <Carousel
                        ref={carouselRef}
                        dots={false}
                        afterChange={(index) => setCurrentSlide(index)}
                      >
                        {chapter.content.map((image, index) => (
                          <div key={image} className="chapter-detail-slide">
                            <Image
                              src={image}
                              alt={`Trang ${index + 1}`}
                              className="chapter-detail-image"
                            />
                          </div>
                        ))}
                      </Carousel>
                      <div className="chapter-detail-carousel-controls">
                        <Button
                          icon={<ChevronLeft size={18} />}
                          onClick={handlePrev}
                          disabled={currentSlide === 0}
                          className="chapter-detail-carousel-button"
                        >
                          Trước
                        </Button>
                        <span className="chapter-detail-carousel-indicator">
                          {currentSlide + 1}/{contentCount}
                        </span>
                        <Button
                          icon={<ChevronRight size={18} />}
                          onClick={handleNext}
                          disabled={currentSlide >= contentCount - 1}
                          className="chapter-detail-carousel-button"
                        >
                          Sau
                        </Button>
                      </div>
                    </div>
                  </PreviewGroup>
                ) : (
                  <Text>Chưa có nội dung cho chương này.</Text>
                )}
              </div>
            </Card>
          </div>
        </>
      ) : (
        <Card className="chapter-detail-empty">
          <Title level={4}>Không tìm thấy chương</Title>
          <Text>Vui lòng kiểm tra lại đường dẫn hoặc thử tải lại trang.</Text>
        </Card>
      )}
    </div>
  );
}

export default ChapterDetailPage;
