import axiosInstance from "@/lib/axios";
import type { DashboardResponse, RevenueResponse } from "../types";

export async function fetchDashboard(
  signal?: AbortSignal
): Promise<DashboardResponse> {
  const response = await axiosInstance.get<DashboardResponse>(
    `/cms/publisher/dashboard`,
    { signal }
  );
  return response.data;
}

export async function fetchRevenue(
  signal?: AbortSignal
): Promise<RevenueResponse> {
  const response = await axiosInstance.get<RevenueResponse>(
    `/cms/publisher/revenue`,
    { signal }
  );
  return response.data;
}

