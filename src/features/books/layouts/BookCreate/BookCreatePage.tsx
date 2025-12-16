import { Button, Space, message } from "antd";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import type { UploadFile, UploadChangeParam } from "antd/es/upload/interface";
import { useDocumentTitle } from "@/hooks";
import { createBook } from "../../services/books.service";
import { BookCreateForm } from "./components";
import type { BookCreateFormValues } from "./components";
import "./BookCreatePage.scss";

export default function BookCreatePage() {
  const navigate = useNavigate();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(false);

  useDocumentTitle("Thêm mới Truyện tranh - CMS");

  const handleBack = () => {
    navigate({ to: "/books" });
  };

  const handleFileChange = (info: UploadChangeParam<UploadFile>) => {
    let newFileList = [...info.fileList];
    newFileList = newFileList.slice(-1); // Chỉ cho phép 1 file
    setFileList(newFileList);
  };

  const handleSubmit = async (values: BookCreateFormValues) => {
    setLoading(true);
    try {
      const coverImageFile = fileList[0]?.originFileObj as File | undefined;
      const payload = {
        title: values.title,
        author: values.author,
        price: values.price,
        thumbnail: coverImageFile,
      };
      const response = await createBook(payload);
      message.success(response.message || "Tạo truyện thành công");
      if (response.data?.slug) {
        navigate({ to: `/books/${response.data.slug}` });
      } else {
        navigate({ to: "/books" });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Có lỗi xảy ra khi tạo truyện";
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="book-create-page">
      {/* Header Section */}
      <div className="book-create-page__header">
        <Space>
          <Button
            icon={<ArrowLeft size={20} />}
            onClick={handleBack}
            className="book-create-page__back-button"
          >
            Quay lại
          </Button>
          <h2 className="book-create-page__title">Thêm mới Truyện tranh</h2>
        </Space>
      </div>

      <BookCreateForm
        fileList={fileList}
        isLoading={loading}
        onFileChange={handleFileChange}
        onSubmit={handleSubmit}
        onCancel={handleBack}
      />
    </div>
  );
}
