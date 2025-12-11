import axiosInstance from "@/lib/axios";
import type { OrdersResponse, OrderDetailResponse } from "../types";

export async function fetchOrders(): Promise<OrdersResponse> {
  const response = await axiosInstance.get<OrdersResponse>(
    `/cms/publisher/orders`
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
