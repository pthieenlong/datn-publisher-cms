import { useState } from "react";
import { Alert, Spin, Button, Typography, message } from "antd";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "@tanstack/react-router";
import type { UploadChangeParam, UploadFile } from "antd/es/upload/interface";
import { useDocumentTitle } from "@/hooks";
import { useBookDetail } from "../../hooks/useBookDetail";
import { useCreateChapter } from "../../hooks/useCreateChapter";
import { ChapterCreateForm } from "./components";
import type { ChapterCreateFormValues } from "./components";
import "./ChapterCreatePage.scss";

const { Title, Text } = Typography;

export default function ChapterCreatePage() {
  const { bookSlug } = useParams({ from: "/books/$bookSlug/create-chapter" });
  const navigate = useNavigate();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const {
    book,
    isLoading: isLoadingBook,
    errorMessage: bookError,
  } = useBookDetail({ slug: bookSlug });
  const {
    createNewChapter,
    isCreating,
    errorMessage: createError,
  } = useCreateChapter();

  useDocumentTitle(`Tạo chương mới - ${book?.title || "..."} - CMS`);

  const handleBack = () => {
    navigate({
      to: "/books/$slug",
      params: { slug: bookSlug },
    });
  };

  const handleFileChange = (info: UploadChangeParam<UploadFile>) => {
    setFileList(info.fileList);
  };

  const handleSubmit = async (values: ChapterCreateFormValues) => {
    if (fileList.length === 0) {
      message.error("Vui lòng tải lên ít nhất một trang truyện");
      return;
    }

    // Convert UploadFile[] to File[]
    const galleries = fileList
      .map((file) => file.originFileObj)
      .filter((file) => file !== undefined) as File[];

    if (galleries.length === 0) {
      message.error("Không thể xử lý file đã tải lên. Vui lòng thử lại");
      return;
    }

    const success = await createNewChapter(bookSlug, {
      title: values.title,
      isFree: values.isFree,
      price: values.isFree ? 0 : values.price,
      isOnSale: values.isFree ? false : values.isOnSale,
      salePercent: values.isFree || !values.isOnSale ? 0 : values.salePercent,
      galleries,
    });

    if (success) {
      message.success("Tạo chương mới thành công");
      handleBack();
    }
  };

  if (isLoadingBook) {
    return (
      <div className="chapter-create-page">
        <div className="chapter-create-page__loading">
          <Spin size="large" tip="Đang tải thông tin truyện..." />
        </div>
      </div>
    );
  }

  if (bookError || !book) {
    return (
      <div className="chapter-create-page">
        <Alert
          type="error"
          message="Không thể tải thông tin truyện"
          description={bookError || "Truyện không tồn tại"}
          showIcon
        />
      </div>
    );
  }

  return (
    <div className="chapter-create-page">
      {/* Header */}
      <div className="chapter-create-page__header">
        <Button
          icon={<ArrowLeft size={20} />}
          onClick={handleBack}
          disabled={isCreating}
          className="chapter-create-page__back-button"
        >
          Quay lại
        </Button>
        <div className="chapter-create-page__title-section">
          <Title level={2} className="chapter-create-page__title">
            Tạo chương mới
          </Title>
          <Text className="chapter-create-page__subtitle">
            Truyện: <strong>{book.title}</strong>
          </Text>
        </div>
      </div>

      {/* Error Alert */}
      {createError && (
        <Alert
          type="error"
          message="Có lỗi xảy ra"
          description={createError}
          showIcon
          closable
          className="chapter-create-page__error"
        />
      )}

      {/* Form */}
      <ChapterCreateForm
        fileList={fileList}
        isLoading={isCreating}
        onFileChange={handleFileChange}
        onSubmit={handleSubmit}
        onCancel={handleBack}
      />
    </div>
  );
}
