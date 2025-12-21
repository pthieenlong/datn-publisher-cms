export type OrderStatus =
  | "PAID"
  | "PENDING"
  | "CANCELLED"
  | "REFUNDED"
  | "ERROR";

export type PayingMethod = "BANKING" | "MOMO" | "VNPAY";

export interface OrderItem {
  id: string;
  bookTitle: string;
  defaultPrice: number;
  discountPrice: number;
}

export interface Order {
  id: string;
  orderCode?: string;
  userId: string;
  userName: string;
  totalAmount: number;
  status: OrderStatus;
  payingMethod: PayingMethod;
  paidAt: string | null;
  createdAt: string;
  orderItems: OrderItem[];
}

export interface OrderDetailBook {
  id: string;
  title: string;
  slug: string;
  thumbnail: string;
  author: string;
}

export interface OrderDetailItem {
  id: string;
  bookId: string;
  defaultPrice: number;
  discountPrice: number;
  finalPrice: number;
  book: OrderDetailBook;
}

export interface OrderDetailUser {
  id: string;
  username: string;
  email: string;
}

export interface OrderDetail {
  id: string;
  orderCode: string;
  userId: string;
  totalAmount: number;
  publisherRevenue: number;
  status: OrderStatus;
  payingMethod: PayingMethod;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderDetailItem[];
  user: OrderDetailUser;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface OrdersData {
  orders: Order[];
  pagination: PaginationMeta;
}

export interface OrdersResponse {
  httpCode: number;
  success: boolean;
  message: string;
  data: {
    data: OrdersData;
  };
}

export interface OrderDetailResponse {
  httpCode: number;
  success: boolean;
  message: string;
  data: OrderDetail;
}

export type OrderSortOption =
  | "latest"
  | "oldest"
  | "amount_asc"
  | "amount_desc";

export interface OrderListFilters {
  page?: number;
  keyword?: string;
  status?: OrderStatus;
}

export interface FetchOrdersPayload {
  filters?: OrderListFilters;
  signal?: AbortSignal;
}
