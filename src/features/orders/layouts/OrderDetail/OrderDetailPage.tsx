import { Alert, Card, Spin, Typography } from "antd";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useDocumentTitle } from "@/hooks";
import { useOrderDetail } from "../../hooks/useOrderDetail";
import {
  OrderDetailHeader,
  OrderInfoCard,
  OrderPaymentCard,
  OrderItemsTable,
} from "./components";
import "./OrderDetailPage.scss";

const { Title, Text } = Typography;

export default function OrderDetailPage() {
  const { orderId } = useParams({ from: "/orders/$orderId" });
  const navigate = useNavigate();

  const { order, isLoading, errorMessage, refetch } = useOrderDetail({
    orderId,
  });

  useDocumentTitle(
    order
      ? `Đơn hàng ${order.orderCode} - Chi tiết Đơn hàng - CMS`
      : "Chi tiết Đơn hàng - CMS"
  );

  const handleBack = () => {
    navigate({ to: "/orders" });
  };

  const getStatusTag = (status?: string) => {
    switch (status) {
      case "PAID":
        return { color: "success", text: "Đã thanh toán" };
      case "PENDING":
        return { color: "warning", text: "Đang chờ thanh toán" };
      case "CANCELLED":
        return { color: "default", text: "Đã hủy" };
      case "REFUNDED":
        return { color: "processing", text: "Đã hoàn tiền" };
      case "ERROR":
        return { color: "error", text: "Lỗi thanh toán" };
      default:
        return { color: "default", text: status ?? "Không xác định" };
    }
  };

  const statusInfo = getStatusTag(order?.status);

  return (
    <div className="order-detail-page">
      <OrderDetailHeader onBack={handleBack} onRefetch={refetch} />

      {errorMessage && (
        <Alert
          type="error"
          message="Không thể tải chi tiết đơn hàng"
          description={errorMessage}
          showIcon
          closable
          className="order-detail-page__error"
        />
      )}

      {isLoading && !order ? (
        <div className="order-detail-page__loading">
          <Spin tip="Đang tải chi tiết đơn hàng..." />
        </div>
      ) : order ? (
        <>
          <div className="order-detail-page__layout">
            <OrderInfoCard
              order={order}
              statusColor={statusInfo.color}
              statusText={statusInfo.text}
            />
            <OrderPaymentCard order={order} />
          </div>

          <OrderItemsTable items={order.orderItems} />
        </>
      ) : (
        <Card className="order-detail-page__empty">
          <Title level={4}>Không tìm thấy đơn hàng</Title>
          <Text>Vui lòng kiểm tra lại đường dẫn hoặc thử tải lại trang.</Text>
        </Card>
      )}
    </div>
  );
}
