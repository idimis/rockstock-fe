"use client";

import { forwardRef } from "react";
import { Formik, Form, Field, ErrorMessage, FormikProps } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Select from "react-select";
import { Product, Category } from "@/types/product";
import { updateProduct } from "@/components/product/api";
import ProductImageUploader from "@/components/product/ProductImageUploader";
import { ProductFormProps } from "@/types/productFormProps";

const ProductForm = forwardRef<FormikProps<Partial<Product>>, ProductFormProps>(
  ({ initialValues, categories, productId }, ref) => {
    const mutation = useMutation({
      mutationFn: (values: Partial<Product>) => updateProduct({ productId, values }),
      onSuccess: () => toast.success("Product updated successfully!"),
      onError: (error) => {
        toast.error("Failed to update product.");
        console.error(error);
      },
    });

    const formatInputValue = (value: any) => {
      const stringValue = String(value || 0);
      const numericValue = stringValue.replace(/\D/g, "");
      if (numericValue === "") return "0";
      return Number(numericValue).toLocaleString("id-ID");
    };

    const validatePicturePosition = (value: any) => {
      // Check if the value is in the expected format
      if (!value || !value.data || !Array.isArray(value.data)) {
        console.log("No picture data found or data is not an array:", value);
        return false;
      }
    
      // Check if there's a picture in position 1
      const hasPictureInPosition1 = value.data.some((picture: any) => picture.position === 1);
      console.log("Is there a picture in position 1?", hasPictureInPosition1); // Log the result
      return hasPictureInPosition1;
    };
    
    return (
      <Formik
        innerRef={ref}
        enableReinitialize
        validateOnMount
        initialValues={initialValues}
        validationSchema={Yup.object({
          productName: Yup.string()
            .min(3, "Product name must be at least 3 characters long")
            .required("Required")
            .test("not-draft", "Product name cannot be 'Draft Product'", (value: string | undefined) => value !== "Draft Product"),
          detail: Yup.string()
            .min(3, "Details must be at least 3 characters long")
            .required("Required")
            .test("not-draft", "Details cannot be 'This is a draft product.'", (value: string) => value !== "This is a draft product."),
          price: Yup.number()
            .typeError("Price must be a number")
            .positive("Price must be a positive number")
            .required("Required"),
          weight: Yup.number()
            .typeError("Weight must be a number")
            .positive("Weight must be a positive number")
            .required("Required"),
          productCategory: Yup.string().required("Category is required"),
          productImages: Yup.mixed()
            .test("has-picture-in-position-1", "There must be a picture in position 1", validatePicturePosition),
        })}

        onSubmit={(values) => {
          const formattedValues = {
            ...values,
            categoryId: values.productCategory ? Number(values.productCategory) : undefined,
          };
          delete formattedValues.productCategory;
          console.log("Sending data to API:", formattedValues);
          mutation.mutate(formattedValues);
        }}
      >
      {({ values, setFieldValue, isSubmitting, isValid, errors, touched }) => (
        <>
          {console.log("Form Values:", values)}
          {console.log("Validation Errors:", errors)}
          {console.log("Touched Fields:", touched)}
          {console.log("isValid:", isValid)}
          {console.log("isSubmitting:", isSubmitting)}

          <Form className="space-y-4">
            <div>
              <label className="block text-gray-500">Product Name</label>
              <Field
                type="text"
                name="productName"
                className="border p-2 rounded w-1/2 text-gray-500"
              />
              <ErrorMessage name="productName" component="div" className="text-red-500" />
            </div>

            <div>
              <label className="block text-gray-500">Details</label>
              <Field
                type="text"
                name="detail"
                className="border p-2 rounded w-1/2 text-gray-500"
              />
              <ErrorMessage name="detail" component="div" className="text-red-500" />
            </div>

            <div>
              <label className="block text-gray-500">Price</label>
              <Field name="price">
                {({ field, form }: any) => (
                  <input
                    {...field}
                    type="text"
                    className="border p-2 rounded w-1/3 text-gray-500"
                    value={formatInputValue(field.value)}
                    onChange={(e) => {
                      const numericValue = e.target.value.replace(/\D/g, "");
                      form.setFieldValue("price", numericValue ? Number(numericValue) : "");
                    }}
                  />
                )}
              </Field>
              <ErrorMessage name="price" component="div" className="text-red-500" />
            </div>

            <div>
              <label className="block text-gray-500">Weight</label>
              <div className="flex items-center">
                <Field name="weight">
                  {({ field, form }: any) => (
                    <div className="flex items-center">
                      <input
                        {...field}
                        type="text"
                        className="border p-2 rounded w-1/3 text-gray-500"
                        value={formatInputValue(field.value)}
                        onChange={(e) => {
                          const formattedValue = formatInputValue(e.target.value);
                          form.setFieldValue("weight", formattedValue.replace(/\D/g, ""));
                        }}
                      />
                      <span className="ml-2 text-gray-500">grams</span>
                    </div>
                  )}
                </Field>
              </div>
              <ErrorMessage name="weight" component="div" className="text-red-500" />
            </div>

            <div>
              <label className="block text-gray-500">Product Category</label>
              <Select
                options={categories?.map((category) => ({
                  value: category.categoryId,
                  label: category.categoryName,
                }))}
                value={
                  categories
                    ?.map((category) => ({
                      value: category.categoryId,
                      label: category.categoryName,
                    }))
                    .find((option) => option.value === Number(values.productCategory)) || null
                }
                onChange={(selectedOption) => {
                  console.log("Selected Category:", selectedOption);
                  setFieldValue("productCategory", selectedOption?.value || "");
                }}
                className="border p-2 rounded w-1/2 text-gray-500"
                placeholder="Search category..."
              />
              <ErrorMessage name="productCategory" component="div" className="text-red-500" />
            </div>

            <div className="mt-6">
              <h3 className="text-xl text-gray-500 font-semibold mb-2">Product Images</h3>
              <ProductImageUploader productId={productId} />
              <ErrorMessage name="productImages" component="div" className="text-red-500" />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !isValid}
              onClick={() => console.log("Submit button clicked, isValid:", isValid)}
              className={`mt-4 px-4 py-2 text-white bg-blue-500 rounded ${
                isSubmitting || !isValid ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Update Product
            </button>
          </Form>
        </>
      )}
      </Formik>
    );
  }
);

ProductForm.displayName = "ProductForm";

export default ProductForm;