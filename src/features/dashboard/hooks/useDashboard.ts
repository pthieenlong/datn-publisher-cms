import { useCallback, useEffect, useState } from "react";
import { fetchDashboard } from "../services/dashboard.service";
import type { DashboardData } from "../types";

interface UseDashboardOptions {
  enabled?: boolean;
}

interface UseDashboardReturn {
  dashboard: DashboardData | null;
  isLoading: boolean;
  errorMessage: string | null;
  message: string;
  refetch: () => Promise<void>;
}

export function useDashboard(
  options: UseDashboardOptions = {}
): UseDashboardReturn {
  const { enabled = true } = options;
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const loadDashboard = useCallback(
    async (signal?: AbortSignal) => {
      if (!enabled) {
        return;
      }
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const result = await fetchDashboard(signal);
        setDashboard(result.data);
        setMessage(result.message || "");
      } catch (error) {
        if ((error as Error)?.name === "CanceledError") {
          return;
        }
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Không thể tải dữ liệu dashboard"
        );
        setDashboard(null);
      } finally {
        setIsLoading(false);
      }
    },
    [enabled]
  );

  useEffect(() => {
    const controller = new AbortController();
    loadDashboard(controller.signal);

    return () => controller.abort();
  }, [loadDashboard]);

  const refetch = useCallback(async () => {
    await loadDashboard();
  }, [loadDashboard]);

  return {
    dashboard,
    isLoading,
    errorMessage,
    message,
    refetch,
  };
}


