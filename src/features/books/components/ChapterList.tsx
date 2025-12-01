import { Table, Button, Space, Tag } from "antd";
import { Eye, Edit, Trash2 } from "lucide-react";
import type { ColumnsType } from "antd/es/table";
import { useNavigate } from "@tanstack/react-router";
import "./ChapterList.scss";
import type { BookChapter } from "../types";

interface ChapterListProps {
  chapters: BookChapter[];
  bookSlug: string;
  isLoading?: boolean;
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

function ChapterList({
  chapters,
  bookSlug,
  isLoading,
  page,
  pageSize,
  total,
  onPageChange,
}: ChapterListProps) {
  const navigate = useNavigate();

  const formatDate = (dateString?: string | null): string => {
    if (!dateString) {
      return "-";
    }
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  };

  const getStatusTag = (status: string) => {
    const normalized = status.toLowerCase();
    return normalized === "published"
      ? { color: "success", text: "Đã xuất bản" }
      : { color: "default", text: "Nháp" };
  };

  const handleView = (chapterSlug: string) => {
    navigate({
      to: "/books/$bookSlug/chapters/$chapterSlug",
      params: { bookSlug, chapterSlug },
    });
  };

  const handleEdit = (chapterSlug: string) => {
    navigate({
      to: "/books/$bookSlug/chapters/$chapterSlug/edit",
      params: { bookSlug, chapterSlug },
    });
  };

  const handleDelete = (chapterId: string) => {
    console.log("Delete chapter:", chapterId);
  };

  const columns: ColumnsType<BookChapter> = [
    {
      title: "#",
      dataIndex: "chapterNumber",
      key: "chapterNumber",
      width: 60,
      align: "center",
      render: (number: number) => (
        <span className="chapter-number">{number}</span>
      ),
    },
    {
      title: "Tên chương",
      dataIndex: "title",
      key: "title",
      render: (title: string) => (
        <span className="chapter-title">{title}</span>
      ),
    },
    {
      title: "Ngày phát hành",
      dataIndex: "publishedAt",
      key: "publishedAt",
      width: 120,
      render: (date: string) => (
        <span className="chapter-date">{formatDate(date)}</span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      align: "center",
      render: (status: string) => {
        const statusInfo = getStatusTag(status);
        return (
          <Tag color={statusInfo.color} className="chapter-status-tag">
            {statusInfo.text}
          </Tag>
        );
      },
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 180,
      align: "center",
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<Eye size={18} />}
            onClick={() => handleView(record.slug)}
            className="chapter-action-button"
          >
            Xem
          </Button>
          <Button
            type="link"
            icon={<Edit size={18} />}
            onClick={() => handleEdit(record.slug)}
            className="chapter-action-button"
          >
            Sửa
          </Button>
          <Button
            type="link"
            danger
            icon={<Trash2 size={18} />}
            onClick={() => handleDelete(record.id)}
            className="chapter-action-button"
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="chapter-list">
      <Table
        columns={columns}
        dataSource={chapters}
        rowKey="id"
        loading={isLoading}
        pagination={{
          current: page,
          pageSize,
          total,
          showSizeChanger: false,
          showTotal: (count) => `Tổng ${count} chương`,
          onChange: (nextPage) => onPageChange(nextPage),
        }}
        className="chapter-table"
        size="small"
      />
    </div>
  );
}

export default ChapterList;

