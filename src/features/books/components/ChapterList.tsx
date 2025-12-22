import { Table, Button, Space, Tag, Modal, message } from "antd";
import { Eye, Edit, Trash2 } from "lucide-react";
import type { ColumnsType } from "antd/es/table";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import "./ChapterList.scss";
import type { BookChapter } from "../types";
import { useDeleteChapter } from "../hooks/useDeleteChapter";
interface ChapterListProps {
  chapters: BookChapter[];
  bookSlug: string;
  isLoading?: boolean;
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onRefresh?: () => void;
}

function ChapterList({
  chapters,
  bookSlug,
  isLoading,
  page,
  pageSize,
  total,
  onPageChange,
  onRefresh,
}: ChapterListProps) {
  const navigate = useNavigate();
  const {
    deleteExistingChapter,
    isDeleting,
    errorMessage,
    successMessage,
    reset,
  } = useDeleteChapter();

  // Handle success/error messages
  useEffect(() => {
    if (successMessage) {
      message.success(successMessage);
      reset();
      onRefresh?.();
    }
    if (errorMessage) {
      message.error(errorMessage);
      reset();
    }
  }, [successMessage, errorMessage, reset, onRefresh]);
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

  const handleDelete = (chapterSlug: string, chapterTitle: string) => {
    Modal.confirm({
      title: "Xác nhận xóa chương",
      content: `Bạn có chắc chắn muốn xóa chương "${chapterTitle}"? Hành động này không thể hoàn tác.`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        await deleteExistingChapter(bookSlug, chapterSlug);
      },
    });
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
      render: (title: string) => <span className="chapter-title">{title}</span>,
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
            disabled={isDeleting}
          ></Button>
          <Button
            type="link"
            icon={<Edit size={18} />}
            onClick={() => handleEdit(record.slug)}
            className="chapter-action-button"
            disabled={isDeleting}
          ></Button>
          <Button
            type="link"
            danger
            icon={<Trash2 size={18} />}
            onClick={() => handleDelete(record.slug, record.title)}
            className="chapter-action-button"
            loading={isDeleting}
            disabled={isDeleting}
          ></Button>
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
