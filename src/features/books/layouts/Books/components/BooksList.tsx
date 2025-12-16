import { Table, Tag, Button, Alert } from "antd";
import { Eye } from "lucide-react";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import type { Book, PaginationMeta } from "@/features/books/types";
import "./BooksList.scss";

export interface BooksListProps {
  books: Book[];
  isLoading: boolean;
  errorMessage?: string | null;
  pagination?: PaginationMeta | null;
  page: number;
  pageSize: number;
  onPaginationChange: (page: number, pageSize: number) => void;
  onViewDetail: (slug: string) => void;
}

export default function BooksList({
  books,
  isLoading,
  errorMessage,
  pagination,
  page,
  pageSize,
  onPaginationChange,
  onViewDetail,
}: BooksListProps) {
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const columns: ColumnsType<Book> = [
    {
      title: "#",
      dataIndex: "id",
      key: "id",
      width: 60,
      align: "center",
      render: (_: string, __: Book, index: number) => index + 1,
    },
    {
      title: "Thông tin truyện",
      key: "bookInfo",
      width: 300,
      render: (_: unknown, record: Book) => (
        <div className="books-list__info-cell">
          <img
            src={record.thumbnail}
            alt={record.title}
            className="books-list__cover-image"
          />
          <div className="books-list__info-content">
            <h3
              className="books-list__title"
              onClick={() => onViewDetail(record.slug)}
            >
              {record.title}
            </h3>
            <div className="books-list__meta">
              <span className="books-list__id">ID: {record.id}</span>
              <span className="books-list__slug">{record.slug}</span>
              <span className="books-list__author">Tác giả: {record.author}</span>
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
          return <span className="books-list__category-empty">Chưa phân loại</span>;
        }
        return (
          <div className="books-list__categories">
            {categories.map((item) => (
              <Tag key={item.category.id} className="books-list__category-tag">
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
      render: (_: unknown, record: Book) => (
        <div className="books-list__pricing">
          <div className="books-list__price-item">
            <span className="books-list__price-label">Giá bán:</span>
            <span className="books-list__price-value books-list__sale-price">
              {record.isFree ? "Miễn phí" : formatCurrency(record.price)}
            </span>
          </div>
          {record.isOnSale && (
            <div className="books-list__price-item">
              <span className="books-list__price-label">Giảm giá:</span>
              <span className="books-list__price-value books-list__sale-percent">
                {record.salePercent}%
              </span>
            </div>
          )}
          <div className="books-list__price-item">
            <span className="books-list__price-label">Trạng thái:</span>
            <Tag className="books-list__status-tag">{record.status}</Tag>
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
      render: (_: unknown, record: Book) => (
        <Button
          type="link"
          icon={<Eye size={20} />}
          onClick={() => onViewDetail(record.slug)}
          className="books-list__action-button"
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  const tablePagination: TablePaginationConfig = {
    current: pagination?.page ?? page,
    pageSize: pagination?.limit ?? pageSize,
    total: pagination?.totalItems ?? books.length,
    showSizeChanger: true,
    showTotal: (total) => `Tổng ${total} truyện tranh`,
  };

  return (
    <div className="books-list">
      {errorMessage && (
        <Alert
          type="error"
          message="Không thể tải danh sách truyện"
          description={errorMessage}
          showIcon
          className="books-list__error-alert"
        />
      )}
      <Table
        columns={columns}
        dataSource={books}
        rowKey="id"
        loading={isLoading}
        pagination={tablePagination}
        onChange={(paginationConfig) => {
          onPaginationChange(
            paginationConfig.current ?? page,
            paginationConfig.pageSize ?? pageSize
          );
        }}
        className="books-list__table"
        scroll={{ x: 1200 }}
      />
    </div>
  );
}
