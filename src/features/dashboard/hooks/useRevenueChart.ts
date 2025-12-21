import { useCallback, useEffect, useState } from "react";
import { fetchRevenueChart } from "../services/dashboard.service";
import type { RevenueChartData } from "../types";

interface UseRevenueChartOptions {
  enabled?: boolean;
  groupBy?: "daily" | "weekly" | "monthly";
}

interface UseRevenueChartReturn {
  chartData: RevenueChartData[];
  isLoading: boolean;
  errorMessage: string | null;
  message: string;
  refetch: () => Promise<void>;
}

export function useRevenueChart(
  options: UseRevenueChartOptions = {}
): UseRevenueChartReturn {
  const { enabled = true, groupBy } = options;
  const [chartData, setChartData] = useState<RevenueChartData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const loadChartData = useCallback(
    async (signal?: AbortSignal) => {
      if (!enabled) {
        return;
      }
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const result = await fetchRevenueChart({ groupBy }, signal);
        setChartData(result.data);
        setMessage(result.message || "");
      } catch (error) {
        if ((error as Error)?.name === "CanceledError") {
          return;
        }
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Không thể tải dữ liệu biểu đồ doanh thu"
        );
        setChartData([]);
      } finally {
        setIsLoading(false);
      }
    },
    [enabled, groupBy]
  );

  useEffect(() => {
    const controller = new AbortController();
    loadChartData(controller.signal);

    return () => controller.abort();
  }, [loadChartData]);

  const refetch = useCallback(async () => {
    await loadChartData();
  }, [loadChartData]);

  return {
    chartData,
    isLoading,
    errorMessage,
    message,
    refetch,
  };
}
