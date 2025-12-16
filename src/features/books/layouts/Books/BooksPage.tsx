import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useDebounce, useDocumentTitle } from "@/hooks";
import { useBooks } from "../../hooks/useBooks";
import { useCategories } from "@/features/categories";
import { BooksHeader, BooksFilterBar, BooksList } from "./components";
import type { BookSortOption } from "../../types";
import "./BooksPage.scss";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;

export default function BooksPage() {
  useDocumentTitle("Danh sách Truyện tranh - CMS");
  const navigate = useNavigate();

  // Filter states
  const [keyword, setKeyword] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>();
  const [sortOption, setSortOption] = useState<BookSortOption | undefined>();
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const debouncedKeyword = useDebounce(keyword, 500);

  // Build filters
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

  // Data fetching
  const { books, pagination, isLoading, errorMessage, refetch } = useBooks({
    filters,
  });
  const {
    categories,
    isLoading: isCategoryLoading,
    errorMessage: categoryError,
  } = useCategories();

  // Event handlers
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
    navigate({ to: "/books/new" });
  };

  const handleViewDetail = (slug: string) => {
    navigate({ to: `/books/${slug}` });
  };

  return (
    <div className="books-page">
      <BooksHeader onAddNew={handleAddNew} />

      <BooksFilterBar
        keyword={keyword}
        sortOption={sortOption}
        categoryFilter={categoryFilter}
        categories={categories}
        isCategoryLoading={isCategoryLoading}
        categoryError={categoryError}
        onKeywordChange={setKeyword}
        onSearch={handleSearch}
        onSortChange={handleSortChange}
        onCategoryChange={handleCategoryChange}
        onRefetch={refetch}
      />

      <BooksList
        books={books}
        isLoading={isLoading}
        errorMessage={errorMessage}
        pagination={pagination}
        page={page}
        pageSize={pageSize}
        onPaginationChange={handlePaginationChange}
        onViewDetail={handleViewDetail}
      />
    </div>
  );
}
