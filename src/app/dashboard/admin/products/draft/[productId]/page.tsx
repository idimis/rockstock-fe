"use client";

import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { fetchProduct, fetchCategories } from "@/components/product/api";
import ProductForm from "@/components/product/ProductForm";
import { Product, Category, ProductStatus } from "@/types/product";
import AccessDenied from "@/components/common/AccessDenied";
import { ToastContainer } from "react-toastify";

const EditDraftProduct = () => {
  const router = useRouter();
  const { productId } = useParams() as { productId: string };

  const [initialValues, setInitialValues] = useState<Partial<Product>>({
    productName: "",
    detail: "",
    price: 0,
    weight: 0,
    productCategory: "",
  });

  const { data: product, isLoading: isProductLoading } = useQuery<Product>({
    queryKey: ["product", productId],
    queryFn: () => fetchProduct(productId),
    enabled: !!productId,
  });

  const { data: categories, isLoading: isCategoriesLoading } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const [isUnauthorized, setIsUnauthorized] = useState(false);

  useEffect(() => {
    if (product) {
      if (product.status !== ProductStatus.DRAFT) {
        console.warn("Unauthorized access: Redirecting to /403...");
        setIsUnauthorized(true);
        setTimeout(() => router.push("/403"), 2000);
        return;
      }

      const matchedCategory = categories?.find((c) => c.categoryName === product.productCategory);

      setInitialValues({
        productName: product.productName || "",
        detail: product.detail || "",
        price: product.price || 0,
        weight: product.weight || 0,
        productCategory: matchedCategory ? String(matchedCategory.categoryId) : "",
      });
    }
  }, [product, categories, router]);

  if (isProductLoading || isCategoriesLoading) return <div>Loading...</div>;

  if (isUnauthorized) return <AccessDenied />;

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <ToastContainer />
      <h2 className="text-3xl text-gray-500 font-semibold mb-4">Edit Product Draft</h2>
      {initialValues.productName ? (
        <ProductForm
          initialValues={initialValues}
          categories={categories || []}
          productId={productId}
        />
      ) : (
        <div>Loading product details...</div>
      )}
    </div>
  );
};

export default EditDraftProduct;