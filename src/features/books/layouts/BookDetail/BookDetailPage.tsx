/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Row,
  Col,
  Typography,
  Button,
  Tag,
  Space,
  Card,
  Statistic,
  Alert,
  Spin,
  Form,
  Input,
  InputNumber,
  Select,
  Switch,
  message,
} from "antd";
import {
  ArrowLeft,
  Trash2,
  Eye,
  BookOpen,
  Heart,
  DollarSign,
} from "lucide-react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import ChapterList from "../../components/ChapterList";
import "./BookDetailPage.scss";
import { useDocumentTitle } from "@/hooks";
import { useBookDetail } from "../../hooks/useBookDetail";
import { useCategories } from "@/features/categories";
import { updateBookDetail } from "../../services/books.service";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

function BookDetailPage() {
  const { slug } = useParams({ from: "/books/$slug" });
  const navigate = useNavigate();
  const {
    book,
    isLoading,
    errorMessage,
    currentChapters,
    chapterPage,
    chapterPageSize,
    chapterTotalPages,
    setChapterPage,
    refetch,
  } = useBookDetail({ slug });
  const [quickEditForm] = Form.useForm();
  const [isQuickSaving, setIsQuickSaving] = useState(false);
  const {
    categories,
    isLoading: loadingCategories,
    errorMessage: categoriesError,
  } = useCategories();

  useDocumentTitle(
    book
      ? `${book.title} - Chi tiết Truyện tranh - CMS`
      : "Chi tiết Truyện tranh - CMS"
  );

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

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

  const getStatusTag = (status?: string) => {
    const statusMap: Record<string, { color: string; text: string }> = {
      PUBLISHED: { color: "success", text: "Đã xuất bản" },
      DRAFT: { color: "default", text: "Nháp" },
      ARCHIVED: { color: "warning", text: "Đã lưu trữ" },
    };
    if (!status) {
      return statusMap.DRAFT;
    }
    return statusMap[status] ?? statusMap.DRAFT;
  };

  const handleBack = () => {
    navigate({ to: "/books" });
  };

  const handleChapterPageChange = (page: number) => {
    setChapterPage(page);
  };

  const statusInfo = getStatusTag(book?.status);

  useEffect(() => {
    if (!book) {
      quickEditForm.resetFields();
      return;
    }
    quickEditForm.setFieldsValue({
      title: book.title,
      slug: book.slug,
      description: book.description,
      author: book.author,
      policy: book.policy,
      status: book.status,
      price: book.price,
      salePercent: book.salePercent,
      isFree: book.isFree,
      isOnSale: book.isOnSale,
    });
  }, [book, quickEditForm]);

  const handleQuickEditSubmit = async (values: any) => {
    setIsQuickSaving(true);
    try {
      const payload = {
        title: values.title,
        author: values.author,
        description: values.description,
        isFree: values.isFree,
        isOnSale: values.isOnSale,
        price: values.price,
        salePercent: values.salePercent,
        categories: values.categories,
      };
      const response = await updateBookDetail(slug, payload);
      message.success(response.message || "Cập nhật truyện thành công");
      await refetch();
    } catch (error: unknown) {
      console.error(error);
      message.error("Không thể lưu thay đổi");
    } finally {
      setIsQuickSaving(false);
    }
  };

  const resetQuickEditForm = () => {
    if (!book) {
      quickEditForm.resetFields();
      return;
    }
    quickEditForm.setFieldsValue({
      title: book.title,
      slug: book.slug,
      description: book.description,
      author: book.author,
      policy: book.policy,
      status: book.status,
      price: book.price,
      salePercent: book.salePercent,
      isFree: book.isFree,
      isOnSale: book.isOnSale,
    });
  };

  const pricingInfo = useMemo(() => {
    if (!book) {
      return {
        basePrice: 0,
        salePercent: 0,
        salePrice: 0,
        isFree: false,
      };
    }
    const basePrice = book.price;
    const salePercent = book.isOnSale ? book.salePercent : 0;
    const salePrice = book.isFree
      ? 0
      : salePercent > 0
      ? Math.max(0, basePrice - (basePrice * salePercent) / 100)
      : basePrice;
    return {
      basePrice,
      salePercent,
      salePrice,
      isFree: book.isFree,
    };
  }, [book]);

  const stats = useMemo(
    () => [
      {
        title: "Số chương",
        value: book?.chapters.length ?? 0,
        icon: <BookOpen size={20} />,
        color: "#3b82f6",
      },
      {
        title: "Lượt xem",
        value: book?.view ?? 0,
        icon: <Eye size={20} />,
        color: "#22c55e",
      },
      {
        title: "Lượt thích",
        value: book?.likeCount ?? 0,
        icon: <Heart size={20} />,
        color: "#ef4444",
      },
      {
        title: "Giá bán",
        value:
          book?.isFree || pricingInfo.salePrice === 0
            ? "Miễn phí"
            : formatCurrency(pricingInfo.salePrice),
        icon: <DollarSign size={20} />,
        color: "#f97316",
      },
    ],
    [book, pricingInfo, formatCurrency]
  );
  if (loadingCategories) {
    return <Spin tip="Đang tải danh sách thể loại..." />;
  }

  if (categoriesError) {
    message.error(categoriesError);
    return null; // Adjust how you want to handle this
  }
  return (
    <div className="book-detail-page">
      <div className="book-detail-header">
        <Space>
          <Button
            icon={<ArrowLeft size={20} />}
            onClick={handleBack}
            className="book-detail-back-button"
          >
            Quay lại
          </Button>
          <Title level={2} className="book-detail-title">
            Chi tiết Truyện tranh
          </Title>
        </Space>
        <Button onClick={refetch} className="book-detail-refresh">
          Tải lại
        </Button>
      </div>

      <div className="book-detail-actions">
        <Space>
          <Button
            danger
            icon={<Trash2 size={20} />}
            className="book-detail-action-button"
            disabled={!book}
          >
            Xóa
          </Button>
        </Space>
      </div>

      {errorMessage && (
        <Alert
          type="error"
          message="Không thể tải chi tiết truyện"
          description={errorMessage}
          showIcon
          closable
          className="book-detail-error"
        />
      )}

      {isLoading && !book ? (
        <div className="book-detail-loading">
          <Spin tip="Đang tải chi tiết truyện..." />
        </div>
      ) : book ? (
        <>
          <div className="book-detail-stats">
            <Row gutter={[16, 16]}>
              {stats.map((stat) => (
                <Col xs={24} sm={12} lg={6} key={stat.title}>
                  <Card className="book-detail-stat-card">
                    <Statistic
                      title={stat.title}
                      value={stat.value}
                      prefix={stat.icon}
                      valueStyle={{ color: stat.color }}
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          </div>

          <div className="book-detail-info">
            <Card className="book-detail-info-card">
              <Row gutter={[24, 24]}>
                <Col xs={24} md={8}>
                  <div className="book-detail-cover">
                    <img
                      src={book.thumbnail}
                      alt={book.title}
                      className="book-detail-cover-image"
                    />
                  </div>
                </Col>
                <Col xs={24} md={16}>
                  <div className="book-detail-content">
                    <Title level={3} className="book-detail-content-title">
                      {book.title}
                    </Title>
                    <Text className="book-detail-content-slug">
                      {book.slug}
                    </Text>
                    <div className="book-detail-content-description">
                      <Text>{book.description}</Text>
                    </div>
                    <div className="book-detail-content-meta">
                      <div className="book-detail-meta-item">
                        <Text strong>Tác giả:</Text>
                        <Text>{book.author}</Text>
                      </div>
                      <div className="book-detail-meta-item">
                        <Text strong>Chính sách:</Text>
                        <Text>{book.policy || "Chưa thiết lập"}</Text>
                      </div>
                      <div className="book-detail-meta-item">
                        <Text strong>Thể loại:</Text>
                        <Space wrap>
                          {book.categories.map((category) => (
                            <Tag
                              key={category.id}
                              className="book-detail-category-tag"
                            >
                              {category.title}
                            </Tag>
                          ))}
                        </Space>
                      </div>
                      <div className="book-detail-meta-item">
                        <Text strong>Ngày tạo:</Text>
                        <Text>{formatDate(book.createdAt)}</Text>
                      </div>
                      <div className="book-detail-meta-item">
                        <Text strong>Cập nhật:</Text>
                        <Text>{formatDate(book.updatedAt)}</Text>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>
          </div>

          <div className="book-detail-bottom">
            <Row gutter={[16, 16]}>
              <Col xs={24} lg={12}>
                <Card className="book-detail-pricing-card">
                  <Title level={4} className="book-detail-section-title">
                    Thông tin chi phí & Trạng thái
                  </Title>
                  <div className="book-detail-pricing-content">
                    <div className="book-detail-price-item">
                      <Text className="book-detail-price-label">
                        Giá niêm yết:
                      </Text>
                      <Text className="book-detail-price-value book-detail-original-price">
                        {book.isFree
                          ? "Miễn phí"
                          : formatCurrency(pricingInfo.basePrice)}
                      </Text>
                    </div>
                    {pricingInfo.salePercent > 0 && (
                      <div className="book-detail-price-item">
                        <Text className="book-detail-price-label">
                          Giảm giá:
                        </Text>
                        <Text className="book-detail-price-value book-detail-sale-percent">
                          {pricingInfo.salePercent}%
                        </Text>
                      </div>
                    )}
                    <div className="book-detail-price-item">
                      <Text className="book-detail-price-label">
                        Giá bán hiện tại:
                      </Text>
                      <Text className="book-detail-price-value book-detail-sale-price">
                        {book.isFree
                          ? "Miễn phí"
                          : formatCurrency(pricingInfo.salePrice)}
                      </Text>
                    </div>
                    <div className="book-detail-price-item">
                      <Text className="book-detail-price-label">
                        Trạng thái:
                      </Text>
                      <Tag
                        color={statusInfo.color}
                        className="book-detail-status-tag"
                      >
                        {statusInfo.text}
                      </Tag>
                    </div>
                  </div>
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card className="book-detail-chapters-card">
                  <Title level={4} className="book-detail-section-title">
                    Danh sách chương
                  </Title>
                  <ChapterList
                    chapters={currentChapters}
                    bookSlug={book.slug}
                    isLoading={isLoading}
                    page={chapterPage}
                    pageSize={chapterPageSize}
                    total={book.chapters.length}
                    onPageChange={handleChapterPageChange}
                  />
                  <div className="book-detail-chapter-pagination">
                    <Space>
                      <Button
                        size="small"
                        onClick={() => handleChapterPageChange(chapterPage - 1)}
                        disabled={chapterPage <= 1}
                      >
                        Trang trước
                      </Button>
                      <Text>
                        Trang {chapterPage}/{chapterTotalPages || 1}
                      </Text>
                      <Button
                        size="small"
                        onClick={() => handleChapterPageChange(chapterPage + 1)}
                        disabled={chapterPage >= chapterTotalPages}
                      >
                        Trang sau
                      </Button>
                    </Space>
                  </div>
                </Card>
              </Col>
            </Row>
          </div>

          <div className="book-detail-edit">
            <Card className="book-detail-edit-card">
              <Title level={4} className="book-detail-section-title">
                Chỉnh sửa nhanh
              </Title>
              <Form
                layout="vertical"
                form={quickEditForm}
                onFinish={handleQuickEditSubmit}
                disabled={!book}
              >
                <Row gutter={[16, 0]}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Tiêu đề"
                      name="title"
                      rules={[
                        { required: true, message: "Vui lòng nhập tiêu đề" },
                      ]}
                    >
                      <Input placeholder="Nhập tiêu đề truyện..." />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Slug"
                      name="slug"
                      initialValue={book.slug}
                    >
                      <Input disabled />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={[16, 0]}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Tác giả"
                      name="author"
                      rules={[
                        { required: true, message: "Vui lòng nhập tác giả" },
                      ]}
                    >
                      <Input placeholder="Nhập tên tác giả..." />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Trạng thái"
                      name="status"
                      rules={[
                        { required: true, message: "Vui lòng chọn trạng thái" },
                      ]}
                    >
                      <Select placeholder="Chọn trạng thái...">
                        <Option value="DRAFT">Nháp</Option>
                        <Option value="ARCHIVED">Đã lưu trữ</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  label="Mô tả"
                  name="description"
                  initialValue={book.description}
                >
                  <TextArea rows={4} />
                </Form.Item>
                <Form.Item label="Thể loại" name="categories">
                  <Select
                    mode="multiple"
                    placeholder="Chọn thể loại..."
                    className="book-edit-select"
                    value={book.categories.map((category) => category.slug)}
                  >
                    {categories.map((category) => (
                      <Option key={category.id} value={category.slug}>
                        {category.title}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Row gutter={[16, 0]}>
                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Giá niêm yết (VND)"
                      name="price"
                      rules={[
                        { required: true, message: "Vui lòng nhập giá" },
                        {
                          type: "number",
                          min: 0,
                          message: "Giá phải lớn hơn 0",
                        },
                      ]}
                    >
                      <InputNumber
                        style={{ width: "100%" }}
                        formatter={(value) =>
                          `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
                        placeholder="VD: 30.000"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item
                      label="% Giảm giá"
                      name="salePercent"
                      rules={[
                        {
                          type: "number",
                          min: 0,
                          max: 100,
                          message: "Từ 0-100%",
                        },
                      ]}
                    >
                      <InputNumber
                        style={{ width: "100%" }}
                        min={0}
                        max={100}
                        formatter={(value) => `${value}%`}
                        parser={(value) => value!.replace("%", "")}
                        placeholder="VD: 20%"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <div className="book-detail-switch-group">
                      <Form.Item
                        name="isFree"
                        valuePropName="checked"
                        label="Miễn phí"
                      >
                        <Switch />
                      </Form.Item>
                      <Form.Item
                        name="isOnSale"
                        valuePropName="checked"
                        label="Đang giảm giá"
                      >
                        <Switch />
                      </Form.Item>
                    </div>
                  </Col>
                </Row>

                <div className="book-detail-edit-actions">
                  <Space>
                    <Button onClick={resetQuickEditForm} disabled={!book}>
                      Đặt lại
                    </Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={isQuickSaving}
                      disabled={!book}
                    >
                      Lưu thay đổi
                    </Button>
                  </Space>
                </div>
              </Form>
            </Card>
          </div>
        </>
      ) : (
        <Card className="book-detail-empty">
          <Title level={4}>Không tìm thấy truyện</Title>
          <Text>Vui lòng kiểm tra lại đường dẫn hoặc thử tải lại trang.</Text>
        </Card>
      )}
    </div>
  );
}

export default BookDetailPage;
