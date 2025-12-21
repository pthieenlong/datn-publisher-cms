import { useCallback, useState } from "react";
import { createBankInfo } from "../services/bank-info.service";
import type { BankInfo, CreateBankInfoPayload } from "../types";

interface UseCreateBankInfoReturn {
  isCreating: boolean;
  errorMessage: string | null;
  successMessage: string | null;
  createNewBankInfo: (payload: CreateBankInfoPayload) => Promise<BankInfo | null>;
  reset: () => void;
}

export function useCreateBankInfo(): UseCreateBankInfoReturn {
  const [isCreating, setIsCreating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const createNewBankInfo = useCallback(
    async (payload: CreateBankInfoPayload): Promise<BankInfo | null> => {
      setIsCreating(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      try {
        const response = await createBankInfo(payload);
        setSuccessMessage(response.message || "Thêm tài khoản ngân hàng thành công");
        return response.data;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Không thể thêm tài khoản ngân hàng";
        setErrorMessage(message);
        return null;
      } finally {
        setIsCreating(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setErrorMessage(null);
    setSuccessMessage(null);
  }, []);

  return {
    isCreating,
    errorMessage,
    successMessage,
    createNewBankInfo,
    reset,
  };
}
