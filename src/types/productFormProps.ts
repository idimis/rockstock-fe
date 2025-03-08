import { Category, Product } from "@/types/product";

export interface ProductFormProps {
  initialValues: Partial<Product>;
  categories: Category[];
  productId: string;
}
