"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useCategories } from "@/hooks/useCategories";
import SkeletonRow from "@/app/dashboard/admin/categories/SkeletonRow";
import Image from "next/image";
import Pagination from "@/components/category/Pagination";
import SearchBar from "@/components/category/SearchBar";
import { MdEdit, MdDelete } from "react-icons/md";
import { useState, useEffect } from "react";

const CategoryTable = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentPage = Number(searchParams.get("page")) || 1;
  const searchQueryFromURL = searchParams.get("search") || "";
  const pageSize = 10;

  const [isFetching, setIsFetching] = useState(true);
  const { data, isLoading } = useCategories(currentPage, pageSize, searchQueryFromURL);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsFetching(false);
    }, 1000);

    if (!isLoading) {
      setIsFetching(false);
      clearTimeout(timeout);
    }

    return () => clearTimeout(timeout);
  }, [isLoading]);

  const updatePage = (page: number) => {
    setIsFetching(true);
    window.location.href = `/dashboard/admin/categories?page=${page}&search=${searchQueryFromURL}`;
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-6 md:mb-0">
        📦 Category Management
        </h2>
        <button className="bg-blue-500 text-white px-6 py-3 text-lg font-medium rounded-lg shadow-md hover:bg-blue-600 transition">
          + Create Category
        </button>
      </div>

      {/* Search Bar - Now aligned to the right but below Create Category */}
      <div className="flex justify-end mb-4">
        <SearchBar basePath="/dashboard/admin/categories"/>
      </div>

      {/* Categories List */}
      <div className="space-y-4 mt-6">
        {isFetching ? (
          Array.from({ length: 10 }).map((_, index) => <SkeletonRow key={index} />)
        ) : (data?.content ?? []).length > 0 ? (
          (data?.content ?? []).map((category) => (
            <div
              key={category.categoryId}
              className="flex items-center justify-between bg-gray-100 p-4 rounded-lg shadow-sm"
            >
              <div className="flex items-center">
                <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={category.categoryPicture}
                    alt={category.categoryName}
                    width={300}
                    height={300}
                    style={{ width: "auto", height: "auto" }} // Ensures aspect ratio is maintained
                    className="object-cover rounded-lg"
                  />
                </div>
                <p className="ml-4 text-lg font-medium text-gray-700">{category.categoryName}</p>
              </div>
              <div className="flex space-x-6"> {/* Added more spacing */}
                <button className="flex items-center gap-2 text-lg md:text-base text-blue-600 hover:text-blue-800 transition">
                  <MdEdit className="text-xl" />
                  <span className="hidden md:inline">Edit</span>
                </button>
                <button className="flex items-center gap-2 text-lg md:text-base text-red-600 hover:text-red-800 transition">
                  <MdDelete className="text-xl" />
                  <span className="hidden md:inline">Delete</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          !isFetching && (
            <div className="text-center text-gray-500 mt-4">
              {searchQueryFromURL ? `No categories found for "${searchQueryFromURL}"` : "No categories available"}
            </div>
          )
        )}
      </div>
      {/* Pagination */}
        <Pagination
        currentPage={currentPage}
        totalPages={data?.totalPages ?? 1}
        onPageChange={updatePage} basePath={"/dashboard/admin/categories"}        />
    </div>
  );
};

export default CategoryTable;