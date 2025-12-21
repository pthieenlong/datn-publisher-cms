import {
  Form,
  Input,
  InputNumber,
  Switch,
  Button,
  Space,
  Card,
  Row,
  Col,
} from "antd";
import {
  Save,
  X,
} from "lucide-react";
import "./ChapterEditForm.scss";

export interface ChapterEditFormValues {
  title: string;
  isFree: boolean;
  price: number;
  isOnSale: boolean;
  salePercent: number;
}

export interface ChapterEditFormProps {
  initialValues: ChapterEditFormValues;
  isLoading: boolean;
  onSubmit: (values: ChapterEditFormValues) => void;
  onCancel: () => void;
}

export default function ChapterEditForm({
  initialValues,
  isLoading,
  onSubmit,
  onCancel,
}: ChapterEditFormProps) {
  const [form] = Form.useForm<ChapterEditFormValues>();

  const isFree = Form.useWatch("isFree", form);
  const isOnSale = Form.useWatch("isOnSale", form);

  return (
    <Card className="chapter-edit-form" title="Cài đặt chương">
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onFinish={onSubmit}
      >
        {/* Title Field */}
        <Form.Item
          label="Tiêu đề chương"
          name="title"
          rules={[
            { required: true, message: "Vui lòng nhập tiêu đề chương" },
            { min: 3, message: "Tiêu đề phải có ít nhất 3 ký tự" },
          ]}
        >
          <Input
            placeholder="Nhập tiêu đề chương (VD: Chapter 1: Khởi đầu)"
            size="large"
          />
        </Form.Item>

        {/* Pricing Section */}
        <Card
          type="inner"
          title="Cài đặt giá"
          className="chapter-edit-form__pricing-section"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Miễn phí"
                name="isFree"
                valuePropName="checked"
                tooltip="Bật nếu chương này miễn phí cho người đọc"
              >
                <Switch
                  checkedChildren="Miễn phí"
                  unCheckedChildren="Trả phí"
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Giá chương (VND)"
                name="price"
                rules={[
                  { required: true, message: "Vui lòng nhập giá" },
                  {
                    type: "number",
                    min: 0,
                    message: "Giá phải lớn hơn hoặc bằng 0",
                  },
                ]}
              >
                <InputNumber<number>
                  placeholder="Nhập giá chương..."
                  disabled={isFree}
                  formatter={(value) =>
                    `${value ?? ""}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) =>
                    Number((value ?? "0").replace(/\$\s?|(,*)/g, "")) || 0
                  }
                  style={{ width: "100%" }}
                  min={0}
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Giảm giá"
                name="isOnSale"
                valuePropName="checked"
                tooltip="Bật nếu muốn giảm giá cho chương này"
              >
                <Switch
                  checkedChildren="Có giảm giá"
                  unCheckedChildren="Không giảm giá"
                  disabled={isFree}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Phần trăm giảm giá (%)"
                name="salePercent"
                rules={[
                  {
                    type: "number",
                    min: 0,
                    max: 100,
                    message: "Phần trăm phải từ 0 đến 100",
                  },
                ]}
              >
                <InputNumber<number>
                  placeholder="Nhập % giảm giá..."
                  disabled={isFree || !isOnSale}
                  style={{ width: "100%" }}
                  min={0}
                  max={100}
                  size="large"
                  formatter={(value) => `${value ?? 0}%`}
                  parser={(value) =>
                    Number((value ?? "0").replace("%", "")) || 0
                  }
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* Action Buttons */}
        <div className="chapter-edit-form__actions">
          <Space>
            <Button
              icon={<X size={20} />}
              onClick={onCancel}
              disabled={isLoading}
              size="large"
            >
              Hủy
            </Button>
            <Button
              type="primary"
              icon={<Save size={20} />}
              htmlType="submit"
              loading={isLoading}
              size="large"
            >
              Lưu thay đổi
            </Button>
          </Space>
        </div>
      </Form>
    </Card>
  );
}
