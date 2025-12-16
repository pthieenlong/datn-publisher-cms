import { Typography } from "antd";
import "./OrdersHeader.scss";

const { Title, Text } = Typography;

export default function OrdersHeader() {
  return (
    <div className="orders-header">
      <div className="orders-header__content">
        <Title level={2} className="orders-header__title">
          Danh sách Đơn hàng
        </Title>
        <Text className="orders-header__description">
          Quản lý và theo dõi tất cả đơn hàng trong hệ thống
        </Text>
      </div>
    </div>
  );
}
