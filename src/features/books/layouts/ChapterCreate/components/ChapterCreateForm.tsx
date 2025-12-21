import {
  Form,
  InputNumber,
  Switch,
  Upload,
  Button,
  Space,
  Card,
  message,
  Row,
  Col,
} from "antd";
import { Upload as UploadIcon, Save, X } from "lucide-react";
import type { UploadFile, UploadChangeParam } from "antd/es/upload/interface";
import "./ChapterCreateForm.scss";

export interface ChapterCreateFormValues {
  title: string;
  isFree: boolean;
  price: number;
  isOnSale: boolean;
  salePercent: number;
}

export interface ChapterCreateFormProps {
  fileList: UploadFile[];
  isLoading: boolean;
  onFileChange: (info: UploadChangeParam<UploadFile>) => void;
  onSubmit: (values: ChapterCreateFormValues) => void;
  onCancel: () => void;
}

export default function ChapterCreateForm({
  fileList,
  isLoading,
  onFileChange,
  onSubmit,
  onCancel,
}: ChapterCreateFormProps) {
  const [form] = Form.useForm<ChapterCreateFormValues>();

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

  // Watch isFree to disable/enable price fields
  const isFree = Form.useWatch("isFree", form);

  return (
    <Card className="chapter-create-form">
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        initialValues={{
          isFree: true,
          price: 0,
          isOnSale: false,
          salePercent: 0,
        }}
      >
        {/* Pricing Section */}
        <Card
          type="inner"
          title="Cài đặt giá"
          className="chapter-create-form__pricing-section"
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
                  disabled={isFree || !form.getFieldValue("isOnSale")}
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

        {/* Galleries Upload */}
        <Form.Item
          label="Hình ảnh trang truyện"
          name="galleries"
          rules={[
            {
              required: true,
              validator: () => {
                if (fileList.length === 0) {
                  return Promise.reject(
                    new Error("Vui lòng upload ít nhất 1 trang truyện")
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
          extra="Hỗ trợ: JPG, PNG, WebP. Tối đa 10MB/ảnh. Kéo thả để sắp xếp thứ tự."
        >
          <Upload
            listType="picture-card"
            fileList={fileList}
            onChange={onFileChange}
            beforeUpload={beforeUpload}
            multiple
            className="chapter-create-form__upload"
          >
            {fileList.length < 100 && (
              <div>
                <UploadIcon size={24} />
                <div style={{ marginTop: 8 }}>Upload ảnh</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        {/* Summary */}
        {fileList.length > 0 && (
          <Card
            type="inner"
            className="chapter-create-form__summary"
            size="small"
          >
            <div className="chapter-create-form__summary-text">
              <strong>Tổng số trang:</strong> {fileList.length} trang
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="chapter-create-form__actions">
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
              Tạo chương mới
            </Button>
          </Space>
        </div>
      </Form>
    </Card>
  );
}
