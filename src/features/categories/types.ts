export interface Category {
  id: string;
  title: string;
  slug: string;
}

export interface CategoryResponse {
  httpCode: number;
  success: boolean;
  message: string;
  data: Category[];
}









