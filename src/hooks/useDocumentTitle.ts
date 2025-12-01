import { useEffect } from "react";

/**
 * Hook để thay đổi title của browser
 * @param title - Title mới cho browser
 * @param restoreOnUnmount - Có khôi phục title cũ khi component unmount không (mặc định: true)
 */
export const useDocumentTitle = (
  title: string,
  restoreOnUnmount: boolean = true
) => {
  useEffect(() => {
    const previousTitle = document.title;

    if (title) {
      document.title = title;
    }

    return () => {
      if (restoreOnUnmount) {
        document.title = previousTitle;
      }
    };
  }, [title, restoreOnUnmount]);
};

/**
 * Utility function để thay đổi title trực tiếp (không cần hook)
 * @param title - Title mới cho browser
 */
export const setDocumentTitle = (title: string) => {
  if (title) {
    document.title = title;
  }
};
