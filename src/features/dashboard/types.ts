import type { Order } from "../orders/types";

export interface DashboardData {
  totalBooks: number;
  totalRevenue: number;
  totalOrders: number;
  recentOrders: Order[];
}

export interface DashboardResponse {
  httpCode: number;
  success: boolean;
  message: string;
  data: DashboardData;
}

export interface RevenueGrowth {
  monthly: number;
  weekly: number;
  daily: number;
}

export interface RevenueByPeriod {
  period: string;
  revenue: number;
  orders: number;
}

export interface RevenueData {
  totalRevenue: number;
  monthlyRevenue: number;
  weeklyRevenue: number;
  dailyRevenue: number;
  revenueGrowth: RevenueGrowth;
  revenueByPeriod: RevenueByPeriod[];
}

export interface RevenueResponse {
  httpCode: number;
  success: boolean;
  message: string;
  data: RevenueData;
}

export interface RevenueChartData {
  period: string;
  ordersCount: number;
  totalRevenue: number;
}

export interface RevenueChartResponse {
  httpCode: number;
  success: boolean;
  message: string;
  data: RevenueChartData[];
}
