import { Row, Col } from "antd";
import { BookOpen, ShoppingCart, DollarSign, Package } from "lucide-react";
import StatCard from "./StatCard";
import "./DashboardStats.scss";

export interface DashboardStatsProps {
  totalBooks: number;
  totalOrders: number;
  totalRevenue: string;
  recentOrdersCount: number;
}

export default function DashboardStats({
  totalBooks,
  totalOrders,
  totalRevenue,
  recentOrdersCount,
}: DashboardStatsProps) {
  return (
    <Row gutter={[16, 16]} className="dashboard-stats">
      <Col xs={24} sm={12} lg={6}>
        <StatCard
          title="Tổng số Books"
          value={totalBooks}
          icon={<BookOpen size={24} />}
          color="#3b82f6"
        />
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <StatCard
          title="Tổng số đơn hàng"
          value={totalOrders}
          icon={<ShoppingCart size={24} />}
          color="#22c55e"
        />
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <StatCard
          title="Tổng doanh thu"
          value={totalRevenue}
          icon={<DollarSign size={24} />}
          color="#f59e0b"
        />
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <StatCard
          title="Đơn hàng gần đây"
          value={recentOrdersCount}
          icon={<Package size={24} />}
          color="#8b5cf6"
        />
      </Col>
    </Row>
  );
}
