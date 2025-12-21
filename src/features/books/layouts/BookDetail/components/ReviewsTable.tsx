import { Table, Avatar, Rate, Typography, Space } from "antd";
import dayjs from "dayjs";
import type { BookRating } from "@/features/books/types";
import type { ColumnsType } from "antd/es/table";
import "./ReviewsTable.scss";

const { Text } = Typography;

export interface ReviewsTableProps {
  ratings: BookRating[];
  loading?: boolean;
}

export default function ReviewsTable({
  ratings,
  loading = false,
}: ReviewsTableProps) {
  const columns: ColumnsType<BookRating> = [
    {
      title: "Người dùng",
      dataIndex: "user",
      key: "user",
      width: 200,
      render: (user) => (
        <Space>
          <Avatar src={user.avatar} size={40}>
            {user.username.charAt(0).toUpperCase()}
          </Avatar>
          <Text strong>{user.username}</Text>
        </Space>
      ),
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      key: "content",
      ellipsis: true,
    },
    {
      title: "Đánh giá",
      dataIndex: "ratePoint",
      key: "ratePoint",
      width: 150,
      align: "center",
      render: (ratePoint) => (
        <Rate disabled value={ratePoint} style={{ fontSize: 16 }} />
      ),
    },
    {
      title: "Thời gian",
      key: "dates",
      width: 180,
      render: (_, record) => (
        <div className="reviews-table__dates">
          <Text type="secondary" className="reviews-table__date-created">
            {dayjs(record.createdAt).format("DD/MM/YYYY HH:mm")}
          </Text>
          <Text type="secondary" className="reviews-table__date-updated">
            {dayjs(record.updatedAt).format("DD/MM/YYYY HH:mm")}
          </Text>
        </div>
      ),
    },
  ];

  return (
    <div className="reviews-table">
      <Table
        dataSource={ratings}
        columns={columns}
        loading={loading}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: false,
          showTotal: (total) => `Tổng ${total} đánh giá`,
        }}
        locale={{
          emptyText: "Chưa có đánh giá nào",
        }}
      />
    </div>
  );
}
