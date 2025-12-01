import { useCallback, useEffect, useState } from "react";
import { fetchOrders } from "../services/orders.service";
import type { Order, PaginationMeta } from "../types";

interface UseOrdersOptions {
  enabled?: boolean;
}

interface UseOrdersReturn {
  orders: Order[];
  pagination: PaginationMeta | null;
  isLoading: boolean;
  errorMessage: string | null;
  message: string;
  refetch: () => Promise<void>;
}

export function useOrders(options: UseOrdersOptions = {}): UseOrdersReturn {
  const { enabled = true } = options;
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const loadOrders = useCallback(
    async (signal?: AbortSignal) => {
      if (!enabled) {
        return;
      }
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const result = (await fetchOrders()).data;
        // Đảm bảo data luôn là array

        console.log(result);
        const ordersData = Array.isArray(result.data?.orders)
          ? result.data.orders
          : [];
        setOrders(ordersData);
        setPagination(result.data?.pagination || null);
        setMessage(result.message || "");
      } catch (error) {
        if ((error as Error)?.name === "CanceledError") {
          return;
        }
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Không thể tải danh sách đơn hàng"
        );
        // Đảm bảo orders là array rỗng khi có lỗi
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    },
    [enabled]
  );

  useEffect(() => {
    const controller = new AbortController();
    loadOrders(controller.signal);

    return () => controller.abort();
  }, [loadOrders]);

  const refetch = useCallback(async () => {
    await loadOrders();
  }, [loadOrders]);

  return {
    orders,
    pagination,
    isLoading,
    errorMessage,
    message,
    refetch,
  };
}
