import { useCallback, useState } from "react";
import { updateBankInfo } from "../services/bank-info.service";
import type { BankInfo, UpdateBankInfoPayload } from "../types";

interface UseUpdateBankInfoReturn {
  isUpdating: boolean;
  errorMessage: string | null;
  successMessage: string | null;
  updateExistingBankInfo: (
    id: string,
    payload: UpdateBankInfoPayload
  ) => Promise<BankInfo | null>;
  reset: () => void;
}

export function useUpdateBankInfo(): UseUpdateBankInfoReturn {
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const updateExistingBankInfo = useCallback(
    async (id: string, payload: UpdateBankInfoPayload): Promise<BankInfo | null> => {
      setIsUpdating(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      try {
        const response = await updateBankInfo(id, payload);
        setSuccessMessage(response.message || "Cập nhật tài khoản ngân hàng thành công");
        return response.data;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Không thể cập nhật tài khoản ngân hàng";
        setErrorMessage(message);
        return null;
      } finally {
        setIsUpdating(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setErrorMessage(null);
    setSuccessMessage(null);
  }, []);

  return {
    isUpdating,
    errorMessage,
    successMessage,
    updateExistingBankInfo,
    reset,
  };
}
