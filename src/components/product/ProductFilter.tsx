"use client";

import { Category } from "@/types/category";
import axiosInstance from "@/utils/axiosInstance";
import { useEffect, useState } from "react";
import Select from "react-select";
import { AiOutlineArrowUp, AiOutlineArrowDown } from "react-icons/ai"; // Importing icons for ascending/descending

const ProductFilter = ({ handleFilterChange }: { handleFilterChange: (filters: any) => void }) => {
  const [categories, setCategories] = useState<Category[] | undefined>(undefined);
  const [sortField, setSortField] = useState("name"); // Default sorting by name
  const [sortDirection, setSortDirection] = useState("asc"); // Default ascending order

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/categories");
        setCategories(response.data.data.content);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [field, order] = e.target.value.split("-");
    setSortField(field);
    setSortDirection(order);
    handleFilterChange({ sortField: field, sortDirection: order });
  };

  const handlesortDirectionToggle = (order: string) => {
    if (sortDirection !== order) {
      setSortDirection(order);
      handleFilterChange({ sortField, sortDirection: order });
    }
  };

  return (
    <div className="flex justify-between items-center space-x-4 mt-6">
      {/* Category Filter */}
      <div className="w-64">
        {/* Render the Select if categories are available */}
        {categories && categories.length > 0 ? (
          <Select
            options={categories?.map((category) => ({
              value: category.categoryId, // Use categoryId as the value
              label: category.categoryName, // Display categoryName as the label
            }))}
            className="text-gray-500"
            placeholder="Select category"
            isSearchable
            onChange={(selectedOption) => {
              const selectedCategory = selectedOption ? selectedOption.value : "";
              console.log("Selected Category:", selectedCategory);  // Log selected category
              handleFilterChange({ category: selectedCategory, sortField, sortDirection });
            }}
          />
        ) : (
          <p>No categories available</p>  // Show message if categories are empty or undefined
        )}
      </div>

      {/* Sorting Filter by Name */}
      <div className="w-64">
        <select
          value={`${sortField}-${sortDirection}`}
          onChange={handleSortChange}
          className="border p-2 rounded w-full text-gray-500"
        >
          <option value="productName-asc">Name</option>
          <option value="price-asc">Price</option>
        </select>
      </div>

      {/* Ascending/Descending Toggle */}
      <div className="flex space-x-2">
        <button
          onClick={() => handlesortDirectionToggle("asc")}
          className={`p-2 rounded ${sortDirection === "asc" ? "bg-gray-200" : ""}`}
        >
          <AiOutlineArrowUp className="text-gray-500" />
        </button>
        <button
          onClick={() => handlesortDirectionToggle("desc")}
          className={`p-2 rounded ${sortDirection === "desc" ? "bg-gray-200" : ""}`}
        >
          <AiOutlineArrowDown className="text-gray-500" />
        </button>
      </div>
    </div>
  );
};

export default ProductFilter;
