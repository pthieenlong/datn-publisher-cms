import { useCallback, useEffect, useState } from "react";
import { fetchOrderDetail } from "../services/orders.service";
import type { OrderDetail } from "../types";

interface UseOrderDetailOptions {
  orderId?: string;
  enabled?: boolean;
}

interface UseOrderDetailReturn {
  order: OrderDetail | null;
  message: string;
  isLoading: boolean;
  errorMessage: string | null;
  refetch: () => Promise<void>;
}

export function useOrderDetail(
  options: UseOrderDetailOptions = {}
): UseOrderDetailReturn {
  const { orderId, enabled = true } = options;
  const normalizedOrderId = orderId?.trim() ?? "";

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadOrderDetail = useCallback(
    async (signal?: AbortSignal) => {
      if (!enabled || !normalizedOrderId) {
        return;
      }
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const response = await fetchOrderDetail(normalizedOrderId, signal);
        setOrder(response.data ?? null);
        setMessage(response.message ?? "");
      } catch (error) {
        if ((error as Error)?.name === "CanceledError") {
          return;
        }
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Không thể tải chi tiết đơn hàng"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [enabled, normalizedOrderId]
  );

  useEffect(() => {
    const controller = new AbortController();
    loadOrderDetail(controller.signal);

    return () => controller.abort();
  }, [loadOrderDetail]);

  const refetch = useCallback(async () => {
    await loadOrderDetail();
  }, [loadOrderDetail]);

  return {
    order,
    message,
    isLoading,
    errorMessage,
    refetch,
  };
}


