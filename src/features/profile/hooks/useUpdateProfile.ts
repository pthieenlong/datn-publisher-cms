import { useCallback, useState } from "react";
import { updateProfile } from "../services/profile.service";
import type { UpdateProfilePayload, UpdateProfileResponse } from "../types";

interface UseUpdateProfileReturn {
  isUpdating: boolean;
  errorMessage: string | null;
  successMessage: string | null;
  updateUserProfile: (
    payload: UpdateProfilePayload
  ) => Promise<UpdateProfileResponse["data"] | null>;
  reset: () => void;
}

export function useUpdateProfile(): UseUpdateProfileReturn {
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const updateUserProfile = useCallback(
    async (
      payload: UpdateProfilePayload
    ): Promise<UpdateProfileResponse["data"] | null> => {
      setIsUpdating(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      try {
        const response = await updateProfile(payload);
        setSuccessMessage(response.message || "Cập nhật thông tin thành công");
        return response.data;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Không thể cập nhật thông tin";
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
    updateUserProfile,
    reset,
  };
}
