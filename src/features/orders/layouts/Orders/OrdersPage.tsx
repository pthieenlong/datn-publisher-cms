import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useDocumentTitle } from "@/hooks";
import { useOrders } from "../../hooks/useOrders";
import { OrdersHeader, OrdersList } from "./components";
import "./OrdersPage.scss";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;

export default function OrdersPage() {
  useDocumentTitle("Danh sách Đơn hàng - CMS");
  const navigate = useNavigate();
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const { orders, pagination, isLoading, errorMessage } = useOrders();

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
      <OrdersHeader />

      <OrdersList
        orders={orders}
        isLoading={isLoading}
        errorMessage={errorMessage}
        pagination={pagination}
        page={page}
        pageSize={pageSize}
        onPaginationChange={handlePaginationChange}
        onViewDetail={handleViewDetail}
      />
    </div>
  );
}
