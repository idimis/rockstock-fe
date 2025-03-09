"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useProducts } from "@/hooks/useProducts";
import SkeletonRow from "@/components/product/SkeletonRow";
import Pagination from "@/components/product/common/Pagination";
import SearchBar from "@/components/product/common/SearchBar";
import ProductFilter from "@/components/product/ProductFilter";
import ProductItem from "@/components/product/ProductItem";
import { Product } from "@/types/product";
import { useCreateDraft } from "@/hooks/useCreateDraft";

const ProductTable = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Extract query parameters
  const currentPage = Number(searchParams.get("page")) || 1;
  const searchQuery = searchParams.get("search") || "";
  const categoryId = searchParams.get("category") ? Number(searchParams.get("category")) : null;
  const sortField = searchParams.get("sortField") || "name";
  const sortDirection = searchParams.get("sort") || "asc";
  const pageSize = 10;

  const createDraftMutation = useCreateDraft();
  const { data, isLoading } = useProducts(currentPage, pageSize, searchQuery, categoryId !== null ? categoryId : undefined, sortField, sortDirection);

  const updateQueryParams = (params: Record<string, any>) => {
    const query = new URLSearchParams(searchParams.toString());

    Object.entries(params).forEach(([key, value]) => {
      if (
        value === null || 
        value === "" ||
        (key === "page" && value === 1) || // Remove page=1
        (key === "sortField" && value === "name" && query.get("sort") === "asc") ||
        (key === "sort" && value === "asc" && query.get("sortField") === "name")
      ) {
        query.delete(key);
      } else {
        query.set(key, String(value));
      }
    });

    router.push(`/dashboard/admin/products?${query.toString()}`);
  };

  const handleSearch = (query: string) => {
    updateQueryParams({ search: query, page: 1 });
  };

  const handlePageChange = (page: number) => {
    updateQueryParams({ page });
  };

  const handleFilterChange = (filters: { category?: number | null; sortField?: string; sortDirection?: string }) => {
    updateQueryParams({
      category: filters.category ?? null,
      sortField: filters.sortField || sortField,
      sort: filters.sortDirection || sortDirection,
      page: 1,
    });
  };

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
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
  {/* Filters Section (Aligned Left) */}
  <ProductFilter
    currentSortField={sortField}
    currentSortDirection={sortDirection}
    currentCategory={categoryId}
    handleFilterChange={handleFilterChange}
  />

  {/* Search Bar (Aligned Right) */}
  <div className="w-full md:w-auto flex justify-end">
    <SearchBar basePath="/dashboard/admin/products" onSearch={handleSearch} />
  </div>
</div>

      {/* Products List */}
      <div className="space-y-4 mt-6">
        {isLoading ? (
          Array.from({ length: 10 }).map((_, index) => <SkeletonRow key={index} />)
        ) : (
          (data?.content ?? []).length > 0 ? (
            (data?.content ?? []).map((product: Product) => (
              <ProductItem key={product.productId} product={product} onEdit={() => {}} />
            ))
          ) : (
            <div className="text-center text-gray-500 mt-4">
              {searchQuery ? `No products found for "${searchQuery}"` : "No products available"}
            </div>
          )
        )}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={data?.totalPages ?? 1}
        onPageChange={handlePageChange}
        basePath={"/dashboard/admin/products"}
      />
    </div>
  );
};

export default ProductTable;