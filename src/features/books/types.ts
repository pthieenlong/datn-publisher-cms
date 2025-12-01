export type BookStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface BookCategory {
  category: {
    id: string;
    slug: string;
    title: string;
  };
}

export interface Book {
  id: string;
  title: string;
  slug: string;
  thumbnail: string;
  author: string;
  price: number;
  isFree: boolean;
  isOnSale: boolean;
  salePercent: number;
  status: BookStatus;
  createdAt: string;
  updatedAt: string;
  bookCategories: BookCategory[];
  avgRating: number;
}

export interface PaginationMeta {
  limit: number;
  page: number;
  totalPage: number;
  totalItems: number;
}

export interface BooksResponse {
  httpCode: number;
  success: boolean;
  message: string;
  data: Book[];
  pagination: PaginationMeta;
}

export type BookSortOption =
  | "latest"
  | "top_rated"
  | "most_viewed"
  | "price_asc"
  | "price_desc"
  | "free";

export interface BookListFilters {
  page?: number;
  pageSize?: number;
  keyword?: string;
  category?: string;
  categories?: string[];
  sort?: BookSortOption;
}

export interface FetchBooksPayload {
  filters?: BookListFilters;
  signal?: AbortSignal;
}

export interface BookChapter {
  id: string;
  title: string;
  slug: string;
  chapterNumber: number;
  views: number;
  status: BookStatus;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  isFree: boolean;
}

export interface SimpleCategory {
  id: string;
  slug: string;
  title: string;
}

export interface BookReview {
  id: string;
  reviewer: string;
  content: string;
  createdAt: string;
}

export interface BookDetail {
  id: string;
  publisherId: string;
  title: string;
  slug: string;
  thumbnail: string;
  view: number;
  likeCount: number;
  description: string;
  author: string;
  policy: string;
  isFree: boolean;
  status: BookStatus;
  price: number;
  isOnSale: boolean;
  salePercent: number;
  updatedAt: string;
  createdAt: string;
  deletedAt: string | null;
  bookCategories: BookCategory[];
  categories: SimpleCategory[];
  chapters: BookChapter[];
  reviews: BookReview[];
}

export interface BookDetailResponse {
  httpCode: number;
  success: boolean;
  message: string;
  data: BookDetail;
}

export interface ChapterDetailBook {
  id: string;
  slug: string;
  title: string;
}

export interface ChapterDetail {
  id: string;
  bookId: string;
  title: string;
  slug: string;
  chapterNumber: number;
  status: BookStatus;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  content: string[];
  book: ChapterDetailBook;
}

export interface ChapterDetailResponse {
  httpCode: number;
  success: boolean;
  message: string;
  data: ChapterDetail;
}

export interface UpdateBookPayload {
  thumbnail?: File;
  price?: number | null;
  salePercent?: number | null;
  isOnSale?: boolean;
  isFree?: boolean;
  description?: string;
}
