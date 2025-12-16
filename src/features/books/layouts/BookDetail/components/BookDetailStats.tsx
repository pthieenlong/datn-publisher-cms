import { Row, Col, Card, Statistic } from "antd";
import { BookOpen, Eye, Heart, DollarSign } from "lucide-react";
import type { ReactNode } from "react";
import "./BookDetailStats.scss";

interface StatItem {
  title: string;
  value: number | string;
  icon: ReactNode;
  color: string;
}

export interface BookDetailStatsProps {
  chapterCount: number;
  viewCount: number;
  likeCount: number;
  priceDisplay: string;
}

export default function BookDetailStats({
  chapterCount,
  viewCount,
  likeCount,
  priceDisplay,
}: BookDetailStatsProps) {
  const stats: StatItem[] = [
    {
      title: "Số chương",
      value: chapterCount,
      icon: <BookOpen size={20} />,
      color: "#3b82f6",
    },
    {
      title: "Lượt xem",
      value: viewCount,
      icon: <Eye size={20} />,
      color: "#22c55e",
    },
    {
      title: "Lượt thích",
      value: likeCount,
      icon: <Heart size={20} />,
      color: "#ef4444",
    },
    {
      title: "Giá bán",
      value: priceDisplay,
      icon: <DollarSign size={20} />,
      color: "#f97316",
    },
  ];

  return (
    <div className="book-detail-stats">
      <Row gutter={[16, 16]}>
        {stats.map((stat) => (
          <Col xs={24} sm={12} lg={6} key={stat.title}>
            <Card className="book-detail-stats__card">
              <Statistic
                title={stat.title}
                value={stat.value}
                prefix={stat.icon}
                valueStyle={{ color: stat.color }}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
