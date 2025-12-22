import { Table, Avatar, Typography, Space, Tag } from "antd";
import dayjs from "dayjs";
import type { PurchasedUser } from "@/features/books/types";
import type { ColumnsType } from "antd/es/table";
import "./PurchasedUsersTable.scss";

const { Text } = Typography;

export interface PurchasedUsersTableProps {
  purchasedUsers: PurchasedUser[];
  loading?: boolean;
}

export default function PurchasedUsersTable({
  purchasedUsers,
  loading = false,
}: PurchasedUsersTableProps) {
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const columns: ColumnsType<PurchasedUser> = [
    {
      title: "Người dùng",
      dataIndex: "user",
      key: "user",
      width: 250,
      render: (_, record) => (
        <Space>
          <Avatar src={record.avatar} size={40}>
            {record.username.charAt(0).toUpperCase()}
          </Avatar>
          <div>
            <Text strong>{record.username}</Text>
            <br />
            <Text type="secondary" className="purchased-users-table__email">
              {record.email}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Mã đơn hàng",
      dataIndex: "orderCode",
      key: "orderCode",
      width: 150,
      render: (orderCode) => (
        <Tag color="blue" className="purchased-users-table__order-code">
          {orderCode}
        </Tag>
      ),
    },
    {
      title: "Số tiền",
      dataIndex: "pricePaid",
      key: "pricePaid",
      width: 150,
      align: "right",
      render: (pricePaid) => (
        <Text strong className="purchased-users-table__price">
          {formatCurrency(pricePaid)}
        </Text>
      ),
    },
    {
      title: "Ngày mua",
      dataIndex: "purchasedAt",
      key: "purchasedAt",
      width: 180,
      render: (purchasedAt) => (
        <Text type="secondary">
          {dayjs(purchasedAt).format("DD/MM/YYYY HH:mm")}
        </Text>
      ),
    },
  ];

  return (
    <div className="purchased-users-table">
      <Table
        dataSource={purchasedUsers}
        columns={columns}
        loading={loading}
        rowKey="id"
        pagination={{
          pageSize: 5,
          showSizeChanger: false,
          showTotal: (total) => `Tổng ${total} người mua`,
        }}
        locale={{
          emptyText: "Chưa có người mua nào",
        }}
      />
    </div>
  );
}
