import { Row, Col, Card, Statistic, Tag, Space, Typography } from "antd";
import { BookOpen, Eye, Heart, DollarSign, Percent } from "lucide-react";
import type { ReactNode } from "react";
import "./BookDetailStats.scss";

const { Text } = Typography;

interface StatItem {
  title: string;
  value: number | string;
  icon: ReactNode;
  color: string;
}

export interface PricingInfo {
  basePrice: number;
  salePercent: number;
  salePrice: number;
  isFree: boolean;
}

export interface BookDetailStatsProps {
  chapterCount: number;
  viewCount: number;
  likeCount: number;
  pricingInfo: PricingInfo;
  statusColor: string;
  statusText: string;
}

export default function BookDetailStats({
  chapterCount,
  viewCount,
  likeCount,
  pricingInfo,
}: BookDetailStatsProps) {
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const priceDisplay = pricingInfo.isFree
    ? "Miễn phí"
    : formatCurrency(pricingInfo.salePrice);

  const hasDiscount = pricingInfo.salePercent > 0 && !pricingInfo.isFree;

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

        {/* Price Card with more details */}
        <Col xs={24} sm={12} lg={6}>
          <Card className="book-detail-stats__card book-detail-stats__price-card">
            <div className="book-detail-stats__price-header">
              <Space align="center" size={4}>
                <DollarSign
                  size={20}
                  className="book-detail-stats__price-icon"
                />
                <Text className="book-detail-stats__price-title">Giá bán</Text>
              </Space>
            </div>
            <div className="book-detail-stats__price-value">{priceDisplay}</div>
            {hasDiscount && (
              <div className="book-detail-stats__price-details">
                <Text delete className="book-detail-stats__original-price">
                  {formatCurrency(pricingInfo.basePrice)}
                </Text>
                <Tag color="red" className="book-detail-stats__discount-tag">
                  <Space align="center" size={2}>
                    <Percent size={10} />
                    <span>-{pricingInfo.salePercent}%</span>
                  </Space>
                </Tag>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
