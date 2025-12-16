import {
  Card,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  Button,
  Space,
  Typography,
  Row,
  Col,
} from "antd";
import type { FormInstance } from "antd";
import type { Category } from "@/features/categories/types";
import type { BookDetail } from "@/features/books/types";
import "./BookQuickEditForm.scss";

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export interface BookQuickEditFormValues {
  title: string;
  slug: string;
  description: string;
  author: string;
  policy: string;
  status: string;
  price: number;
  salePercent: number;
  isFree: boolean;
  isOnSale: boolean;
  categories?: string[];
}

export interface BookQuickEditFormProps {
  form: FormInstance<BookQuickEditFormValues>;
  book: BookDetail | null;
  categories: Category[];
  isSubmitting: boolean;
  onSubmit: (values: BookQuickEditFormValues) => void;
  onReset: () => void;
}

export default function BookQuickEditForm({
  form,
  book,
  categories,
  isSubmitting,
  onSubmit,
  onReset,
}: BookQuickEditFormProps) {
  return (
    <Card className="book-quick-edit-form">
      <Title level={4} className="book-quick-edit-form__title">
        Chỉnh sửa nhanh
      </Title>
      <Form
        layout="vertical"
        form={form}
        onFinish={onSubmit}
        disabled={!book}
      >
        <Row gutter={[16, 0]}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Tiêu đề"
              name="title"
              rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
            >
              <Input placeholder="Nhập tiêu đề truyện..." />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Slug" name="slug" initialValue={book?.slug}>
              <Input disabled />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 0]}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Tác giả"
              name="author"
              rules={[{ required: true, message: "Vui lòng nhập tác giả" }]}
            >
              <Input placeholder="Nhập tên tác giả..." />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              label="Trạng thái"
              name="status"
              rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
            >
              <Select placeholder="Chọn trạng thái...">
                <Option value="DRAFT">Nháp</Option>
                <Option value="ARCHIVED">Đã lưu trữ</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Mô tả"
          name="description"
          initialValue={book?.description}
        >
          <TextArea rows={4} />
        </Form.Item>

        <Form.Item label="Thể loại" name="categories">
          <Select
            mode="multiple"
            placeholder="Chọn thể loại..."
            className="book-quick-edit-form__select"
          >
            {categories.map((category) => (
              <Option key={category.id} value={category.slug}>
                {category.title}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Row gutter={[16, 0]}>
          <Col xs={24} md={8}>
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
          <Col xs={24} md={8}>
            <Form.Item
              label="% Giảm giá"
              name="salePercent"
              rules={[
                { type: "number", min: 0, max: 100, message: "Từ 0-100%" },
              ]}
            >
              <InputNumber<number>
                style={{ width: "100%" }}
                min={0}
                max={100}
                formatter={(value) => `${value}%`}
                parser={(value) =>
                  Number((value ?? "0").replace("%", "")) || 0
                }
                placeholder="VD: 20%"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={8}>
            <div className="book-quick-edit-form__switch-group">
              <Form.Item name="isFree" valuePropName="checked" label="Miễn phí">
                <Switch />
              </Form.Item>
              <Form.Item
                name="isOnSale"
                valuePropName="checked"
                label="Đang giảm giá"
              >
                <Switch />
              </Form.Item>
            </div>
          </Col>
        </Row>

        <div className="book-quick-edit-form__actions">
          <Space>
            <Button onClick={onReset} disabled={!book}>
              Đặt lại
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isSubmitting}
              disabled={!book}
            >
              Lưu thay đổi
            </Button>
          </Space>
        </div>
      </Form>
    </Card>
  );
}
