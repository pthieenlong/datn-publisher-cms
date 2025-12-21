import { useState } from "react";
import {
  Typography,
  Button,
  Space,
  Popover,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Row,
  Col,
  message,
} from "antd";
import { ArrowLeft, Trash2, Edit3 } from "lucide-react";
import type { Category } from "@/features/categories/types";
import type { BookDetail } from "@/features/books/types";
import "./BookDetailHeader.scss";

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export interface BookUpdateFormValues {
  title: string;
  author: string;
  description: string;
  price: number;
  salePercent: number;
  isFree: boolean;
  isOnSale: boolean;
  categories?: string[];
}

export interface BookDetailHeaderProps {
  onBack: () => void;
  onRefetch: () => void;
  onDelete: () => void;
  isBookLoaded: boolean;
  book: BookDetail | null;
  categories: Category[];
  onUpdateSubmit: (values: BookUpdateFormValues) => Promise<void>;
}

export default function BookDetailHeader({
  onBack,
  onRefetch,
  onDelete,
  isBookLoaded,
  book,
  categories,
  onUpdateSubmit,
}: BookDetailHeaderProps) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form] = Form.useForm<BookUpdateFormValues>();

  const handleOpenPopover = () => {
    if (!book) return;

    // Điền dữ liệu vào form khi mở popover
    form.setFieldsValue({
      title: book.title,
      author: book.author,
      description: book.description,
      price: book.price,
      salePercent: book.salePercent,
      isFree: book.isFree,
      isOnSale: book.isOnSale,
      categories: book.categories?.map((cat) => cat.slug) || [],
    });
    setIsPopoverOpen(true);
  };

  const handleClosePopover = () => {
    setIsPopoverOpen(false);
    form.resetFields();
  };

  const handleSubmit = async (values: BookUpdateFormValues) => {
    setIsSubmitting(true);
    try {
      await onUpdateSubmit(values);
      message.success("Cập nhật thông tin thành công");
      handleClosePopover();
    } catch (error: unknown) {
      console.error(error);
      message.error("Không thể cập nhật thông tin");
    } finally {
      setIsSubmitting(false);
    }
  };

  const popoverContent = (
    <div className="book-detail-header__popover-content">
      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmit}
        disabled={!book}
      >
        <Form.Item
          label="Tiêu đề"
          name="title"
          rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
        >
          <Input placeholder="Nhập tiêu đề truyện..." />
        </Form.Item>

        <Form.Item
          label="Tác giả"
          name="author"
          rules={[{ required: true, message: "Vui lòng nhập tác giả" }]}
        >
          <Input placeholder="Nhập tên tác giả..." />
        </Form.Item>

        <Form.Item label="Mô tả" name="description">
          <TextArea rows={4} placeholder="Nhập mô tả truyện..." />
        </Form.Item>

        <Form.Item label="Thể loại" name="categories">
          <Select mode="multiple" placeholder="Chọn thể loại...">
            {categories.map((category) => (
              <Option key={category.id} value={category.slug}>
                {category.title}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Row gutter={[16, 0]}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Giá niêm yết (VND)"
              name="price"
              rules={[
                { required: true, message: "Vui lòng nhập giá" },
                { type: "number", min: 0, message: "Giá phải lớn hơn 0" },
              ]}
            >
              <InputNumber<number>
                style={{ width: "100%" }}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) =>
                  Number((value ?? "0").replace(/\$\s?|(,*)/g, "")) || 0
                }
                placeholder="VD: 30.000"
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item
              label="% Giảm giá"
              name="salePercent"
              rules={[{ type: "number", min: 0, max: 100, message: "Từ 0-100%" }]}
            >
              <InputNumber<number>
                style={{ width: "100%" }}
                min={0}
                max={100}
                formatter={(value) => `${value}%`}
                parser={(value) => Number((value ?? "0").replace("%", "")) || 0}
                placeholder="VD: 20%"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 0]}>
          <Col xs={12}>
            <Form.Item name="isFree" valuePropName="checked" label="Miễn phí">
              <Switch />
            </Form.Item>
          </Col>
          <Col xs={12}>
            <Form.Item
              name="isOnSale"
              valuePropName="checked"
              label="Đang giảm giá"
            >
              <Switch />
            </Form.Item>
          </Col>
        </Row>

        <div className="book-detail-header__popover-actions">
          <Space>
            <Button onClick={handleClosePopover} disabled={isSubmitting}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" loading={isSubmitting}>
              Lưu
            </Button>
          </Space>
        </div>
      </Form>
    </div>
  );

  return (
    <div className="book-detail-header">
      <Space>
        <Button
          icon={<ArrowLeft size={20} />}
          onClick={onBack}
          className="book-detail-header__back-button"
        >
          Quay lại
        </Button>
        <Title level={2} className="book-detail-header__title">
          Chi tiết Truyện tranh
        </Title>
      </Space>
      <Space>
        <Button onClick={onRefetch} className="book-detail-header__refresh">
          Tải lại
        </Button>
        <Popover
          content={popoverContent}
          title="Cập nhật thông tin truyện"
          trigger="click"
          open={isPopoverOpen}
          onOpenChange={(open) => {
            if (open) {
              handleOpenPopover();
            } else {
              handleClosePopover();
            }
          }}
          placement="bottomRight"
          rootClassName="book-detail-header__popover"
        >
          <Button
            icon={<Edit3 size={16} />}
            className="book-detail-header__update"
            disabled={!isBookLoaded}
          >
            Cập nhật thông tin
          </Button>
        </Popover>
        <Button
          danger
          icon={<Trash2 size={20} />}
          className="book-detail-header__action-button"
          disabled={!isBookLoaded}
          onClick={onDelete}
        >
          Xóa
        </Button>
      </Space>
    </div>
  );
}
