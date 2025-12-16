import { Typography, Button, Space } from "antd";
import { ArrowLeft, RefreshCcw } from "lucide-react";
import "./OrderDetailHeader.scss";

const { Title, Text } = Typography;

export interface OrderDetailHeaderProps {
  onBack: () => void;
  onRefetch: () => void;
}

export default function OrderDetailHeader({
  onBack,
  onRefetch,
}: OrderDetailHeaderProps) {
  return (
    <div className="order-detail-header">
      <div>
        <Space direction="vertical" size={4}>
          <Space>
            <Button
              icon={<ArrowLeft size={20} />}
              onClick={onBack}
              className="order-detail-header__back-button"
            >
              Quay lại
            </Button>
            <Title level={2} className="order-detail-header__title">
              Chi tiết Đơn hàng
            </Title>
          </Space>
          <Text className="order-detail-header__subtitle">
            Xem chi tiết thông tin đơn hàng và các sản phẩm đã mua
          </Text>
        </Space>
      </div>
      <Button
        icon={<RefreshCcw size={18} />}
        onClick={onRefetch}
        className="order-detail-header__action-button"
      >
        Tải lại
      </Button>
    </div>
  );
}
