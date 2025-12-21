import axiosInstance from "@/lib/axios";
import type { DashboardResponse, RevenueResponse, RevenueChartResponse } from "../types";

export async function fetchDashboard(
  signal?: AbortSignal
): Promise<DashboardResponse> {
  const response = await axiosInstance.get<DashboardResponse>(
    `/cms/publisher/dashboard`,
    { signal }
  );
  return response.data;
}

export interface FetchRevenueParams {
  groupBy?: "daily" | "weekly" | "monthly" | "yearly";
  startDate?: string;
  endDate?: string;
}

export async function fetchRevenue(
  params?: FetchRevenueParams,
  signal?: AbortSignal
): Promise<RevenueResponse> {
  const response = await axiosInstance.get<RevenueResponse>(
    `/cms/publisher/revenue`,
    {
      params,
      signal,
    }
  );
  return response.data;
}

export interface FetchRevenueChartParams {
  groupBy?: "daily" | "weekly" | "monthly";
}

export async function fetchRevenueChart(
  params?: FetchRevenueChartParams,
  signal?: AbortSignal
): Promise<RevenueChartResponse> {
  const response = await axiosInstance.get<RevenueChartResponse>(
    `/cms/publisher/revenue/chart`,
    {
      params,
      signal,
    }
  );
  return response.data;
}
