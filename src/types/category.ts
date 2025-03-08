export interface Category {
    categoryId: number;
    categoryName: string;
    categoryPicture: string;
}

export interface CategoriesResponse {
  content: Category[];
  totalPages: number;
}

export interface CategoryFormData {
  categoryName: string;
  file: File | null;
}

export interface ApiErrorResponse {
  message?: string;
}