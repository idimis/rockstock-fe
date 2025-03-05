"use client";

import React, { useState } from "react";
import useCreateCategoryResponse from "@/hooks/useCreateCategoryResponse"; // Import the custom hook
import { CategoryFormData } from "@/interfaces/category"; // Import the category form interface

interface CategoryFormProps {
  closeForm: () => void; // Prop to close the form after successful creation
}

const CategoryForm: React.FC<CategoryFormProps> = ({ closeForm }) => {
  const [categoryName, setCategoryName] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const { createCategory, isLoading, isError, error, data } = useCreateCategoryResponse();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const categoryData: CategoryFormData = {
      categoryName,
      file,
    };

    try {
      await createCategory(categoryData); // Trigger category creation
      alert("Category created successfully!");
      closeForm(); // Close the form on success
    } catch (err) {
      console.error("Error creating category:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Category Name</label>
        <input
          type="text"
          placeholder="Category Name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
        />
      </div>

      <div>
        <label>Category Image</label>
        <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      </div>

      <button type="submit" disabled={isLoading}>
        {isLoading ? "Creating..." : "Create Category"}
      </button>

      {isError && <p>Error: {error?.message}</p>}
      {data && <p>Category created: {data.categoryName}</p>}
    </form>
  );
};

export default CategoryForm;
