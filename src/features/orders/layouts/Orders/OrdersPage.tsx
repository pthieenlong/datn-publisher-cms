import { useState } from "react";
import { Typography, Alert } from "antd";
import { useNavigate } from "@tanstack/react-router";
import OrderTable from "@/features/orders/components/OrderTable";
import "./OrdersPage.scss";
import { useDocumentTitle } from "@/hooks";
import { useOrders } from "@/features/orders/hooks/useOrders";

const { Title, Text } = Typography;

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;

function OrdersPage() {
  useDocumentTitle("Danh sách Đơn hàng - CMS");
  const navigate = useNavigate();
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const { orders, pagination, isLoading, errorMessage, refetch } = useOrders();

  const handlePaginationChange = (nextPage: number, nextPageSize: number) => {
    setPage(nextPage);
    setPageSize(nextPageSize);
  };

  const handleViewDetail = (id: string) => {
    navigate({
      to: "/orders/$orderId",
      params: { orderId: id },
    });
  };

  return (
    <div className="orders-page">
      {/* Page Header */}
      <div className="orders-header">
        <div className="orders-header-content">
          <Title level={2} className="orders-title">
            Danh sách Đơn hàng
          </Title>
          <Text className="orders-description">
            Quản lý và theo dõi tất cả đơn hàng trong hệ thống
          </Text>
        </div>
      </div>

      {/* Order Table */}
      <div className="orders-table-container">
        {errorMessage && (
          <Alert
            type="error"
            message="Không thể tải danh sách đơn hàng"
            description={errorMessage}
            showIcon
            className="orders-error-alert"
          />
        )}
        <OrderTable
          data={Array.isArray(orders) ? orders : []}
          loading={isLoading}
          pagination={pagination}
          page={page}
          pageSize={pageSize}
          onPaginationChange={handlePaginationChange}
          onViewDetail={handleViewDetail}
        />
      </div>
    </div>
  );
}

export default OrdersPage;
