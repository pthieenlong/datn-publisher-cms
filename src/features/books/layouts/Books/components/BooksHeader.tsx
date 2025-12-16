import { Typography, Button } from "antd";
import { Plus } from "lucide-react";
import "./BooksHeader.scss";

const { Title, Text } = Typography;

export interface BooksHeaderProps {
  onAddNew: () => void;
}

export default function BooksHeader({ onAddNew }: BooksHeaderProps) {
  return (
    <div className="books-header">
      <div className="books-header__content">
        <Title level={2} className="books-header__title">
          Danh sách Truyện tranh
        </Title>
        <Text className="books-header__description">
          Quản lý và theo dõi tất cả truyện tranh trong hệ thống
        </Text>
      </div>
      <Button
        type="primary"
        icon={<Plus size={20} />}
        onClick={onAddNew}
        className="books-header__add-button"
      >
        Thêm mới
      </Button>
    </div>
  );
}
