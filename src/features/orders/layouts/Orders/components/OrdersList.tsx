import { Alert } from "antd";
import OrderTable from "../../../components/OrderTable";
import type { Order, PaginationMeta } from "@/features/orders/types";
import "./OrdersList.scss";

export interface OrdersListProps {
  orders: Order[];
  isLoading: boolean;
  errorMessage?: string | null;
  pagination?: PaginationMeta | null;
  page: number;
  pageSize: number;
  onPaginationChange: (page: number, pageSize: number) => void;
  onViewDetail: (id: string) => void;
}

export default function OrdersList({
  orders,
  isLoading,
  errorMessage,
  pagination,
  page,
  pageSize,
  onPaginationChange,
  onViewDetail,
}: OrdersListProps) {
  return (
    <div className="orders-list">
      {errorMessage && (
        <Alert
          type="error"
          message="Không thể tải danh sách đơn hàng"
          description={errorMessage}
          showIcon
          className="orders-list__error-alert"
        />
      )}
      <OrderTable
        data={Array.isArray(orders) ? orders : []}
        loading={isLoading}
        pagination={pagination}
        page={page}
        pageSize={pageSize}
        onPaginationChange={onPaginationChange}
        onViewDetail={onViewDetail}
      />
    </div>
  );
}
