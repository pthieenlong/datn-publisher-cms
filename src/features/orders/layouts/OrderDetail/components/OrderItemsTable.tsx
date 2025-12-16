import { Card, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { OrderDetailItem } from "@/features/orders/types";
import "./OrderItemsTable.scss";

const { Text } = Typography;

export interface OrderItemsTableProps {
  items: OrderDetailItem[];
}

export default function OrderItemsTable({ items }: OrderItemsTableProps) {
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
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
    {
      title: "Giá cuối cùng",
      dataIndex: "finalPrice",
      key: "finalPrice",
      align: "right",
      render: (value: number) => (
        <Text strong style={{ color: "#1890ff" }}>
          {formatCurrency(value)}
        </Text>
      ),
    },
  ];

  return (
    <Card title="Danh sách sản phẩm" className="order-items-table">
      <Table<OrderDetailItem>
        columns={columns}
        dataSource={items}
        rowKey="id"
        pagination={false}
      />
    </Card>
  );
}
