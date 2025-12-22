import { Card, Avatar, Space, Typography } from "antd";
import { ShoppingCart } from "lucide-react";
import type { PurchasedUser } from "@/features/books/types";
import "./BookPurchaseStatsCard.scss";

const { Text } = Typography;

export interface BookPurchaseStatsCardProps {
  totalPurchases: number;
  purchasedUsers: PurchasedUser[];
}

export default function BookPurchaseStatsCard({
  totalPurchases,
  purchasedUsers,
}: BookPurchaseStatsCardProps) {
  const maxAvatarsToShow = 5;
  const displayedUsers = purchasedUsers.slice(0, maxAvatarsToShow);
  const remainingCount = Math.max(0, totalPurchases - maxAvatarsToShow);

  const getAvatarContent = (user: PurchasedUser) => {
    if (user.avatar) {
      return user.avatar;
    }
    return user.username.charAt(0).toUpperCase();
  };

  return (
    <Card className="book-purchase-stats-card">
      <div className="book-purchase-stats-card__content">
        <div className="book-purchase-stats-card__header">
          <Space align="center" size={8}>
            <ShoppingCart size={20} className="book-purchase-stats-card__icon" />
            <Text className="book-purchase-stats-card__title">Người đã mua</Text>
          </Space>
        </div>

        <div className="book-purchase-stats-card__count">
          {totalPurchases.toLocaleString("vi-VN")}
        </div>

        {displayedUsers.length > 0 && (
          <div className="book-purchase-stats-card__avatars">
            <Avatar.Group
              maxCount={maxAvatarsToShow}
              maxStyle={{
                backgroundColor: "#1890ff",
                cursor: "pointer",
              }}
            >
              {displayedUsers.map((user) => (
                <Avatar
                  key={user.id}
                  src={user.avatar}
                  alt={user.username}
                  className="book-purchase-stats-card__avatar"
                >
                  {!user.avatar && getAvatarContent(user)}
                </Avatar>
              ))}
              {remainingCount > 0 && (
                <Avatar
                  style={{ backgroundColor: "#1890ff" }}
                  className="book-purchase-stats-card__avatar-more"
                >
                  +{remainingCount}
                </Avatar>
              )}
            </Avatar.Group>
          </div>
        )}

        {totalPurchases === 0 && (
          <Text type="secondary" className="book-purchase-stats-card__empty">
            Chưa có người mua
          </Text>
        )}
      </div>
    </Card>
  );
}
