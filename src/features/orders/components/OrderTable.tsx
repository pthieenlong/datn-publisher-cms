import { Table, Tag, Button } from "antd";
import { Eye } from "lucide-react";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import type { Order, PaginationMeta } from "../types";
import "./OrderTable.scss";

interface OrderTableProps {
  data: Order[];
  loading?: boolean;
  pagination?: PaginationMeta | null;
  page: number;
  pageSize: number;
  onPaginationChange: (page: number, pageSize: number) => void;
  onViewDetail: (id: string) => void;
}

function OrderTable({
  data,
  loading,
  pagination,
  page,
  pageSize,
  onPaginationChange,
  onViewDetail,
}: OrderTableProps) {
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

  const getStatusColor = (status: Order["status"]): string => {
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

  const getStatusText = (status: Order["status"]): string => {
    switch (status) {
      case "PAID":
        return "Đã thanh toán";
      case "PENDING":
        return "Đang chờ";
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

  const columns: ColumnsType<Order> = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      width: 60,
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Mã đơn hàng",
      dataIndex: "id",
      key: "id",
      width: 200,
      render: (id: string) => (
        <span className="order-code">{id.slice(0, 8).toUpperCase()}</span>
      ),
    },
    {
      title: "Thông tin đơn hàng",
      key: "orderInfo",
      width: 240,
      render: (_, record) => (
        <div className="order-info-cell">
          <div className="order-info-content">
            <h4 className="order-customer-name">
              {record.userName || "Khách hàng"}
            </h4>
          </div>
        </div>
      ),
    },
    {
      title: "Số tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      width: 150,
      align: "right",
      render: (value: number) => (
        <span className="order-amount">{formatCurrency(value)}</span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      align: "center",
      render: (status: Order["status"]) => (
        <Tag
          className="order-status-tag"
          style={{ color: getStatusColor(status) }}
        >
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: "Ngày thanh toán",
      dataIndex: "paidAt",
      key: "paidAt",
      width: 160,
      render: (date: string | null) => (
        <span className="order-date">{date ? formatDate(date) : "-"}</span>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 160,
      render: (date: string) => (
        <span className="order-date">{formatDate(date)}</span>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 160,
      align: "center",
      fixed: "right",
      render: (_, record) => (
        <Button
          type="link"
          icon={<Eye size={20} />}
          onClick={() => onViewDetail(record.id)}
          className="order-action-button"
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  const tablePagination: TablePaginationConfig = {
    current: pagination?.page ?? page,
    pageSize: pagination?.limit ?? pageSize,
    total: pagination?.total ?? data.length,
    showSizeChanger: true,
    showTotal: (total) => `Tổng ${total} đơn hàng`,
  };

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      loading={loading}
      pagination={tablePagination}
      onChange={(paginationConfig) => {
        onPaginationChange(
          paginationConfig.current ?? page,
          paginationConfig.pageSize ?? pageSize
        );
      }}
      className="order-table"
      scroll={{ x: 1200 }}
    />
  );
}

export default OrderTable;
