import { Card, Typography, Button, Space } from "antd";
import { Plus } from "lucide-react";
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
  onCreateChapter: () => void;
  onRefresh?: () => void;
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
  onCreateChapter,
  onRefresh,
}: BookDetailChaptersProps) {
  return (
    <Card className="book-detail-chapters">
      <div className="book-detail-chapters__header">
        <Title level={4} className="book-detail-chapters__title">
          Danh sách chương
        </Title>
        <Button
          type="primary"
          icon={<Plus size={16} />}
          onClick={onCreateChapter}
          className="book-detail-chapters__create-button"
        >
          Tạo chương mới
        </Button>
      </div>
      <ChapterList
        chapters={chapters}
        bookSlug={bookSlug}
        isLoading={isLoading}
        page={page}
        pageSize={pageSize}
        total={totalChapters}
        onPageChange={onPageChange}
        onRefresh={onRefresh}
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
