import { useCallback, useState } from "react";
import { deleteBankInfo } from "../services/bank-info.service";

interface UseDeleteBankInfoReturn {
  isDeleting: boolean;
  errorMessage: string | null;
  successMessage: string | null;
  deleteExistingBankInfo: (id: string) => Promise<boolean>;
  reset: () => void;
}

export function useDeleteBankInfo(): UseDeleteBankInfoReturn {
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const deleteExistingBankInfo = useCallback(
    async (id: string): Promise<boolean> => {
      setIsDeleting(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      try {
        const response = await deleteBankInfo(id);
        setSuccessMessage(response.message || "Xóa tài khoản ngân hàng thành công");
        return true;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Không thể xóa tài khoản ngân hàng";
        setErrorMessage(message);
        return false;
      } finally {
        setIsDeleting(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setErrorMessage(null);
    setSuccessMessage(null);
  }, []);

  return {
    isDeleting,
    errorMessage,
    successMessage,
    deleteExistingBankInfo,
    reset,
  };
}
