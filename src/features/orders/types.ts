export type OrderStatus = "PAID" | "PENDING" | "CANCELLED" | "FAILED";

export type PayingMethod = "BANKING" | "VNPAY" | "MOMO" | "CASH";

export interface OrderItem {
  id: string;
  bookTitle: string;
  defaultPrice: number;
  discountPrice: number;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  totalAmount: number;
  status: OrderStatus;
  payingMethod: PayingMethod;
  paidAt: string | null;
  createdAt: string;
  orderItems: OrderItem[];
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
  data: OrdersData;
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
