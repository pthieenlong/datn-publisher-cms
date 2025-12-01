import axiosInstance from "@/lib/axios";
import type { CategoryResponse } from "../types";

export async function fetchCategories(): Promise<CategoryResponse> {
  const response = await axiosInstance.get<CategoryResponse>("/category");
  return response.data;
}









