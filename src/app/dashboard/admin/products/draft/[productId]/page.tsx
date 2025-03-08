"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import axiosInstance from "@/utils/axiosInstance";
import Select from "react-select";
import { useCategories } from "@/hooks/useCategories";
import { Product, Category, ProductStatus } from "@/types/product";
import { FiTrash, FiUploadCloud } from "react-icons/fi";
import { toast } from "react-toastify";

const ProductDraftForm = () => {
  const params = useParams();
  const productId = params?.productId as string;
  const router = useRouter();
  const { data: categoryData, isLoading } = useCategories(1, 100, "");

  const [productData, setProductData] = useState<Product | null>(null);
  const [isSubmitting, setSubmitting] = useState(false);
  const [localProductPictures, setLocalProductPictures] = useState<(string | null)[]>([null, null, null]);
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  
  const fetchProducts = async () => {
    try {
      const response = await axiosInstance.get<Product>(`/products/${productId}`);
      const product = response.data;
      setProductData(product);

      if (product.status !== ProductStatus.DRAFT) {
        console.warn("Unauthorized access: Redirecting to /403...");
        setIsUnauthorized(true);
        setTimeout(() => router.push("/403"), 2000);
        return;
      }
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  };
  
  useEffect(() => {
    if (productId && !productData) {
      console.log("Fetching product data for ID:", productId);
      fetchProducts();
    }
  }, [productId]);

  const validationSchema = Yup.object({
    productName: Yup.string()
      .required("Required")
      .min(3, "Must be at least 3 characters")
      .max(30, "Maximum 30 characters")
      .notOneOf(["Draft Product"], "Cannot be 'Draft Product'"),
    detail: Yup.string()
      .required("Required")
      .min(3, "Must be at least 3 characters")
      .max(100, "Maximum 100 characters")
      .notOneOf(["This is a draft product."], "Cannot be 'This is a draft product.'"),
    price: Yup.number()
      .required("Required")
      .typeError("Price must be a number")
      .moreThan(0, "Price must be greater than 0"),
    weight: Yup.number()
      .required("Required")
      .typeError("Weight must be a number")
      .moreThan(0, "Weight must be greater than 0"),
    productCategory: Yup.string()
      .required("Category is required"),
    productPictures: Yup.array()
      .nullable()
      .default([])
      .test("at-least-one-image", "At least one image is required", (value) =>
        Array.isArray(value) && value.some((pic) => pic !== null)
      ),
  });

  const formatNumber = (value: string | number) => {
    if (!value) return "";
    return new Intl.NumberFormat("id-ID").format(Number(value));
  };
  
  const parseNumber = (value: string) => {
    return value.replace(/\D/g, "");
  };

  const formik = useFormik({
    initialValues: {
      productName: productData?.productName || "",
      detail: productData?.detail || "",
      price: productData?.price || "",
      weight: productData?.weight || "",
      productCategory: productData?.categoryId ? String(productData.categoryId) : "",
      productPictures: productData?.productPictures?.map((pic) => pic.productPictureUrl) || [null, null, null], // Ensure array initialization
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        await axiosInstance.patch(`/products/${productId}/create`, values);
        const response = await axiosInstance.get<Product>(`/products/${productId}`);
        setProductData(response.data);
        router.push("/dashboard/admin/products");
      } catch (error) {
        console.error("Error creating product:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });
  
  useEffect(() => {
    if (productData) {
      const initialPictures: (string | null)[] = [null, null, null];
      
      if (productData.productPictures && Array.isArray(productData.productPictures)) {
        productData.productPictures.forEach((pic) => {
          if (pic.position >= 1 && pic.position <= 3) {
            initialPictures[pic.position - 1] = pic.productPictureUrl;
          }
        });
      }

      setLocalProductPictures(initialPictures); // Set local state for pictures
      formik.setFieldValue("productPictures", initialPictures);
    }
  }, [productData]);

  const handleUploadPicture = async (position: number) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();
  
    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;
  
      try {
        setSubmitting(true);
        const formData = new FormData();
        formData.append("file", file);
  
        await axiosInstance.post(`/pictures/${productId}/${position}/upload`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const newPictures = [...localProductPictures];
        newPictures[position - 1] = URL.createObjectURL(file); // Temporarily set the uploaded image URL
        setLocalProductPictures(newPictures);  // Update local state
        formik.setFieldValue("productPictures", newPictures); // Update Formik state

        toast.success("Picture uploaded successfully!");
      } catch (error) {
        toast.error("Failed to upload picture");
      } finally {
        setSubmitting(false);
      }
    };
  };
  
  const handleDeletePicture = async (position: number) => {
    try {
      setSubmitting(true);
  
      await axiosInstance.delete(`/pictures/${productId}/${position}/delete`);

      const newPictures = [...localProductPictures];
      newPictures[position - 1] = null; // Set the deleted picture slot to null
      setLocalProductPictures(newPictures); // Update local state
      formik.setFieldValue("productPictures", newPictures); // Update Formik state

      toast.success("Picture deleted successfully!");
    } catch (error) {
      toast.error("Error deleting picture");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    try {
      const draftValues = { ...formik.values, categoryId: formik.values.productCategory };
      const { productCategory, ...finalValues } = draftValues;
      await axiosInstance.patch(`/products/${productId}/draft`, finalValues);
      router.push("/dashboard/admin/products");
    } catch (error) {
      console.error("Error saving draft:", error);
    }
  };

  const handleCancel = () => {
    setShowCancelModal(true); // Show modal
  };

  const handleDeleteProduct = async () => {
    try {
      await axiosInstance.delete(`/products/${productId}/delete`);
      router.push("/dashboard/admin/products");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-semibold mb-4">📝 Edit Draft Product</h2>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {/* Product Name */}
        <div>
          <label className="block text-gray-700 font-semibold">Product Name</label>
          <input
            type="text"
            className="w-full p-2 border rounded text-gray-500"
            {...formik.getFieldProps("productName")}
          />
          {formik.touched.productName && formik.errors.productName && (
            <div className="text-red-500">{formik.errors.productName}</div>
          )}
        </div>

        {/* Detail */}
        <div>
          <label className="block text-gray-700 font-semibold">Detail</label>
          <textarea className="w-full p-2 border rounded text-gray-500" {...formik.getFieldProps("detail")} />
          {formik.touched.detail && formik.errors.detail && (
            <div className="text-red-500">{formik.errors.detail}</div>
          )}
        </div>

        {/* Price */}
        <div>
          <label className="block text-gray-700 font-semibold">Price</label>
          <div className="flex items-center border rounded w-full p-2">
            <span className="mr-2 text-gray-600">Rp.</span>
            <input
              type="text"
              className="w-full text-gray-600 outline-none"
              value={formatNumber(formik.values.price)}
              onChange={(e) => {
                const cleanedValue = parseNumber(e.target.value);
                formik.setFieldValue("price", cleanedValue);
              }}
            />
          </div>
          {formik.touched.price && formik.errors.price && (
            <div className="text-red-500">{formik.errors.price}</div>
          )}
        </div>

        {/* Weight */}
        <div>
          <label className="block text-gray-700 font-semibold">Weight</label>
          <div className="flex items-center border rounded w-full p-2">
          <input
            type="text"
            className="w-full text-gray-600 outline-none"
            value={formatNumber(formik.values.weight)}
            onChange={(e) => {
              const cleanedValue = parseNumber(e.target.value);
              formik.setFieldValue("weight", cleanedValue);
            }}
          />
            <span className="ml-2 text-gray-600">grams</span>
          </div>
          {formik.touched.weight && formik.errors.weight && (
            <div className="text-red-500">{formik.errors.weight}</div>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-gray-700">Category</label>

          {isLoading ? (
            <div className="p-2 border rounded bg-gray-200 animate-pulse h-10 w-full"></div>
          ) : (
            <Select
              options={categoryData?.content?.map((cat: Category) => ({
                value: cat.categoryId,
                label: cat.categoryName,
              })) || []}
              value={
                categoryData?.content
                  ?.map((cat) => ({ value: cat.categoryId, label: cat.categoryName }))
                  ?.find((option) => option.value === Number(formik.values.productCategory)) || null
              }
              onChange={(selectedOption) => formik.setFieldValue("productCategory", selectedOption?.value || "")}
              isSearchable
              isDisabled={!categoryData?.content}
              className="text-gray-500"
            />
          )}

          {formik.touched.productCategory && formik.errors.productCategory && (
            <div className="text-red-500">{formik.errors.productCategory}</div>
          )}
        </div>

      {/* Product Pictures */}
      <div>
        <label className="block text-gray-700 font-semibold">Product Pictures</label>
        <div className="flex flex-wrap gap-2 md:flex-nowrap">
        {localProductPictures.map((pic, position) => (
            <div key={position} className="relative w-24 h-24 border rounded flex items-center justify-center bg-gray-100">
              {pic ? (
                <>
                  <img
                    src={pic}
                    alt={`Product ${position + 1}`}
                    className="w-full h-full object-cover rounded"
                  />
                  <button
                    type="button"
                    className={`absolute top-1 right-1 p-1 text-white rounded-full transition ${
                      isSubmitting ? "bg-red-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
                    }`}
                    onClick={() => handleDeletePicture(position + 1)}
                    disabled={isSubmitting}
                  >
                    <FiTrash className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className={`absolute top-1 right-1 p-1 text-gray-700 rounded-full transition ${
                    isSubmitting ? "bg-gray-300 cursor-not-allowed" : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  onClick={() => handleUploadPicture(position + 1)}
                  disabled={isSubmitting}
                >
                  <FiUploadCloud className="w-6 h-6" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

        <div className="flex space-x-4">
          {/* Create Product Button */}
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
            disabled={isSubmitting || !formik.isValid || !formik.dirty}
          >
            {isSubmitting ? "Creating..." : "Create Product"}
          </button>

          {/* Cancel Button */}
          <button
            type="button"
            onClick={handleCancel}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>


{/* Cancel Confirmation Modal */}
{showCancelModal && (
  <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-xl w-96">
      <h3 className="text-xl font-semibold mb-4">Do you want to save your draft?</h3>

      {/* Save Draft Button */}
      <button
        type="button"  // Prevent form submission
        onClick={handleSaveDraft}
        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 w-full mb-3"
      >
        Save Draft
      </button>

      {/* No, Delete Product Button */}
      <button
        onClick={handleDeleteProduct}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full mb-3"
      >
        No, Delete Product
      </button>

      {/* Cancel Button */}
      <button
        onClick={() => setShowCancelModal(false)}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
      >
        Cancel
      </button>
    </div>
  </div>
)}

      </form>
    </div>
  );
};

export default ProductDraftForm;