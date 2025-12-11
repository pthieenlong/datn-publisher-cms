import { Row, Col, Typography, Spin, Alert } from "antd";
import { BookOpen, ShoppingCart, DollarSign, Package } from "lucide-react";
import StatCard from "./components/StatCard";
import IncomeChart from "./components/IncomeChart";
import RecentActivity from "./components/RecentActivity";
import "./DashboardPage.scss";
import { useDocumentTitle } from "@/hooks";
import { useDashboard } from "./hooks/useDashboard";

const { Title, Text } = Typography;

function DashboardPage() {
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
        <div className="dashboard-loading">
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
      {/* Page Header */}
      <div className="dashboard-header">
        <Title level={2} className="dashboard-title">
          Dashboard
        </Title>
        <Text className="dashboard-description">
          Tổng quan về hoạt động và doanh thu của hệ thống
        </Text>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} className="dashboard-stats">
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Tổng số Books"
            value={dashboard.totalBooks}
            icon={<BookOpen size={24} />}
            color="#3b82f6"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Tổng số đơn hàng"
            value={dashboard.totalOrders}
            icon={<ShoppingCart size={24} />}
            color="#22c55e"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Tổng doanh thu"
            value={formatCurrency(dashboard.totalRevenue)}
            icon={<DollarSign size={24} />}
            color="#f59e0b"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Đơn hàng gần đây"
            value={dashboard.recentOrders.length}
            icon={<Package size={24} />}
            color="#8b5cf6"
          />
        </Col>
      </Row>

      {/* Income Chart */}
      <div className="dashboard-chart">
        <IncomeChart />
      </div>

      {/* Recent Activity */}
      <div className="dashboard-activity">
        <RecentActivity orders={dashboard.recentOrders} />
      </div>
    </div>
  );
}

export default DashboardPage;
