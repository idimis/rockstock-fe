export interface Product {
  pictures(pictures: any): unknown;
  categoryId: number;
  productId: number;
  productName: string;
  detail: string;
  price: number;
  weight: number;
  totalStock: number;
  productCategory: string;
  productPictures: { productPictureUrl: string; position: number }[] | null;
  status: ProductStatus;
}

export enum ProductStatus {
  DRAFT = "DRAFT",
  ACTIVE = "ACTIVE",
}

export interface Category {
  categoryId: number;
  categoryName: string;
  categoryPicture: string;
}

export interface ApiResponse {
  content: Product[];
  totalPages: number;
  number: number;
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