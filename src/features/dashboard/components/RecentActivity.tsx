import { Card, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import "./RecentActivity.scss";

interface IOrder {
  id: string;
  bookName: string;
  customerName: string;
  amount: number;
  status: "completed" | "pending" | "cancelled";
  date: string;
}

// Mock data - sẽ thay thế bằng API call sau
const mockOrders: IOrder[] = Array.from({ length: 10 }, (_, i) => ({
  id: `ORD-${String(i + 1).padStart(4, "0")}`,
  bookName: `Book ${i + 1}`,
  customerName: `Customer ${i + 1}`,
  amount: Math.floor(Math.random() * 500000) + 100000,
  status: ["completed", "pending", "cancelled"][
    Math.floor(Math.random() * 3)
  ] as IOrder["status"],
  date: new Date(Date.now() - i * 86400000).toLocaleDateString("vi-VN"),
}));

function RecentActivity() {
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const getStatusColor = (status: IOrder["status"]): string => {
    switch (status) {
      case "completed":
        return "#22c55e";
      case "pending":
        return "#faad14";
      case "cancelled":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const columns: ColumnsType<IOrder> = [
    {
      title: "Mã đơn hàng",
      dataIndex: "id",
      key: "id",
      width: 120,
    },
    {
      title: "Tên sách",
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
      render: (status: IOrder["status"]) => {
        const statusText = {
          completed: "Hoàn thành",
          pending: "Đang xử lý",
          cancelled: "Đã hủy",
        };
        return (
          <span style={{ color: getStatusColor(status) }}>
            {statusText[status]}
          </span>
        );
      },
      width: 120,
    },
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
      width: 120,
    },
  ];

  return (
    <Card className="recent-activity-card" bordered>
      <h3 className="recent-activity-title">Đơn hàng gần đây</h3>
      <Table
        columns={columns}
        dataSource={mockOrders}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        className="recent-activity-table"
      />
    </Card>
  );
}

export default RecentActivity;
