import {
  Form,
  Input,
  InputNumber,
  Button,
  Space,
  Card,
  Upload,
  message,
} from "antd";
import { ArrowLeft, Upload as UploadIcon, Save, X } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import type { UploadFile } from "antd/es/upload/interface";
import "./BookCreatePage.scss";
import { useDocumentTitle } from "@/hooks";
import { createBook } from "../../services/books.service";

function BookCreatePage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(false);

  useDocumentTitle("Thêm mới Truyện tranh - CMS");

  const coverPreview = useMemo(
    () => fileList[0]?.thumbUrl || fileList[0]?.url,
    [fileList]
  );

  const handleBack = () => {
    navigate({ to: "/books" });
  };

  const handleCancel = () => {
    handleBack();
  };

  const handleSubmit = async (values: {
    title: string;
    author: string;
    price: number;
  }) => {
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
      // Navigate to book detail page after successful creation
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

  const handleUploadChange = (info: any) => {
    let newFileList = [...info.fileList];
    newFileList = newFileList.slice(-1); // Chỉ cho phép 1 file
    setFileList(newFileList);
  };

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("Chỉ được upload file ảnh!");
      return false;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error("Ảnh phải nhỏ hơn 5MB!");
      return false;
    }
    return false; // Prevent auto upload
  };

  return (
    <div className="book-create-page">
      {/* Header Section */}
      <div className="book-create-header">
        <Space>
          <Button
            icon={<ArrowLeft size={20} />}
            onClick={handleBack}
            className="book-create-back-button"
          >
            Quay lại
          </Button>
          <h2 className="book-create-title">Thêm mới Truyện tranh</h2>
        </Space>
      </div>

      <Card className="book-create-form-card">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            price: 0,
          }}
        >
          <div className="book-create-form-content">
            {/* Left Column */}
            <div className="book-create-form-left">
              <Form.Item
                label="Tiêu đề"
                name="title"
                rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
              >
                <Input
                  className="book-create-input"
                  placeholder="Nhập tiêu đề truyện tranh..."
                />
              </Form.Item>

              <Form.Item
                label="Tác giả"
                name="author"
                rules={[{ required: true, message: "Vui lòng nhập tác giả" }]}
              >
                <Input
                  className="book-create-input"
                  placeholder="Nhập tên tác giả..."
                />
              </Form.Item>

              <Form.Item
                label="Giá bán (VND)"
                name="price"
                rules={[
                  { required: true, message: "Vui lòng nhập giá bán" },
                  {
                    type: "number",
                    min: 0,
                    message: "Giá phải lớn hơn hoặc bằng 0",
                  },
                ]}
              >
                <InputNumber<number>
                  className="book-create-input-number"
                  placeholder="Nhập giá bán..."
                  formatter={(value) =>
                    `${value ?? ""}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) =>
                    Number((value ?? "0").replace(/\$\s?|(,*)/g, "")) || 0
                  }
                  style={{ width: "100%" }}
                  min={0}
                />
              </Form.Item>
            </div>

            {/* Right Column */}
            <div className="book-create-form-right">
              <Form.Item
                label="Ảnh bìa"
                name="coverImage"
                rules={[{ required: false }]}
              >
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  onChange={handleUploadChange}
                  beforeUpload={beforeUpload}
                  maxCount={1}
                  className="book-create-upload"
                >
                  {fileList.length < 1 && (
                    <div>
                      <UploadIcon size={24} />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  )}
                </Upload>
                {coverPreview && fileList.length === 0 && (
                  <div className="book-create-cover-preview">
                    <img
                      src={coverPreview}
                      alt="Cover preview"
                      className="book-create-cover-image"
                    />
                  </div>
                )}
              </Form.Item>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="book-create-actions">
            <Space>
              <Button
                icon={<X size={20} />}
                onClick={handleCancel}
                className="book-create-action-button"
              >
                Hủy
              </Button>
              <Button
                type="primary"
                icon={<Save size={20} />}
                htmlType="submit"
                loading={loading}
                className="book-create-action-button"
              >
                Tạo truyện
              </Button>
            </Space>
          </div>
        </Form>
      </Card>
    </div>
  );
}

export default BookCreatePage;
