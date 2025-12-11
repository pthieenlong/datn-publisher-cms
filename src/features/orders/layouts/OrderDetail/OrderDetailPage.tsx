import {
  Alert,
  Button,
  Card,
  Descriptions,
  Space,
  Spin,
  Table,
  Tag,
  Typography,
} from "antd";
import { ArrowLeft, RefreshCcw } from "lucide-react";
import { useNavigate, useParams } from "@tanstack/react-router";
import type { ColumnsType } from "antd/es/table";
import "./OrderDetailPage.scss";
import { useDocumentTitle } from "@/hooks";
import type { OrderDetailItem, PayingMethod } from "../../types";
import { useOrderDetail } from "../../hooks/useOrderDetail";

const { Title, Text } = Typography;

function OrderDetailPage() {
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

  const getStatusTag = (status?: string) => {
    switch (status) {
      case "PAID":
        return { color: "success", text: "Đã thanh toán" };
      case "PENDING":
        return { color: "warning", text: "Đang chờ thanh toán" };
      case "CANCELLED":
        return { color: "default", text: "Đã hủy" };
      case "FAILED":
        return { color: "error", text: "Thanh toán thất bại" };
      default:
        return { color: "default", text: status ?? "Không xác định" };
    }
  };

  const getPayingMethodText = (method: PayingMethod): string => {
    switch (method) {
      case "BANKING":
        return "Chuyển khoản";
      case "VNPAY":
        return "VNPay";
      case "MOMO":
        return "MoMo";
      case "CASH":
        return "Tiền mặt";
      default:
        return method;
    }
  };

  const columns: ColumnsType<OrderDetailItem> = [
    {
      title: "#",
      dataIndex: "id",
      key: "index",
      width: 60,
      align: "center",
      render: (_: string, __: OrderDetailItem, index: number) => index + 1,
    },
    {
      title: "Sản phẩm",
      dataIndex: ["book", "title"],
      key: "bookTitle",
      render: (_: unknown, record: OrderDetailItem) => record.book.title,
    },
    {
      title: "Giá gốc",
      dataIndex: "defaultPrice",
      key: "defaultPrice",
      align: "right",
      render: (value: number) => formatCurrency(value),
    },
    {
      title: "Giá giảm",
      dataIndex: "discountPrice",
      key: "discountPrice",
      align: "right",
      render: (value: number) => formatCurrency(value),
    },
  ];

  const statusInfo = getStatusTag(order?.status);

  return (
    <div className="order-detail-page">
      <div className="order-detail-header">
        <div>
          <Space direction="vertical" size={4}>
            <Space>
              <Button
                icon={<ArrowLeft size={20} />}
                onClick={handleBack}
                className="order-detail-back-button"
              >
                Quay lại
              </Button>
              <Title level={2} className="order-detail-title">
                Chi tiết Đơn hàng
              </Title>
            </Space>
            <Text className="order-detail-subtitle">
              Xem chi tiết thông tin đơn hàng và các sản phẩm đã mua
            </Text>
          </Space>
        </div>
        <Button
          icon={<RefreshCcw size={18} />}
          onClick={refetch}
          className="order-detail-action-button"
        >
          Tải lại
        </Button>
      </div>

      {errorMessage && (
        <Alert
          type="error"
          message="Không thể tải chi tiết đơn hàng"
          description={errorMessage}
          showIcon
          closable
          className="order-detail-error"
        />
      )}

      {isLoading && !order ? (
        <div className="order-detail-loading">
          <Spin tip="Đang tải chi tiết đơn hàng..." />
        </div>
      ) : order ? (
        <>
          <div className="order-detail-layout">
            <Card
              title="Thông tin đơn hàng"
              className="order-detail-summary-card"
            >
              <Descriptions column={1} bordered size="middle">
                <Descriptions.Item label="Mã đơn hàng">
                  <Text strong>
                    {order.orderCode}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label="Khách hàng">
                  {order.user.email || "Khách hàng"}
                </Descriptions.Item>
                <Descriptions.Item label="User ID">
                  {order.userId}
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                  <Tag color={statusInfo.color}>{statusInfo.text}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Ngày tạo">
                  {formatDateTime(order.createdAt)}
                </Descriptions.Item>
                <Descriptions.Item label="Cập nhật">
                  {formatDateTime(order.updatedAt)}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Card
              title="Thông tin thanh toán"
              className="order-detail-payment-card"
            >
              <Descriptions column={1} bordered size="middle">
                <Descriptions.Item label="Tổng số tiền">
                  <Text strong>{formatCurrency(order.totalAmount)}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Hình thức thanh toán">
                  {getPayingMethodText(order.payingMethod)}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </div>

          <Card
            title="Danh sách sản phẩm"
            className="order-detail-items-card"
          >
            <Table<OrderDetailItem>
              columns={columns}
              dataSource={order.orderItems}
              rowKey="id"
              pagination={false}
            />
          </Card>
        </>
      ) : (
        <Card className="order-detail-empty">
          <Title level={4}>Không tìm thấy đơn hàng</Title>
          <Text>Vui lòng kiểm tra lại đường dẫn hoặc thử tải lại trang.</Text>
        </Card>
      )}
    </div>
  );
}

export default OrderDetailPage;


