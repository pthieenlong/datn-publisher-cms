import { Row, Col, Card, Typography, Tag, Space, Button, Upload } from "antd";
import { CameraOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import type { BookDetail } from "@/features/books/types";
import "./BookDetailInfo.scss";

const { Title, Text } = Typography;

export interface BookDetailInfoProps {
  book: BookDetail;
  statusColor: string;
  statusText: string;
  onThumbnailChange?: (file: File) => void;
  isUpdatingThumbnail?: boolean;
}

export default function BookDetailInfo({
  book,
  statusColor,
  statusText,
  onThumbnailChange,
  isUpdatingThumbnail = false,
}: BookDetailInfoProps) {
  const formatDate = (dateString?: string | null): string => {
    if (!dateString) {
      return "-";
    }
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  };

  const uploadProps: UploadProps = {
    beforeUpload: (file) => {
      const isImage = file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/jpg";
      if (!isImage) {
        return Upload.LIST_IGNORE;
      }

      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        return Upload.LIST_IGNORE;
      }

      onThumbnailChange?.(file);
      return false;
    },
    showUploadList: false,
    accept: ".jpg,.jpeg,.png",
  };

  return (
    <div className="book-detail-info">
      <Card className="book-detail-info__card">
        <Row gutter={[24, 24]}>
          <Col xs={24} md={8}>
            <div className="book-detail-info__cover">
              <img
                src={book.thumbnail}
                alt={book.title}
                className="book-detail-info__cover-image"
              />
              <div className="book-detail-info__cover-actions">
                <Upload {...uploadProps}>
                  <Button
                    type="primary"
                    icon={<CameraOutlined />}
                    loading={isUpdatingThumbnail}
                    block
                  >
                    Thay đổi ảnh bìa
                  </Button>
                </Upload>
              </div>
            </div>
          </Col>
          <Col xs={24} md={16}>
            <div className="book-detail-info__content">
              <div className="book-detail-info__title-group">
                <Title level={3} className="book-detail-info__title">
                  {book.title}
                </Title>
                <Text className="book-detail-info__slug">{book.slug}</Text>
              </div>

              <div className="book-detail-info__description">
                <Text>{book.description}</Text>
              </div>
              <div className="book-detail-info__meta">
                <div className="book-detail-info__meta-item">
                  <Text strong>Tác giả:</Text>
                  <Text>{book.author}</Text>
                </div>
                <div className="book-detail-info__meta-item">
                  <Text strong>Thể loại:</Text>
                  <Space wrap>
                    {book.categories.map((category) => (
                      <Tag
                        key={category.id}
                        className="book-detail-info__category-tag"
                      >
                        {category.title}
                      </Tag>
                    ))}
                  </Space>
                </div>
                <div className="book-detail-info__meta-item">
                  <Text strong>Trạng thái:</Text>
                  <Tag color={statusColor}>{statusText}</Tag>
                </div>
                <div className="book-detail-info__meta-item">
                  <Text strong>Ngày tạo:</Text>
                  <Text>{formatDate(book.createdAt)}</Text>
                </div>
                <div className="book-detail-info__meta-item">
                  <Text strong>Cập nhật:</Text>
                  <Text>{formatDate(book.updatedAt)}</Text>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
