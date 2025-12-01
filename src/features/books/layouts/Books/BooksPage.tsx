import { useMemo, useState } from "react";
import {
  Row,
  Col,
  Typography,
  Input,
  Button,
  Select,
  Space,
  Alert,
} from "antd";
import { Search, Plus, Filter } from "lucide-react";
import BookTable from "../../components/BookTable";
import "./BooksPage.scss";
import { useDebounce, useDocumentTitle } from "@/hooks";
import { useBooks } from "../../hooks/useBooks";
import type { BookSortOption } from "../../types";
import { useCategories } from "../../../categories";

const { Title, Text } = Typography;
const { Search: SearchInput } = Input;

const SORT_OPTIONS: { value: BookSortOption; label: string }[] = [
  { value: "latest", label: "Mới nhất" },
  { value: "top_rated", label: "Đánh giá cao" },
  { value: "most_viewed", label: "Xem nhiều" },
  { value: "price_asc", label: "Giá tăng dần" },
  { value: "price_desc", label: "Giá giảm dần" },
  { value: "free", label: "Miễn phí" },
];

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;

function BooksPage() {
  useDocumentTitle("Danh sách Truyện tranh - CMS");
  const [keyword, setKeyword] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>();
  const [sortOption, setSortOption] = useState<BookSortOption | undefined>();
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const debouncedKeyword = useDebounce(keyword, 500);

  const filters = useMemo(
    () => ({
      page,
      pageSize,
      keyword: debouncedKeyword.trim() || undefined,
      category: categoryFilter,
      sort: sortOption,
    }),
    [page, pageSize, debouncedKeyword, categoryFilter, sortOption]
  );

  const { books, pagination, isLoading, errorMessage, refetch } = useBooks({
    filters,
  });
  const {
    categories,
    isLoading: isCategoryLoading,
    errorMessage: categoryError,
  } = useCategories();

  const handleSearch = (value: string) => {
    setKeyword(value);
    setPage(DEFAULT_PAGE);
  };

  const handleSortChange = (value?: BookSortOption) => {
    setSortOption(value);
    setPage(DEFAULT_PAGE);
  };

  const handleCategoryChange = (value?: string) => {
    setCategoryFilter(value);
    setPage(DEFAULT_PAGE);
  };

  const handlePaginationChange = (nextPage: number, nextPageSize: number) => {
    setPage(nextPage);
    setPageSize(nextPageSize);
  };

  const handleAddNew = () => {
    console.log("Add new book");
  };

  return (
    <div className="books-page">
      {/* Page Header */}
      <div className="books-header">
        <div className="books-header-content">
          <Title level={2} className="books-title">
            Danh sách Truyện tranh
          </Title>
          <Text className="books-description">
            Quản lý và theo dõi tất cả truyện tranh trong hệ thống
          </Text>
        </div>
        <Button
          type="primary"
          icon={<Plus size={20} />}
          onClick={handleAddNew}
          className="books-add-button"
        >
          Thêm mới
        </Button>
      </div>

      {/* Toolbar */}
      <div className="books-toolbar">
        <Row gutter={[12, 12]}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <SearchInput
              placeholder="Tìm kiếm truyện tranh..."
              allowClear
              onSearch={handleSearch}
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              prefix={<Search size={20} />}
              className="books-search-input"
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select
              placeholder="Sắp xếp"
              allowClear
              className="books-filter-select"
              style={{ width: "100%" }}
              value={sortOption}
              onChange={(value) =>
                handleSortChange(value as BookSortOption | undefined)
              }
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
              className="books-filter-select"
              style={{ width: "100%" }}
              value={categoryFilter}
              onChange={(value) =>
                handleCategoryChange(value as string | undefined)
              }
              loading={isCategoryLoading}
              notFoundContent={
                categoryError ? "Không thể tải thể loại" : undefined
              }
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
                className="books-filter-button"
                onClick={() => refetch()}
              >
                Lọc
              </Button>
            </Space>
          </Col>
        </Row>
      </div>

      {/* Book Table */}
      <div className="books-table-container">
        {errorMessage && (
          <Alert
            type="error"
            message="Không thể tải danh sách truyện"
            description={errorMessage}
            showIcon
            className="books-error-alert"
          />
        )}
        <BookTable
          data={books}
          loading={isLoading}
          pagination={pagination}
          page={page}
          pageSize={pageSize}
          onPaginationChange={handlePaginationChange}
        />
      </div>
    </div>
  );
}

export default BooksPage;
