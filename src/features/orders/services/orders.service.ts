import axiosInstance from "@/lib/axios";
import type {
  FetchOrdersPayload,
  OrdersResponse,
  OrderDetailResponse,
} from "../types";

export async function fetchOrders(
  payload?: FetchOrdersPayload
): Promise<OrdersResponse> {
  const { filters, signal } = payload ?? {};
  const response = await axiosInstance.get<OrdersResponse>(
    `/cms/publisher/orders`,
    {
      params: filters,
      signal,
    }
  );
  return response.data;
}

export async function fetchOrderDetail(
  orderId: string,
  signal?: AbortSignal
): Promise<OrderDetailResponse> {
  const endpoint = `/cms/publisher/orders/${encodeURIComponent(orderId)}`;
  const response = await axiosInstance.get<OrderDetailResponse>(endpoint, {
    signal,
  });
  return response.data;
}
