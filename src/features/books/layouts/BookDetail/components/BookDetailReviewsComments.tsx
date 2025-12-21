import { Card, Tabs, Typography } from "antd";
import { MessageSquare, Star } from "lucide-react";
import ReviewsTable from "./ReviewsTable";
import CommentsTable from "./CommentsTable";
import type { BookRating, BookComment } from "@/features/books/types";
import "./BookDetailReviewsComments.scss";

const { Title } = Typography;

export interface BookDetailReviewsCommentsProps {
  ratings?: BookRating[];
  comments?: BookComment[];
  loading?: boolean;
}

export default function BookDetailReviewsComments({
  ratings = [],
  comments = [],
  loading = false,
}: BookDetailReviewsCommentsProps) {
  const tabItems = [
    {
      key: "reviews",
      label: (
        <span className="book-detail-reviews-comments__tab-label">
          <Star size={16} />
          Đánh giá
        </span>
      ),
      children: <ReviewsTable ratings={ratings} loading={loading} />,
    },
    {
      key: "comments",
      label: (
        <span className="book-detail-reviews-comments__tab-label">
          <MessageSquare size={16} />
          Bình luận
        </span>
      ),
      children: <CommentsTable comments={comments} loading={loading} />,
    },
  ];

  return (
    <Card className="book-detail-reviews-comments">
      <Title level={4} className="book-detail-reviews-comments__title">
        Đánh giá & Bình luận
      </Title>
      <Tabs items={tabItems} defaultActiveKey="reviews" />
    </Card>
  );
}
