import { Button, Space, Alert, Spin, message } from "antd";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { UploadFile, UploadChangeParam } from "antd/es/upload/interface";
import { useDocumentTitle } from "@/hooks";
import { useBookDetail } from "../../hooks/useBookDetail";
import { updateBookDetail } from "../../services/books.service";
import { useCategories } from "@/features/categories";
import { BookEditForm } from "./components";
import type { BookEditFormValues } from "./components";
import "./BookEditPage.scss";

export default function BookEditPage() {
  const { slug } = useParams({ from: "/books/$slug/edit" });
  const navigate = useNavigate();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(false);
  const { book, isLoading, errorMessage, refetch } = useBookDetail({ slug });
  const {
    categories,
    isLoading: loadingCategories,
    errorMessage: categoriesError,
  } = useCategories();

  useDocumentTitle("Chỉnh sửa Truyện tranh - CMS");

  useEffect(() => {
    if (!book) {
      setFileList([]);
    }
  }, [book]);

  const handleBack = () => {
    navigate({ to: `/books/${slug}` });
  };

  const handleFileChange = (info: UploadChangeParam<UploadFile>) => {
    let newFileList = [...info.fileList];
    newFileList = newFileList.slice(-1); // Chỉ cho phép 1 file
    setFileList(newFileList);
  };

  const handleSubmit = async (values: BookEditFormValues, action: "draft" | "publish") => {
    if (!slug) {
      return;
    }
    setLoading(true);
    try {
      const coverImageFile = fileList[0]?.originFileObj as File | undefined;
      const payload = {
        thumbnail: coverImageFile,
        price: values.price,
        salePercent: values.salePercent,
        isOnSale: values.isOnSale ?? false,
        isFree: values.isFree ?? false,
        description: values.description,
      };
      const response = await updateBookDetail(slug, payload);
      message.success(response.message || "Cập nhật truyện thành công");
      await refetch();
      if (action === "publish") {
        navigate({ to: `/books/${slug}` });
      }
    } catch (error) {
      const errMessage =
        error instanceof Error ? error.message : "Có lỗi xảy ra khi cập nhật";
      message.error(errMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loadingCategories) {
    return <Spin tip="Đang tải danh sách thể loại..." />;
  }

  if (categoriesError) {
    message.error(categoriesError);
    return null;
  }

  return (
    <div className="book-edit-page">
      {/* Header Section */}
      <div className="book-edit-page__header">
        <Space>
          <Button
            icon={<ArrowLeft size={20} />}
            onClick={handleBack}
            className="book-edit-page__back-button"
          >
            Quay lại
          </Button>
          <h2 className="book-edit-page__title">Chỉnh sửa Truyện tranh</h2>
        </Space>
      </div>

      {errorMessage && (
        <Alert
          type="error"
          message="Không thể tải chi tiết truyện"
          description={errorMessage}
          showIcon
          className="book-edit-page__error"
        />
      )}

      {isLoading && !book ? (
        <div className="book-edit-page__loading">
          <Spin tip="Đang tải chi tiết truyện..." />
        </div>
      ) : (
        <BookEditForm
          book={book}
          categories={categories}
          fileList={fileList}
          isLoading={loading}
          onFileChange={handleFileChange}
          onSubmit={handleSubmit}
          onCancel={handleBack}
        />
      )}
    </div>
  );
}
