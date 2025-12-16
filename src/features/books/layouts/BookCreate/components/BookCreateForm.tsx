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
import { Upload as UploadIcon, Save, X } from "lucide-react";
import { useMemo } from "react";
import type { UploadFile, UploadChangeParam } from "antd/es/upload/interface";
import "./BookCreateForm.scss";

export interface BookCreateFormValues {
  title: string;
  author: string;
  price: number;
}

export interface BookCreateFormProps {
  fileList: UploadFile[];
  isLoading: boolean;
  onFileChange: (info: UploadChangeParam<UploadFile>) => void;
  onSubmit: (values: BookCreateFormValues) => void;
  onCancel: () => void;
}

export default function BookCreateForm({
  fileList,
  isLoading,
  onFileChange,
  onSubmit,
  onCancel,
}: BookCreateFormProps) {
  const [form] = Form.useForm<BookCreateFormValues>();

  const coverPreview = useMemo(
    () => fileList[0]?.thumbUrl || fileList[0]?.url,
    [fileList]
  );

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
    <Card className="book-create-form">
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        initialValues={{ price: 0 }}
      >
        <div className="book-create-form__content">
          {/* Left Column */}
          <div className="book-create-form__left">
            <Form.Item
              label="Tiêu đề"
              name="title"
              rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
            >
              <Input
                className="book-create-form__input"
                placeholder="Nhập tiêu đề truyện tranh..."
              />
            </Form.Item>

            <Form.Item
              label="Tác giả"
              name="author"
              rules={[{ required: true, message: "Vui lòng nhập tác giả" }]}
            >
              <Input
                className="book-create-form__input"
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
                className="book-create-form__input-number"
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
          <div className="book-create-form__right">
            <Form.Item label="Ảnh bìa" name="coverImage" rules={[{ required: false }]}>
              <Upload
                listType="picture-card"
                fileList={fileList}
                onChange={onFileChange}
                beforeUpload={beforeUpload}
                maxCount={1}
                className="book-create-form__upload"
              >
                {fileList.length < 1 && (
                  <div>
                    <UploadIcon size={24} />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                )}
              </Upload>
              {coverPreview && fileList.length === 0 && (
                <div className="book-create-form__cover-preview">
                  <img
                    src={coverPreview}
                    alt="Cover preview"
                    className="book-create-form__cover-image"
                  />
                </div>
              )}
            </Form.Item>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="book-create-form__actions">
          <Space>
            <Button
              icon={<X size={20} />}
              onClick={onCancel}
              className="book-create-form__action-button"
            >
              Hủy
            </Button>
            <Button
              type="primary"
              icon={<Save size={20} />}
              htmlType="submit"
              loading={isLoading}
              className="book-create-form__action-button"
            >
              Tạo truyện
            </Button>
          </Space>
        </div>
      </Form>
    </Card>
  );
}
