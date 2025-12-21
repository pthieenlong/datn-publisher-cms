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
import { useRevenueChart } from "../hooks/useRevenueChart";
import "./IncomeChart.scss";

type TimeRange = "day" | "month" | "year";

interface IIncomeData {
  date: string;
  income: number;
}

function IncomeChart() {
  const [timeRange, setTimeRange] = useState<TimeRange>("month");

  const groupByMap: Record<TimeRange, "daily" | "weekly" | "monthly"> = {
    day: "daily",
    month: "weekly",
    year: "monthly",
  };

  const { chartData, isLoading, errorMessage } = useRevenueChart({
    groupBy: groupByMap[timeRange],
  });

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const getData = useMemo((): IIncomeData[] => {
    if (!chartData || chartData.length === 0) return [];

    return chartData.map((item) => ({
      date: item.period,
      income: item.totalRevenue,
    }));
  }, [chartData]);

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

  if (!chartData || getData.length === 0) {
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
            <Bar dataKey="income" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export default IncomeChart;
