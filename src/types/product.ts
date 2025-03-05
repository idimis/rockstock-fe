export interface Product {
    productId: number;
    productName: string;
    detail: string;
    price: number;
    weight: number;
    totalStock: number;
    productCategory: string;
    productPictures?: { productPictureUrl: string; position: number }[];
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