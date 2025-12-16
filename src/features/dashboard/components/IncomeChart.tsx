import { useState, useMemo } from "react";
import { Card, Tabs, Spin, Alert, Empty } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useRevenue } from "../hooks/useRevenue";
import "./IncomeChart.scss";

type TimeRange = "day" | "month" | "year";

interface IIncomeData {
  date: string;
  income: number;
}

function IncomeChart() {
  const [timeRange, setTimeRange] = useState<TimeRange>("year");
  const { revenue, isLoading, errorMessage } = useRevenue();

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const getData = useMemo((): IIncomeData[] => {
    if (!revenue) return [];

    // Sử dụng revenueByPeriod cho tất cả các tab
    if (revenue.revenueByPeriod && revenue.revenueByPeriod.length > 0) {
      return revenue.revenueByPeriod.map((period) => ({
        date: period.period,
        income: period.revenue,
      }));
    }

    // Fallback nếu không có revenueByPeriod
    switch (timeRange) {
      case "day":
        return [
          {
            date: "Hôm nay",
            income: revenue.dailyRevenue,
          },
        ];
      case "month":
        return [
          {
            date: "Tháng này",
            income: revenue.monthlyRevenue,
          },
        ];
      case "year":
        return [];
      default:
        return [];
    }
  }, [revenue, timeRange]);

  const tabItems = [
    {
      key: "day",
      label: "Ngày",
    },
    {
      key: "month",
      label: "Tháng",
    },
    {
      key: "year",
      label: "Năm",
    },
  ];

  if (isLoading) {
    return (
      <Card className="income-chart-card" bordered>
        <div className="income-chart-loading">
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  if (errorMessage) {
    return (
      <Card className="income-chart-card" bordered>
        <Alert message="Lỗi" description={errorMessage} type="error" showIcon />
      </Card>
    );
  }

  if (!revenue || getData.length === 0) {
    return (
      <Card className="income-chart-card" bordered>
        <div className="income-chart-header">
          <h3 className="income-chart-title">Biểu đồ Income</h3>
        </div>
        <Empty description="Không có dữ liệu" />
      </Card>
    );
  }

  return (
    <Card className="income-chart-card" bordered>
      <div className="income-chart-header">
        <h3 className="income-chart-title">Biểu đồ Income</h3>
        <Tabs
          activeKey={timeRange}
          items={tabItems}
          onChange={(key) => setTimeRange(key as TimeRange)}
          className="income-chart-tabs"
        />
      </div>
      <div className="income-chart-content">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={getData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" stroke="#6b7280" />
            <YAxis
              stroke="#6b7280"
              tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
            />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
            />
            <Bar
              dataKey="income"
              fill="#3b82f6"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export default IncomeChart;
