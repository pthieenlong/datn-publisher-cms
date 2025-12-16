import { Spin, Alert } from "antd";
import { useDocumentTitle } from "@/hooks";
import { useDashboard } from "./hooks/useDashboard";
import {
  DashboardHeader,
  DashboardStats,
  IncomeChart,
  RecentActivity,
} from "./components";
import "./DashboardPage.scss";

export default function DashboardPage() {
  useDocumentTitle("Trang chủ - CMS");
  const { dashboard, isLoading, errorMessage } = useDashboard();

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-page__loading">
          <Spin size="large" />
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="dashboard-page">
        <Alert message="Lỗi" description={errorMessage} type="error" showIcon />
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="dashboard-page">
        <Alert message="Không có dữ liệu" type="info" showIcon />
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <DashboardHeader />

      <DashboardStats
        totalBooks={dashboard.totalBooks}
        totalOrders={dashboard.totalOrders}
        totalRevenue={formatCurrency(dashboard.totalRevenue)}
        recentOrdersCount={dashboard.recentOrders.length}
      />

      <div className="dashboard-page__chart">
        <IncomeChart />
      </div>

      <div className="dashboard-page__activity">
        <RecentActivity orders={dashboard.recentOrders} />
      </div>
    </div>
  );
}
