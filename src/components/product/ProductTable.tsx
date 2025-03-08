"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useProducts } from "@/hooks/useProducts";
import SkeletonRow from "@/components/product/SkeletonRow";
import Pagination from "@/components/product/Pagination";
import SearchBar from "@/components/product/SearchBar";
import ProductFilter from "@/components/product/ProductFilter";
import ProductItem from "@/components/product/ProductItem";
import { Product } from "@/types/product";
import { useCreateDraft } from "@/hooks/useCreateDraft";

const ProductTable = () => {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const searchQueryFromURL = searchParams.get("search") || "";
  const pageSize = 10;
  const createDraftMutation = useCreateDraft();

  const [filters, setFilters] = useState({
    category: "",
    sortField: "name",
    sortDirection: "asc",
  });

  const { data, isLoading } = useProducts(
    currentPage,
    pageSize,
    searchQueryFromURL,
    filters
  );

  const [isFetching, setIsFetching] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    setIsFetching(isLoading);
    console.log("Filters being sent to the backend:", filters);  // Log the filters object
  }, [isLoading]);

  const updatePage = (page: number) => {
    setIsFetching(true);
    window.location.href = `/dashboard/admin/products?page=${page}&search=${searchQueryFromURL}`;
  };

  const handleFilterChange = (filters: any) => {
    console.log("Filters updated:", filters);  // Log filters before updating state
    setFilters(filters);
  };

  useEffect(() => {
    console.log("Filters being sent to the backend:", filters);  // Log the filters object
  }, [filters]);

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-6 md:mb-0">
          🛍️ Product Management
        </h2>
        <button
          type="button"
          onClick={() => createDraftMutation.mutate()}
          className="bg-blue-500 text-white px-4 py-2 rounded w-48"
          disabled={createDraftMutation.isPending}
        >
          {createDraftMutation.isPending ? "Creating..." : "Create Draft Product"}
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex justify-between items-center mb-6">
        <ProductFilter handleFilterChange={handleFilterChange} />
        <SearchBar basePath="/dashboard/admin/products" />
      </div>

      {/* Products List */}
      <div className="space-y-4 mt-6">
        {isFetching ? (
          Array.from({ length: 10 }).map((_, index) => <SkeletonRow key={index} />)
        ) : (data?.content ?? []).length > 0 ? (
          (data?.content ?? []).map((product) => (
            <ProductItem 
              key={product.productId}
              product={product}
              onEdit={() => {
                setEditingProduct(product);
                setIsModalOpen(true);
              }}
            />
          ))
        ) : (
          !isFetching && (
            <div className="text-center text-gray-500 mt-4">
              {searchQueryFromURL ? `No products found for "${searchQueryFromURL}"` : "No products available"}
            </div>
          )
        )}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={data?.totalPages ?? 1}
        onPageChange={updatePage} 
        basePath={"/dashboard/admin/products"}
      />
    </div>
  );
};

export default ProductTable;