/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/lib/axios";

export async function fetchOrders(): Promise<any> {
  const response = await axiosInstance.get<any>(`/cms/publisher/orders`);
  return response.data;
}
