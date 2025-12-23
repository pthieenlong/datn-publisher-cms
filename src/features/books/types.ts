export type BookStatus = "PENDING" | "DRAFT" | "PUBLISHED" | "REJECTED" | "ARCHIVED";

export type ChapterStatus = "PENDING" | "DRAFT" | "PUBLISHED" | "ARCHIVED";

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
  status: ChapterStatus;
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

export interface BookRatingUser {
  id: string;
  avatar: string | null;
  username: string;
}

export interface BookRating {
  id: string;
  user: BookRatingUser;
  content: string;
  ratePoint: number;
  agreement: number;
  progress: number;
  createdAt: string;
  updatedAt: string;
}

export interface BookComment {
  id: string;
  user: BookRatingUser;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface PurchasedUser {
  id: string;
  username: string;
  email: string;
  avatar: string | null;
  purchasedAt: string;
  pricePaid: number;
  orderCode: string;
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
  subscriptionType: "BOTH" | "CHAPTER" | "BOOK";
  updatedAt: string;
  createdAt: string;
  deletedAt: string | null;
  bookCategories: BookCategory[];
  categories: SimpleCategory[];
  chapters: BookChapter[];
  reviews: BookReview[];
  ratings?: BookRating[];
  comments?: BookComment[];
  purchasedUsers: PurchasedUser[];
  totalPurchases: number;
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
  price: number;
  isFree: boolean;
  isOnSale: boolean;
  salePercent: number;
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

export interface CreateBookPayload {
  title: string;
  author: string;
  price: number;
  thumbnail?: File;
}

export interface CreateBookResponse {
  httpCode: number;
  success: boolean;
  message: string;
  data: BookDetail;
}

// Chapter types
// Theo API docs: title, isFree, price, galleries là required
export interface CreateChapterPayload {
  title: string;
  isFree: boolean;
  price: number;
  isOnSale?: boolean;
  salePercent?: number;
  galleries: File[];
}

export interface CreateChapterResponse {
  httpCode: number;
  success: boolean;
  message: string;
  data: {
    id: string;
    title: string;
    slug: string;
    price: number;
    isFree: boolean;
    isOnSale: boolean;
    salePercent: number;
    status: ChapterStatus;
    book: {
      slug: string;
      title: string;
    };
    createdAt: string;
  };
}

export interface UpdateChapterPayload {
  isFree?: boolean;
  price?: number;
  isOnSale?: boolean;
  salePercent?: number;
  galleries?: File[];
}

export interface UpdateChapterResponse {
  httpCode: number;
  success: boolean;
  message: string;
  data: {
    id: string;
    chapterNumber: number;
  };
}

export interface DeleteChapterResponse {
  httpCode: number;
  success: boolean;
  message: string;
}

export interface UnarchiveChapterResponse {
  httpCode: number;
  success: boolean;
  message: string;
}

// Delete Book types
export interface DeleteBookResponse {
  httpCode: number;
  success: boolean;
  message: string;
  data: {
    deletedBook: {
      id: string;
      title: string;
    };
  };
}

export interface UnarchiveBookResponse {
  httpCode: number;
  success: boolean;
  message: string;
}

export interface UpdateBookThumbnailResponse {
  httpCode: number;
  success: boolean;
  message: string;
  data: {
    thumbnail: string;
  };
}

// Chapter Galleries Management types
export interface RemoveImagesResponse {
  httpCode: number;
  success: boolean;
  message: string;
  data: {
    deletedCount: number;
  };
}

export interface AddImagesResponse {
  httpCode: number;
  success: boolean;
  message: string;
  data: {
    addedCount: number;
    newImageUrls: string[];
  };
}

export interface ReorderImagesResponse {
  httpCode: number;
  success: boolean;
  message: string;
}

export interface DeleteCommentResponse {
  httpCode: number;
  success: boolean;
  message: string;
}
