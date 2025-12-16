import { Card, Typography, Tag } from "antd";
import "./BookDetailPricing.scss";

const { Title, Text } = Typography;

export interface PricingInfo {
  basePrice: number;
  salePercent: number;
  salePrice: number;
  isFree: boolean;
}

export interface BookDetailPricingProps {
  pricingInfo: PricingInfo;
  statusColor: string;
  statusText: string;
}

export default function BookDetailPricing({
  pricingInfo,
  statusColor,
  statusText,
}: BookDetailPricingProps) {
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  return (
    <Card className="book-detail-pricing">
      <Title level={4} className="book-detail-pricing__title">
        Thông tin chi phí & Trạng thái
      </Title>
      <div className="book-detail-pricing__content">
        <div className="book-detail-pricing__item">
          <Text className="book-detail-pricing__label">Giá niêm yết:</Text>
          <Text className="book-detail-pricing__value book-detail-pricing__original-price">
            {pricingInfo.isFree ? "Miễn phí" : formatCurrency(pricingInfo.basePrice)}
          </Text>
        </div>
        {pricingInfo.salePercent > 0 && (
          <div className="book-detail-pricing__item">
            <Text className="book-detail-pricing__label">Giảm giá:</Text>
            <Text className="book-detail-pricing__value book-detail-pricing__sale-percent">
              {pricingInfo.salePercent}%
            </Text>
          </div>
        )}
        <div className="book-detail-pricing__item">
          <Text className="book-detail-pricing__label">Giá bán hiện tại:</Text>
          <Text className="book-detail-pricing__value book-detail-pricing__sale-price">
            {pricingInfo.isFree ? "Miễn phí" : formatCurrency(pricingInfo.salePrice)}
          </Text>
        </div>
        <div className="book-detail-pricing__item">
          <Text className="book-detail-pricing__label">Trạng thái:</Text>
          <Tag color={statusColor} className="book-detail-pricing__status-tag">
            {statusText}
          </Tag>
        </div>
      </div>
    </Card>
  );
}
