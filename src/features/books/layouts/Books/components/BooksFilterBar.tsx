import { Row, Col, Input, Select, Button, Space } from "antd";
import { Search, Filter } from "lucide-react";
import type { Category } from "@/features/categories/types";
import type { BookSortOption } from "@/features/books/types";
import "./BooksFilterBar.scss";

const { Search: SearchInput } = Input;

export interface BooksFilterBarProps {
  keyword: string;
  sortOption?: BookSortOption;
  categoryFilter?: string;
  categories: Category[];
  isCategoryLoading: boolean;
  categoryError?: string | null;
  onKeywordChange: (value: string) => void;
  onSearch: (value: string) => void;
  onSortChange: (value?: BookSortOption) => void;
  onCategoryChange: (value?: string) => void;
  onRefetch: () => void;
}

const SORT_OPTIONS: { value: BookSortOption; label: string }[] = [
  { value: "latest", label: "Mới nhất" },
  { value: "top_rated", label: "Đánh giá cao" },
  { value: "most_viewed", label: "Xem nhiều" },
  { value: "price_asc", label: "Giá tăng dần" },
  { value: "price_desc", label: "Giá giảm dần" },
  { value: "free", label: "Miễn phí" },
];

export default function BooksFilterBar({
  keyword,
  sortOption,
  categoryFilter,
  categories,
  isCategoryLoading,
  categoryError,
  onKeywordChange,
  onSearch,
  onSortChange,
  onCategoryChange,
  onRefetch,
}: BooksFilterBarProps) {
  return (
    <div className="books-filter-bar">
      <Row gutter={[12, 12]}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <SearchInput
            placeholder="Tìm kiếm truyện tranh..."
            allowClear
            onSearch={onSearch}
            value={keyword}
            onChange={(event) => onKeywordChange(event.target.value)}
            prefix={<Search size={20} />}
            className="books-filter-bar__search-input"
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Select
            placeholder="Sắp xếp"
            allowClear
            className="books-filter-bar__select"
            style={{ width: "100%" }}
            value={sortOption}
            onChange={(value) => onSortChange(value as BookSortOption | undefined)}
          >
            {SORT_OPTIONS.map((option) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Select
            placeholder="Thể loại"
            allowClear
            className="books-filter-bar__select"
            style={{ width: "100%" }}
            value={categoryFilter}
            onChange={(value) => onCategoryChange(value as string | undefined)}
            loading={isCategoryLoading}
            notFoundContent={categoryError ? "Không thể tải thể loại" : undefined}
          >
            {categories.map((category) => (
              <Select.Option key={category.id} value={category.slug}>
                {category.title}
              </Select.Option>
            ))}
          </Select>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Space>
            <Button
              icon={<Filter size={20} />}
              className="books-filter-bar__button"
              onClick={onRefetch}
            >
              Lọc
            </Button>
          </Space>
        </Col>
      </Row>
    </div>
  );
}
