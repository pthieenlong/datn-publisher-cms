import { useState } from "react";
import { Card, Tabs } from "antd";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./IncomeChart.scss";

type TimeRange = "day" | "month" | "year";

interface IIncomeData {
  date: string;
  income: number;
}

// Mock data - sẽ thay thế bằng API call sau
const mockDayData: IIncomeData[] = Array.from({ length: 7 }, (_, i) => ({
  date: `Ngày ${i + 1}`,
  income: Math.floor(Math.random() * 1000000) + 500000,
}));

const mockMonthData: IIncomeData[] = Array.from({ length: 12 }, (_, i) => ({
  date: `Tháng ${i + 1}`,
  income: Math.floor(Math.random() * 5000000) + 2000000,
}));

const mockYearData: IIncomeData[] = Array.from({ length: 5 }, (_, i) => ({
  date: `${2021 + i}`,
  income: Math.floor(Math.random() * 50000000) + 20000000,
}));

function IncomeChart() {
  const [timeRange, setTimeRange] = useState<TimeRange>("day");

  const getData = (): IIncomeData[] => {
    switch (timeRange) {
      case "day":
        return mockDayData;
      case "month":
        return mockMonthData;
      case "year":
        return mockYearData;
      default:
        return mockDayData;
    }
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

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
          <LineChart data={getData()}>
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
            <Line
              type="monotone"
              dataKey="income"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: "#3b82f6", r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export default IncomeChart;
