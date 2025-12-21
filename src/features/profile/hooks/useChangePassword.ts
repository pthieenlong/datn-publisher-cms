import { useCallback, useState } from "react";
import { changePassword } from "../services/profile.service";
import type { ChangePasswordPayload } from "../types";

interface UseChangePasswordReturn {
  isChanging: boolean;
  errorMessage: string | null;
  successMessage: string | null;
  changeUserPassword: (payload: ChangePasswordPayload) => Promise<boolean>;
  reset: () => void;
}

export function useChangePassword(): UseChangePasswordReturn {
  const [isChanging, setIsChanging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const changeUserPassword = useCallback(
    async (payload: ChangePasswordPayload): Promise<boolean> => {
      setIsChanging(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      try {
        const response = await changePassword(payload);
        setSuccessMessage(response.message || "Đổi mật khẩu thành công");
        return true;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Không thể đổi mật khẩu";
        setErrorMessage(message);
        return false;
      } finally {
        setIsChanging(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setErrorMessage(null);
    setSuccessMessage(null);
  }, []);

  return {
    isChanging,
    errorMessage,
    successMessage,
    changeUserPassword,
    reset,
  };
}
