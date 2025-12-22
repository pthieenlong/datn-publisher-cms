import { Card, Tabs, Typography } from "antd";
import { MessageSquare, Star, ShoppingBag } from "lucide-react";
import ReviewsTable from "./ReviewsTable";
import CommentsTable from "./CommentsTable";
import PurchasedUsersTable from "./PurchasedUsersTable";
import type { BookRating, BookComment, PurchasedUser } from "@/features/books/types";
import "./BookDetailUserInteractions.scss";

const { Title } = Typography;

export interface BookDetailUserInteractionsProps {
  purchasedUsers: PurchasedUser[];
  ratings?: BookRating[];
  comments?: BookComment[];
  loading?: boolean;
}

export default function BookDetailUserInteractions({
  purchasedUsers,
  ratings = [],
  comments = [],
  loading = false,
}: BookDetailUserInteractionsProps) {
  const tabItems = [
    {
      key: "purchased",
      label: (
        <span className="book-detail-user-interactions__tab-label">
          <ShoppingBag size={16} />
          Người mua ({purchasedUsers.length})
        </span>
      ),
      children: <PurchasedUsersTable purchasedUsers={purchasedUsers} loading={loading} />,
    },
    {
      key: "reviews",
      label: (
        <span className="book-detail-user-interactions__tab-label">
          <Star size={16} />
          Đánh giá ({ratings.length})
        </span>
      ),
      children: <ReviewsTable ratings={ratings} loading={loading} />,
    },
    {
      key: "comments",
      label: (
        <span className="book-detail-user-interactions__tab-label">
          <MessageSquare size={16} />
          Bình luận ({comments.length})
        </span>
      ),
      children: <CommentsTable comments={comments} loading={loading} />,
    },
  ];

  return (
    <Card className="book-detail-user-interactions">
      <Title level={4} className="book-detail-user-interactions__title">
        Thông tin người dùng
      </Title>
      <Tabs items={tabItems} defaultActiveKey="purchased" />
    </Card>
  );
}
