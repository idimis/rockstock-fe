import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axiosInstance from "@/utils/axiosInstance";
import { MdClose } from "react-icons/md";
import { Category } from "@/types/category";


const CategoryForm = ({ onClose, onCategoryCreated }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Form validation schema with Yup
  const validationSchema = Yup.object({
    categoryName: Yup.string()
      .required("Category name is required")
      .min(3, "Category name must be at least 3 characters long")
      .max(50, "Category name cannot exceed 50 characters"),
    file: Yup.mixed()
      .required("Image is required")
      .test("fileSize", "File is too large", (value) => value && value.size <= 1048576) // 1 MB
      .test("fileType", "Unsupported file type", (value) => value && ["image/jpeg", "image/png", "image/gif"].includes(value.type)),
  });

  const formik = useFormik({
    initialValues: {
      categoryName: "",
      file: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        const formData = new FormData();
        formData.append("categoryName", values.categoryName);
        formData.append("file", values.file);

        const response = await axiosInstance.post("/api/v1/categories/create", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (response.status === 200) {
          onCategoryCreated(response.data);
          onClose(); // Close the modal after category creation
        }
      } catch (err) {
        if (err.response && err.response.data) {
          setError(err.response.data.message || "Something went wrong");
        } else {
          setError("Failed to create category");
        }
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500">
          <MdClose size={24} />
        </button>
        <h2 className="text-2xl font-semibold mb-4">Create New Category</h2>
        <form onSubmit={formik.handleSubmit}>
          {/* Category Name */}
          <div className="mb-4">
            <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700">
              Category Name
            </label>
            <input
              id="categoryName"
              name="categoryName"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.categoryName}
              className="mt-2 p-2 border w-full rounded"
            />
            {formik.touched.categoryName && formik.errors.categoryName ? (
              <div className="text-red-500 text-sm">{formik.errors.categoryName}</div>
            ) : null}
          </div>

          {/* Image Upload */}
          <div className="mb-4">
            <label htmlFor="file" className="block text-sm font-medium text-gray-700">
              Upload Image
            </label>
            <input
              id="file"
              name="file"
              type="file"
              onChange={(event) => formik.setFieldValue("file", event.currentTarget.files[0])}
              onBlur={formik.handleBlur}
              className="mt-2"
            />
            {formik.touched.file && formik.errors.file ? (
              <div className="text-red-500 text-sm">{formik.errors.file}</div>
            ) : null}
          </div>

          {/* Error Message */}
          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

          {/* Submit Button */}
          <div className="flex justify-between mt-6">
            <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600">
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;