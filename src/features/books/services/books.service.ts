import qs from "qs";
import axiosInstance from "@/lib/axios";
import type {
  BookDetailResponse,
  BooksResponse,
  ChapterDetailResponse,
  FetchBooksPayload,
  UpdateBookPayload,
  CreateBookPayload,
  CreateBookResponse,
  CreateChapterPayload,
  CreateChapterResponse,
  UpdateChapterPayload,
  UpdateChapterResponse,
  DeleteChapterResponse,
  UnarchiveChapterResponse,
  DeleteBookResponse,
  UnarchiveBookResponse,
  UpdateBookThumbnailResponse,
  DeleteCommentResponse,
} from "../types";

export async function fetchBooks(
  options: FetchBooksPayload = {}
): Promise<BooksResponse> {
  const { filters, signal } = options;
  const hasFilters = filters && Object.keys(filters).length > 0;
  const queryString = hasFilters
    ? `?${qs.stringify(filters, { skipNulls: true })}`
    : "";
  const response = await axiosInstance.get<BooksResponse>(
    `/cms/publisher/books${queryString}`,
    { signal }
  );

  return response.data;
}

export async function fetchBookDetail(
  slug: string,
  signal?: AbortSignal
): Promise<BookDetailResponse> {
  const endpoint = `/cms/publisher/books/${encodeURIComponent(slug)}`;
  const response = await axiosInstance.get<BookDetailResponse>(endpoint, {
    signal,
  });

  return response.data;
}

export async function fetchChapterDetail(
  bookSlug: string,
  chapterSlug: string,
  signal?: AbortSignal
): Promise<ChapterDetailResponse> {
  const endpoint = `/cms/publisher/books/${encodeURIComponent(
    bookSlug
  )}/chapters/${encodeURIComponent(chapterSlug)}`;
  const response = await axiosInstance.get<ChapterDetailResponse>(endpoint, {
    signal,
  });

  return response.data;
}

export async function updateBookDetail(
  slug: string,
  payload: UpdateBookPayload
): Promise<BookDetailResponse> {
  const endpoint = `/cms/publisher/books/${encodeURIComponent(slug)}`;
  const response = await axiosInstance.put(endpoint, payload);

  return response.data;
}

export async function createBook(
  payload: CreateBookPayload
): Promise<CreateBookResponse> {
  const formData = new FormData();
  formData.append("title", payload.title);
  formData.append("author", payload.author);
  formData.append("price", payload.price.toString());

  if (payload.thumbnail) {
    formData.append("thumbnail", payload.thumbnail);
  }

  const response = await axiosInstance.post<CreateBookResponse>(
    `/cms/publisher/books`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}

export async function deleteBook(slug: string): Promise<DeleteBookResponse> {
  const endpoint = `/cms/publisher/books/${encodeURIComponent(slug)}`;
  const response = await axiosInstance.delete<DeleteBookResponse>(endpoint);

  return response.data;
}

export async function unarchiveBook(
  slug: string
): Promise<UnarchiveBookResponse> {
  const endpoint = `/cms/publisher/books/${encodeURIComponent(slug)}`;
  const response = await axiosInstance.post<UnarchiveBookResponse>(endpoint);

  return response.data;
}

export async function updateBookThumbnail(
  slug: string,
  thumbnail: File
): Promise<UpdateBookThumbnailResponse> {
  const formData = new FormData();
  formData.append("thumbnail", thumbnail);

  const endpoint = `/cms/publisher/books/${encodeURIComponent(slug)}`;
  const response = await axiosInstance.patch<UpdateBookThumbnailResponse>(
    endpoint,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}

// Chapter services
export async function createChapter(
  bookSlug: string,
  payload: CreateChapterPayload
): Promise<CreateChapterResponse> {
  const formData = new FormData();

  // Required fields theo API docs
  if (payload.isFree !== undefined) {
    formData.append("isFree", String(payload.isFree));
  }
  if (payload.price !== undefined) {
    formData.append("price", payload.price.toString());
  }

  // Optional fields
  if (payload.isOnSale !== undefined) {
    formData.append("isOnSale", String(payload.isOnSale));
  }

  if (payload.salePercent !== undefined) {
    formData.append("salePercent", payload.salePercent.toString());
  }

  // Galleries - required
  payload.galleries.forEach((file) => {
    formData.append("galleries", file);
  });

  // Endpoint theo API docs: POST /cms/publisher/books/:bookSlug/chapters
  const endpoint = `/cms/publisher/books/${encodeURIComponent(
    bookSlug
  )}/chapters`;
  const response = await axiosInstance.post<CreateChapterResponse>(
    endpoint,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}

export async function updateChapter(
  bookSlug: string,
  chapterSlug: string,
  payload: UpdateChapterPayload
): Promise<UpdateChapterResponse> {
  const formData = new FormData();

  if (payload.isFree !== undefined) {
    formData.append("isFree", String(payload.isFree));
  }

  if (payload.price !== undefined) {
    formData.append("price", payload.price.toString());
  }

  if (payload.isOnSale !== undefined) {
    formData.append("isOnSale", String(payload.isOnSale));
  }

  if (payload.salePercent !== undefined) {
    formData.append("salePercent", payload.salePercent.toString());
  }

  if (payload.galleries) {
    payload.galleries.forEach((file) => {
      formData.append("galleries", file);
    });
  }

  // Endpoint theo AI docs: PUT /chapters/:bookSlug/:chapterSlug
  const endpoint = `/cms/publisher/books/${encodeURIComponent(
    bookSlug
  )}/chapters/${encodeURIComponent(chapterSlug)}`;
  const response = await axiosInstance.put<UpdateChapterResponse>(
    endpoint,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}

export async function deleteChapter(
  bookSlug: string,
  chapterSlug: string
): Promise<DeleteChapterResponse> {
  const endpoint = `/cms/publisher/books/${encodeURIComponent(
    bookSlug
  )}/chapters/${encodeURIComponent(chapterSlug)}`;
  const response = await axiosInstance.delete<DeleteChapterResponse>(endpoint);
  console.log(response);

  return response.data;
}

export async function unarchiveChapter(
  bookSlug: string,
  chapterSlug: string
): Promise<UnarchiveChapterResponse> {
  const endpoint = `/cms/publisher/books/${encodeURIComponent(
    bookSlug
  )}/chapters/${encodeURIComponent(chapterSlug)}`;
  const response = await axiosInstance.patch<UnarchiveChapterResponse>(
    endpoint
  );
  console.log(response);
  return response.data;
}

export async function deleteComment(
  bookSlug: string,
  commentId: string,
  userId: string
): Promise<DeleteCommentResponse> {
  const endpoint = `/cms/publisher/books/${encodeURIComponent(
    bookSlug
  )}/comment/${commentId}/${userId}`;
  const response = await axiosInstance.delete<DeleteCommentResponse>(endpoint);
  return response.data;
}
