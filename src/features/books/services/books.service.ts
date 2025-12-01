import qs from "qs";
import axiosInstance from "@/lib/axios";
import type {
  BookDetailResponse,
  BooksResponse,
  ChapterDetailResponse,
  FetchBooksPayload,
  UpdateBookPayload,
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
