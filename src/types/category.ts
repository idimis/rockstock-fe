export interface Category {
    categoryId: number;
    categoryName: string;
    categoryPicture: string;
}

export interface CategoriesResponse {
  content: Category[];
  totalPages: number;
}