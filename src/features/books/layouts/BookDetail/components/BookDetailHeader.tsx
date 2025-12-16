import { Typography, Button, Space } from "antd";
import { ArrowLeft, Trash2 } from "lucide-react";
import "./BookDetailHeader.scss";

const { Title } = Typography;

export interface BookDetailHeaderProps {
  onBack: () => void;
  onRefetch: () => void;
  onDelete: () => void;
  isBookLoaded: boolean;
}

export default function BookDetailHeader({
  onBack,
  onRefetch,
  onDelete,
  isBookLoaded,
}: BookDetailHeaderProps) {
  return (
    <>
      <div className="book-detail-header">
        <Space>
          <Button
            icon={<ArrowLeft size={20} />}
            onClick={onBack}
            className="book-detail-header__back-button"
          >
            Quay lại
          </Button>
          <Title level={2} className="book-detail-header__title">
            Chi tiết Truyện tranh
          </Title>
        </Space>
        <Button onClick={onRefetch} className="book-detail-header__refresh">
          Tải lại
        </Button>
      </div>

      <div className="book-detail-header__actions">
        <Space>
          <Button
            danger
            icon={<Trash2 size={20} />}
            className="book-detail-header__action-button"
            disabled={!isBookLoaded}
            onClick={onDelete}
          >
            Xóa
          </Button>
        </Space>
      </div>
    </>
  );
}
