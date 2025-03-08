"use client";

import axiosInstance from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { ApiResponse } from "@/types/product";

export const useProducts = (page: number, pageSize: number, searchQuery?: string, filters?: { category: string, sortField: string, sortDirection: string }) => {
  return useQuery<ApiResponse>({
    queryKey: ["products", page, pageSize, searchQuery, filters],
    queryFn: async () => {
      const { category, sortField, sortDirection } = filters || {};
      const response = await axiosInstance.get("/products/active", {
        params: {
          page: page - 1,
          size: pageSize,
          name: searchQuery || undefined,
          category: category || undefined,
          sortField: sortField || "name",
          sortDirection: sortDirection || "asc",
        },
      });
      return response.data;
    },
  });
};