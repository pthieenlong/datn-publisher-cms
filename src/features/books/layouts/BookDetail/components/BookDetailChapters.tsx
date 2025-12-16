import { Card, Typography, Button, Space } from "antd";
import ChapterList from "../../../components/ChapterList";
import type { BookChapter } from "@/features/books/types";
import "./BookDetailChapters.scss";

const { Title, Text } = Typography;

export interface BookDetailChaptersProps {
  chapters: BookChapter[];
  bookSlug: string;
  isLoading: boolean;
  page: number;
  pageSize: number;
  totalChapters: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function BookDetailChapters({
  chapters,
  bookSlug,
  isLoading,
  page,
  pageSize,
  totalChapters,
  totalPages,
  onPageChange,
}: BookDetailChaptersProps) {
  return (
    <Card className="book-detail-chapters">
      <Title level={4} className="book-detail-chapters__title">
        Danh sách chương
      </Title>
      <ChapterList
        chapters={chapters}
        bookSlug={bookSlug}
        isLoading={isLoading}
        page={page}
        pageSize={pageSize}
        total={totalChapters}
        onPageChange={onPageChange}
      />
      <div className="book-detail-chapters__pagination">
        <Space>
          <Button
            size="small"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
          >
            Trang trước
          </Button>
          <Text>
            Trang {page}/{totalPages || 1}
          </Text>
          <Button
            size="small"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
          >
            Trang sau
          </Button>
        </Space>
      </div>
    </Card>
  );
}
