import { useCallback, useState } from "react";
import { uploadAvatar } from "../services/profile.service";

interface UseUploadAvatarReturn {
  isUploading: boolean;
  errorMessage: string | null;
  successMessage: string | null;
  uploadUserAvatar: (file: File) => Promise<string | null>;
  reset: () => void;
}

export function useUploadAvatar(): UseUploadAvatarReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const uploadUserAvatar = useCallback(
    async (file: File): Promise<string | null> => {
      setIsUploading(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      try {
        const response = await uploadAvatar(file);
        setSuccessMessage(response.message || "Upload avatar thành công");
        return response.data.avatarUrl;
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Không thể upload avatar";
        setErrorMessage(message);
        return null;
      } finally {
        setIsUploading(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setErrorMessage(null);
    setSuccessMessage(null);
  }, []);

  return {
    isUploading,
    errorMessage,
    successMessage,
    uploadUserAvatar,
    reset,
  };
}
