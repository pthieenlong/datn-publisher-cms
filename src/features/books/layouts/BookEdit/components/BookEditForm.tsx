import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Space,
  Card,
  Upload,
  Typography,
  message,
} from "antd";
import { Upload as UploadIcon, Save, X } from "lucide-react";
import { useMemo } from "react";
import type { UploadFile, UploadChangeParam } from "antd/es/upload/interface";
import type { Category } from "@/features/categories/types";
import type { BookDetail } from "@/features/books/types";
import "./BookEditForm.scss";

const { TextArea } = Input;
const { Text } = Typography;
const { Option } = Select;

export interface BookEditFormValues {
  title: string;
  slug: string;
  description: string;
  author: string;
  price: number;
  salePercent: number;
  status: string;
  isOnSale: boolean;
  isFree: boolean;
  categories?: string[];
}

export interface BookEditFormProps {
  book: BookDetail | null;
  categories: Category[];
  fileList: UploadFile[];
  isLoading: boolean;
  onFileChange: (info: UploadChangeParam<UploadFile>) => void;
  onSubmit: (values: BookEditFormValues, action: "draft" | "publish") => void;
  onCancel: () => void;
}

export default function BookEditForm({
  book,
  categories,
  fileList,
  isLoading,
  onFileChange,
  onSubmit,
  onCancel,
}: BookEditFormProps) {
  const [form] = Form.useForm<BookEditFormValues>();

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
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error("Ảnh phải nhỏ hơn 10MB!");
      return false;
    }
    return false; // Prevent auto upload
  };

  return (
    <Card className="book-edit-form">
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => onSubmit(values, "draft")}
        initialValues={{
          title: book?.title,
          slug: book?.slug,
          description: book?.description,
          author: book?.author,
          price: book?.price,
          salePercent: book?.salePercent,
          status: book?.status,
          isOnSale: book?.isOnSale,
          isFree: book?.isFree,
        }}
      >
        <div className="book-edit-form__content">
          {/* Left Column */}
          <div className="book-edit-form__left">
            <Form.Item
              label="Tiêu đề"
              name="title"
              rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
            >
              <Input disabled className="book-edit-form__input" />
            </Form.Item>

            <Form.Item
              label="Slug"
              name="slug"
              rules={[{ required: true, message: "Vui lòng nhập slug" }]}
            >
              <Input disabled className="book-edit-form__input" />
            </Form.Item>

            <Form.Item
              label="Mô tả"
              name="description"
              rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
            >
              <TextArea
                rows={6}
                className="book-edit-form__textarea"
                placeholder="Nhập mô tả truyện tranh..."
              />
            </Form.Item>

            <Form.Item
              label="Tác giả"
              name="author"
              rules={[{ required: true, message: "Vui lòng nhập tác giả" }]}
            >
              <Input
                className="book-edit-form__input"
                placeholder="Nhập tên tác giả..."
              />
            </Form.Item>

            <Form.Item label="Nhà xuất bản" name="publisher">
              <Input disabled className="book-edit-form__input" />
            </Form.Item>

            <Form.Item
              label="Thể loại"
              name="categories"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn ít nhất một thể loại",
                },
              ]}
            >
              <Select
                mode="multiple"
                placeholder="Chọn thể loại..."
                className="book-edit-form__select"
              >
                {categories.map((category) => (
                  <Option key={category.id} value={category.id}>
                    {category.title}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Trạng thái"
              name="status"
              rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
            >
              <Select
                className="book-edit-form__select"
                placeholder="Chọn trạng thái..."
              >
                <Option value="publishing">Đang xuất bản</Option>
                <Option value="draft">Nháp</Option>
                <Option value="stopped">Đã ngừng</Option>
              </Select>
            </Form.Item>
          </div>

          {/* Right Column */}
          <div className="book-edit-form__right">
            <Form.Item label="Ảnh bìa" name="coverImage" rules={[{ required: false }]}>
              <Upload
                listType="picture-card"
                fileList={fileList}
                onChange={onFileChange}
                beforeUpload={beforeUpload}
                maxCount={1}
                className="book-edit-form__upload"
              >
                {fileList.length < 1 && (
                  <div>
                    <UploadIcon size={24} />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                )}
              </Upload>
              {(coverPreview || book?.thumbnail) && fileList.length === 0 && (
                <div className="book-edit-form__cover-preview">
                  <img
                    src={coverPreview || book?.thumbnail}
                    alt="Cover preview"
                    className="book-edit-form__cover-image"
                  />
                  <Text className="book-edit-form__cover-text">
                    Ảnh bìa hiện tại
                  </Text>
                </div>
              )}
            </Form.Item>

            <Form.Item
              label="Giá bán (VND)"
              name="price"
              rules={[
                { required: true, message: "Vui lòng nhập giá bán" },
                { type: "number", min: 0, message: "Giá phải lớn hơn 0" },
              ]}
            >
              <InputNumber<number>
                className="book-edit-form__input-number"
                placeholder="Nhập giá bán..."
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) =>
                  Number((value ?? "0").replace(/\$\s?|(,*)/g, "")) || 0
                }
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item
              label="% Giảm giá"
              name="salePercent"
              rules={[{ type: "number", min: 0, max: 100, message: "Từ 0-100%" }]}
            >
              <InputNumber<number>
                className="book-edit-form__input-number"
                placeholder="Nhập % giảm giá..."
                min={0}
                max={100}
                formatter={(value) => `${value}%`}
                parser={(value) => Number((value ?? "0").replace("%", "")) || 0}
                style={{ width: "100%" }}
              />
            </Form.Item>

            <Form.Item label="Miễn phí" name="isFree" valuePropName="checked">
              <Select
                className="book-edit-form__select"
                options={[
                  { label: "Không", value: false },
                  { label: "Có", value: true },
                ]}
              />
            </Form.Item>

            <Form.Item label="Đang giảm giá" name="isOnSale" valuePropName="checked">
              <Select
                className="book-edit-form__select"
                options={[
                  { label: "Không", value: false },
                  { label: "Có", value: true },
                ]}
              />
            </Form.Item>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="book-edit-form__actions">
          <Space>
            <Button
              icon={<X size={20} />}
              onClick={onCancel}
              className="book-edit-form__action-button"
            >
              Hủy
            </Button>
            <Button
              icon={<Save size={20} />}
              onClick={() => form.submit()}
              loading={isLoading}
              className="book-edit-form__action-button"
              disabled={!book}
            >
              Lưu nháp
            </Button>
            <Button
              type="primary"
              icon={<Save size={20} />}
              onClick={() => {
                form.validateFields().then((values) => {
                  onSubmit(values, "publish");
                });
              }}
              loading={isLoading}
              className="book-edit-form__action-button"
              disabled={!book}
            >
              Lưu và xuất bản
            </Button>
          </Space>
        </div>
      </Form>
    </Card>
  );
}
