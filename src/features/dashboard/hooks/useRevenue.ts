import { useCallback, useEffect, useState } from "react";
import { fetchRevenue } from "../services/dashboard.service";
import type { RevenueData } from "../types";

interface UseRevenueOptions {
  enabled?: boolean;
  groupBy?: "daily" | "weekly" | "monthly" | "yearly";
  startDate?: string;
  endDate?: string;
}

interface UseRevenueReturn {
  revenue: RevenueData | null;
  isLoading: boolean;
  errorMessage: string | null;
  message: string;
  refetch: () => Promise<void>;
}

export function useRevenue(options: UseRevenueOptions = {}): UseRevenueReturn {
  const { enabled = true, groupBy, startDate, endDate } = options;
  const [revenue, setRevenue] = useState<RevenueData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const loadRevenue = useCallback(
    async (signal?: AbortSignal) => {
      if (!enabled) {
        return;
      }
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const result = await fetchRevenue({ groupBy, startDate, endDate }, signal);
        setRevenue(result.data);
        setMessage(result.message || "");
      } catch (error) {
        if ((error as Error)?.name === "CanceledError") {
          return;
        }
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Không thể tải dữ liệu doanh thu"
        );
        setRevenue(null);
      } finally {
        setIsLoading(false);
      }
    },
    [enabled, groupBy, startDate, endDate]
  );

  useEffect(() => {
    const controller = new AbortController();
    loadRevenue(controller.signal);

    return () => controller.abort();
  }, [loadRevenue]);

  const refetch = useCallback(async () => {
    await loadRevenue();
  }, [loadRevenue]);

  return {
    revenue,
    isLoading,
    errorMessage,
    message,
    refetch,
  };
}
