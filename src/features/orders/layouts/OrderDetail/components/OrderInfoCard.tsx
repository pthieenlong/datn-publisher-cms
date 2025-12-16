import { Card, Descriptions, Typography, Tag } from "antd";
import type { OrderDetail } from "@/features/orders/types";
import "./OrderInfoCard.scss";

const { Text } = Typography;

export interface OrderInfoCardProps {
  order: OrderDetail;
  statusColor: string;
  statusText: string;
}

export default function OrderInfoCard({
  order,
  statusColor,
  statusText,
}: OrderInfoCardProps) {
  const formatDateTime = (dateString?: string | null): string => {
    if (!dateString) {
      return "-";
    }
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card title="Thông tin đơn hàng" className="order-info-card">
      <Descriptions column={1} bordered size="middle">
        <Descriptions.Item label="Mã đơn hàng">
          <Text strong>{order.orderCode}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Khách hàng">
          {order.user.email || "Khách hàng"}
        </Descriptions.Item>
        <Descriptions.Item label="User ID">{order.userId}</Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          <Tag color={statusColor}>{statusText}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Ngày tạo">
          {formatDateTime(order.createdAt)}
        </Descriptions.Item>
        <Descriptions.Item label="Cập nhật">
          {formatDateTime(order.updatedAt)}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
}
