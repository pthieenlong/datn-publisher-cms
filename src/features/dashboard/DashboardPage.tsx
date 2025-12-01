import { Row, Col, Typography } from "antd";
import { BookOpen, ShoppingCart, DollarSign, Package } from "lucide-react";
import StatCard from "./components/StatCard";
import IncomeChart from "./components/IncomeChart";
import RecentActivity from "./components/RecentActivity";
import "./DashboardPage.scss";
import { useDocumentTitle } from "@/hooks";

const { Title, Text } = Typography;

// Mock data - sẽ thay thế bằng API call sau
const mockStats = {
  totalBooks: 156,
  monthlyOrders: 1245,
  monthlyIncome: 125000000,
  totalMonthlyOrders: 1245,
};

function DashboardPage() {
  useDocumentTitle("Trang chủ - CMS");
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

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
            title="Số lượng Books"
            value={mockStats.totalBooks}
            icon={<BookOpen size={24} />}
            color="#3b82f6"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Số lượng đơn hàng trong tháng"
            value={mockStats.monthlyOrders}
            icon={<ShoppingCart size={24} />}
            color="#22c55e"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Tổng số Income trong tháng"
            value={formatCurrency(mockStats.monthlyIncome)}
            icon={<DollarSign size={24} />}
            color="#f59e0b"
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Tổng số đơn hàng trong tháng"
            value={mockStats.totalMonthlyOrders}
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
        <RecentActivity />
      </div>
    </div>
  );
}

export default DashboardPage;
