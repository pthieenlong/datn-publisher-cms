import { Table, Avatar, Typography, Space } from "antd";
import dayjs from "dayjs";
import type { BookComment } from "@/features/books/types";
import type { ColumnsType } from "antd/es/table";
import "./CommentsTable.scss";

const { Text } = Typography;

export interface CommentsTableProps {
  comments: BookComment[];
  loading?: boolean;
}

export default function CommentsTable({
  comments,
  loading = false,
}: CommentsTableProps) {
  const columns: ColumnsType<BookComment> = [
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
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      render: (date) => (
        <Text type="secondary">{dayjs(date).format("DD/MM/YYYY HH:mm")}</Text>
      ),
    },
  ];

  return (
    <div className="comments-table">
      <Table
        dataSource={comments}
        columns={columns}
        loading={loading}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: false,
          showTotal: (total) => `Tổng ${total} bình luận`,
        }}
        locale={{
          emptyText: "Chưa có bình luận nào",
        }}
      />
    </div>
  );
}
