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
  Spin,
  Alert,
} from "antd";
import { ArrowLeft, Upload as UploadIcon, Save, X } from "lucide-react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import type { UploadFile } from "antd/es/upload/interface";
import "./BookEditPage.scss";
import { useDocumentTitle } from "@/hooks";
import { useBookDetail } from "../../hooks/useBookDetail";
import { updateBookDetail } from "../../services/books.service";
import { useCategories } from "../../../categories";

const { TextArea } = Input;
const { Text } = Typography;
const { Option } = Select;

function BookEditPage() {
  const { slug } = useParams({ from: "/books/$slug/edit" });
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(false);
  const { book, isLoading, errorMessage, refetch } = useBookDetail({ slug });
  const {
    categories,
    isLoading: loadingCategories,
    errorMessage: categoriesError,
  } = useCategories();

  useDocumentTitle(`Chỉnh sửa Truyện tranh - CMS`);

  useEffect(() => {
    if (!book) {
      form.resetFields();
      setFileList([]);
      return;
    }
    form.setFieldsValue({
      title: book.title,
      slug: book.slug,
      description: book.description,
      author: book.author,
      price: book.price,
      salePercent: book.salePercent,
      status: book.status,
      isOnSale: book.isOnSale,
      isFree: book.isFree,
    });
    setFileList([]);
  }, [book, form]);

  const coverPreview = useMemo(
    () => fileList[0]?.thumbUrl || fileList[0]?.url,
    [fileList]
  );

  const handleBack = () => {
    navigate({ to: `/books/${slug}` });
  };

  const handleCancel = () => {
    handleBack();
  };

  const handleSubmit = async (values: any, action: "draft" | "publish") => {
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
      const errorMessage =
        error instanceof Error ? error.message : "Có lỗi xảy ra khi cập nhật";
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
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error("Ảnh phải nhỏ hơn 10MB!");
      return false;
    }
    return false; // Prevent auto upload
  };
  if (loadingCategories) {
    return <Spin tip="Đang tải danh sách thể loại..." />;
  }

  if (categoriesError) {
    message.error(categoriesError);
    return null; // Adjust how you want to handle this
  }

  console.log(book);
  return (
    <div className="book-edit-page">
      {/* Header Section */}
      <div className="book-edit-header">
        <Space>
          <Button
            icon={<ArrowLeft size={20} />}
            onClick={handleBack}
            className="book-edit-back-button"
          >
            Quay lại
          </Button>
          <h2 className="book-edit-title">Chỉnh sửa Truyện tranh</h2>
        </Space>
      </div>

      {errorMessage && (
        <Alert
          type="error"
          message="Không thể tải chi tiết truyện"
          description={errorMessage}
          showIcon
          className="book-edit-error"
        />
      )}

      {isLoading && !book ? (
        <div className="book-edit-loading">
          <Spin tip="Đang tải chi tiết truyện..." />
        </div>
      ) : (
        <Card className="book-edit-form-card">
          <Form
            form={form}
            layout="vertical"
            onFinish={(values) => handleSubmit(values, "draft")}
          >
            <div className="book-edit-form-content">
              {/* Left Column */}
              <div className="book-edit-form-left">
                <Form.Item
                  label="Tiêu đề"
                  name="title"
                  rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
                >
                  <Input disabled className="book-edit-input" />
                </Form.Item>

                <Form.Item
                  label="Slug"
                  name="slug"
                  rules={[{ required: true, message: "Vui lòng nhập slug" }]}
                >
                  <Input disabled className="book-edit-input" />
                </Form.Item>

                <Form.Item
                  label="Mô tả"
                  name="description"
                  rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
                >
                  <TextArea
                    rows={6}
                    className="book-edit-textarea"
                    placeholder="Nhập mô tả truyện tranh..."
                  />
                </Form.Item>

                <Form.Item
                  label="Tác giả"
                  name="author"
                  rules={[{ required: true, message: "Vui lòng nhập tác giả" }]}
                >
                  <Input
                    className="book-edit-input"
                    placeholder="Nhập tên tác giả..."
                  />
                </Form.Item>

                <Form.Item label="Nhà xuất bản" name="publisher">
                  <Input disabled className="book-edit-input" />
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
                    className="book-edit-select"
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
                  rules={[
                    { required: true, message: "Vui lòng chọn trạng thái" },
                  ]}
                >
                  <Select
                    className="book-edit-select"
                    placeholder="Chọn trạng thái..."
                  >
                    <Option value="publishing">Đang xuất bản</Option>
                    <Option value="draft">Nháp</Option>
                    <Option value="stopped">Đã ngừng</Option>
                  </Select>
                </Form.Item>
              </div>

              {/* Right Column */}
              <div className="book-edit-form-right">
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
                    className="book-edit-upload"
                  >
                    {fileList.length < 1 && (
                      <div>
                        <UploadIcon size={24} />
                        <div style={{ marginTop: 8 }}>Upload</div>
                      </div>
                    )}
                  </Upload>
                  {(coverPreview || book?.thumbnail) &&
                    fileList.length === 0 && (
                      <div className="book-edit-cover-preview">
                        <img
                          src={coverPreview || book?.thumbnail}
                          alt="Cover preview"
                          className="book-edit-cover-image"
                        />
                        <Text className="book-edit-cover-text">
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
                    className="book-edit-input-number"
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
                  rules={[
                    { type: "number", min: 0, max: 100, message: "Từ 0-100%" },
                  ]}
                >
                  <InputNumber<number>
                    className="book-edit-input-number"
                    placeholder="Nhập % giảm giá..."
                    min={0}
                    max={100}
                    formatter={(value) => `${value}%`}
                    parser={(value) =>
                      Number((value ?? "0").replace("%", "")) || 0
                    }
                    style={{ width: "100%" }}
                  />
                </Form.Item>

                <Form.Item
                  label="Miễn phí"
                  name="isFree"
                  valuePropName="checked"
                >
                  <Select
                    className="book-edit-select"
                    options={[
                      { label: "Không", value: false },
                      { label: "Có", value: true },
                    ]}
                  />
                </Form.Item>

                <Form.Item
                  label="Đang giảm giá"
                  name="isOnSale"
                  valuePropName="checked"
                >
                  <Select
                    className="book-edit-select"
                    options={[
                      { label: "Không", value: false },
                      { label: "Có", value: true },
                    ]}
                  />
                </Form.Item>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="book-edit-actions">
              <Space>
                <Button
                  icon={<X size={20} />}
                  onClick={handleCancel}
                  className="book-edit-action-button"
                >
                  Hủy
                </Button>
                <Button
                  icon={<Save size={20} />}
                  onClick={() => form.submit()}
                  loading={loading}
                  className="book-edit-action-button"
                  disabled={!book}
                >
                  Lưu nháp
                </Button>
                <Button
                  type="primary"
                  icon={<Save size={20} />}
                  onClick={() => {
                    form.validateFields().then((values) => {
                      handleSubmit(values, "publish");
                    });
                  }}
                  loading={loading}
                  className="book-edit-action-button"
                  disabled={!book}
                >
                  Lưu và xuất bản
                </Button>
              </Space>
            </div>
          </Form>
        </Card>
      )}
    </div>
  );
}

export default BookEditPage;
