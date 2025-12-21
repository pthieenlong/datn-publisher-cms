import { Card, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { Order, OrderStatus } from "../../orders/types";
import "./RecentActivity.scss";

interface RecentActivityProps {
  orders: Order[];
}

interface IOrderTable {
  id: string;
  bookName: string;
  customerName: string;
  amount: number;
  status: OrderStatus;
  date: string;
}

function RecentActivity({ orders }: RecentActivityProps) {
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: OrderStatus): string => {
    switch (status) {
      case "PAID":
        return "#22c55e";
      case "PENDING":
        return "#faad14";
      case "CANCELLED":
        return "#ef4444";
      case "ERROR":
        return "#ef4444";
      case "REFUNDED":
        return "#3b82f6";
      default:
        return "#6b7280";
    }
  };

  const getStatusText = (status: OrderStatus): string => {
    switch (status) {
      case "PAID":
        return "Đã thanh toán";
      case "PENDING":
        return "Đang xử lý";
      case "CANCELLED":
        return "Đã hủy";
      case "ERROR":
        return "Lỗi thanh toán";
      case "REFUNDED":
        return "Đã hoàn tiền";
      default:
        return status;
    }
  };

  const tableData: IOrderTable[] = orders.map((order) => ({
    id: order.orderCode || order.id,
    bookName:
      order.orderItems.length > 0
        ? order.orderItems.length === 1
          ? order.orderItems[0].bookTitle
          : `${order.orderItems[0].bookTitle} và ${
              order.orderItems.length - 1
            } sách khác`
        : "Không có sách",
    customerName: order.userName || "Khách hàng",
    amount: order.totalAmount,
    status: order.status,
    date: formatDate(order.createdAt),
  }));

  const columns: ColumnsType<IOrderTable> = [
    {
      title: "Mã đơn hàng",
      dataIndex: "id",
      key: "id",
      width: 180,
      render: (id: string) => (
        <span style={{ fontFamily: "monospace", fontSize: "12px" }}>{id}</span>
      ),
    },
    {
      title: "Sách",
      dataIndex: "bookName",
      key: "bookName",
    },
    {
      title: "Khách hàng",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Số tiền",
      dataIndex: "amount",
      key: "amount",
      render: (value: number) => formatCurrency(value),
      width: 150,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: OrderStatus) => {
        return (
          <span style={{ color: getStatusColor(status) }}>
            {getStatusText(status)}
          </span>
        );
      },
      width: 120,
    },
    {
      title: "Ngày tạo",
      dataIndex: "date",
      key: "date",
      width: 160,
    },
  ];

  return (
    <Card className="recent-activity-card" bordered>
      <h3 className="recent-activity-title">Đơn hàng gần đây</h3>
      <Table
        columns={columns}
        dataSource={tableData}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        className="recent-activity-table"
      />
    </Card>
  );
}

export default RecentActivity;
