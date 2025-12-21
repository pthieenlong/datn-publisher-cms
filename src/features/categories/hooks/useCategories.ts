import { useEffect, useState } from "react";
import { fetchCategories } from "../services/category.service";
import type { Category } from "../types";

interface UseCategoriesReturn {
  categories: Category[];
  isLoading: boolean;
  errorMessage: string | null;
}

export function useCategories(): UseCategoriesReturn {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    fetchCategories()
      .then((response) => {
        if (mounted) {
          setCategories(response.data);
        }
      })
      .catch((error) => {
        if (mounted) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Không thể tải danh sách thể loại"
          );
        }
      })
      .finally(() => {
        if (mounted) {
          setIsLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  return {
    categories,
    isLoading,
    errorMessage,
  };
}









