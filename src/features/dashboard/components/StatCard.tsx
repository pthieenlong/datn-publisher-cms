import { Card } from "antd";
import type React from "react";
import "./StatCard.scss";

interface IStatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
}

function StatCard({ title, value, icon, color = "#3b82f6" }: IStatCardProps) {
  return (
    <Card className="stat-card" bordered>
      <div className="stat-card-content">
        <div className="stat-card-icon" style={{ color }}>
          {icon}
        </div>
        <div className="stat-card-info">
          <div className="stat-card-value">{value}</div>
          <div className="stat-card-title">{title}</div>
        </div>
      </div>
    </Card>
  );
}

export default StatCard;
