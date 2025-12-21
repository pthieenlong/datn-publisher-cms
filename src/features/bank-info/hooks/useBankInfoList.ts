import { useCallback, useEffect, useState } from "react";
import { fetchBankInfoList } from "../services/bank-info.service";
import type { BankInfo } from "../types";

interface UseBankInfoListOptions {
  enabled?: boolean;
}

interface UseBankInfoListReturn {
  bankInfoList: BankInfo[];
  isLoading: boolean;
  errorMessage: string | null;
  refetch: () => Promise<void>;
}

export function useBankInfoList(
  options: UseBankInfoListOptions = {}
): UseBankInfoListReturn {
  const { enabled = true } = options;

  const [bankInfoList, setBankInfoList] = useState<BankInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadBankInfoList = useCallback(
    async (signal?: AbortSignal) => {
      if (!enabled) {
        return;
      }

      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await fetchBankInfoList(signal);
        setBankInfoList(response.data);
      } catch (error) {
        if ((error as Error)?.name === "CanceledError") {
          return;
        }
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Không thể tải danh sách tài khoản ngân hàng"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [enabled]
  );

  useEffect(() => {
    const controller = new AbortController();
    loadBankInfoList(controller.signal);

    return () => controller.abort();
  }, [loadBankInfoList]);

  const refetch = useCallback(async () => {
    await loadBankInfoList();
  }, [loadBankInfoList]);

  return {
    bankInfoList,
    isLoading,
    errorMessage,
    refetch,
  };
}
