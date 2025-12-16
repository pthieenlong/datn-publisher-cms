import { Typography } from "antd";
import "./DashboardHeader.scss";

const { Title, Text } = Typography;

export default function DashboardHeader() {
  return (
    <div className="dashboard-header">
      <Title level={2} className="dashboard-header__title">
        Dashboard
      </Title>
      <Text className="dashboard-header__description">
        Tổng quan về hoạt động và doanh thu của hệ thống
      </Text>
    </div>
  );
}
