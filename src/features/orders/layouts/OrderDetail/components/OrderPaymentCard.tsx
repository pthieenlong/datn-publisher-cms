import { Card, Descriptions, Typography } from "antd";
import type { OrderDetail, PayingMethod } from "@/features/orders/types";
import "./OrderPaymentCard.scss";

const { Text } = Typography;

export interface OrderPaymentCardProps {
  order: OrderDetail;
}

export default function OrderPaymentCard({ order }: OrderPaymentCardProps) {
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

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

  const getPayingMethodText = (method: PayingMethod): string => {
    switch (method) {
      case "BANKING":
        return "Chuyển khoản";
      case "VNPAY":
        return "VNPay";
      case "MOMO":
        return "MoMo";
      default:
        return method;
    }
  };

  const totalAmount = order.orderItems.reduce(
    (sum, item) => sum + item.finalPrice,
    0
  );

  return (
    <Card title="Thông tin thanh toán" className="order-payment-card">
      <Descriptions column={1} bordered size="middle">
        <Descriptions.Item label="Tổng số tiền">
          <Text strong>{formatCurrency(totalAmount)}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Thực nhận">
          <Text strong style={{ color: "#52c41a" }}>
            {formatCurrency(totalAmount * 0.6)}
          </Text>
        </Descriptions.Item>
        <Descriptions.Item label="Hình thức thanh toán">
          {getPayingMethodText(order.payingMethod)}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày thanh toán">
          {formatDateTime(order.paidAt)}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
}
