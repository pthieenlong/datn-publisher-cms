import { Table, Tag, Button } from "antd";
import { Eye } from "lucide-react";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { useNavigate } from "@tanstack/react-router";
import type { Book, PaginationMeta } from "../types";
import "./BookTable.scss";

interface BookTableProps {
  data: Book[];
  loading?: boolean;
  pagination?: PaginationMeta | null;
  page: number;
  pageSize: number;
  onPaginationChange: (page: number, pageSize: number) => void;
}

function BookTable({
  data,
  loading,
  pagination,
  page,
  pageSize,
  onPaginationChange,
}: BookTableProps) {
  const navigate = useNavigate();

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const handleViewDetail = (slug: string) => {
    navigate({ to: `/books/${slug}` });
  };

  const columns: ColumnsType<Book> = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      width: 60,
      align: "center",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Thông tin truyện",
      key: "bookInfo",
      width: 300,
      render: (_, record) => (
        <div className="book-info-cell">
          <img
            src={record.thumbnail}
            alt={record.title}
            className="book-cover-image"
          />
          <div className="book-info-content">
            <h3
              className="book-title"
              onClick={() => handleViewDetail(record.slug)}
            >
              {record.title}
            </h3>
            <div className="book-meta">
              <span className="book-id">ID: {record.id}</span>
              <span className="book-slug">{record.slug}</span>
              <span className="book-author">Tác giả: {record.author}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Danh mục",
      dataIndex: "bookCategories",
      key: "categories",
      width: 220,
      render: (categories: Book["bookCategories"]) => {
        if (!categories?.length) {
          return <span className="book-category-empty">Chưa phân loại</span>;
        }
        return (
          <div className="book-categories">
            {categories.map((item) => (
              <Tag key={item.category.id} className="book-category-tag">
                {item.category.title}
              </Tag>
            ))}
          </div>
        );
      },
    },
    {
      title: "Thông tin mua",
      key: "pricing",
      width: 220,
      render: (_, record) => (
        <div className="book-pricing">
          <div className="book-price-item">
            <span className="book-price-label">Giá bán:</span>
            <span className="book-price-value book-sale-price">
              {record.isFree ? "Miễn phí" : formatCurrency(record.price)}
            </span>
          </div>
          {record.isOnSale && (
            <div className="book-price-item">
              <span className="book-price-label">Giảm giá:</span>
              <span className="book-price-value book-sale-percent">
                {record.salePercent}%
              </span>
            </div>
          )}
          <div className="book-price-item">
            <span className="book-price-label">Trạng thái:</span>
            <Tag className="book-status-tag">{record.status}</Tag>
          </div>
        </div>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 120,
      align: "center",
      fixed: "right",
      render: (_, record) => (
        <Button
          type="link"
          icon={<Eye size={20} />}
          onClick={() => handleViewDetail(record.slug)}
          className="book-action-button"
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  const tablePagination: TablePaginationConfig = {
    current: pagination?.page ?? page,
    pageSize: pagination?.limit ?? pageSize,
    total: pagination?.totalItems ?? data.length,
    showSizeChanger: true,
    showTotal: (total) => `Tổng ${total} truyện tranh`,
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
      className="book-table"
      scroll={{ x: 1200 }}
    />
  );
}

export default BookTable;
