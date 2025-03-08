"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axiosInstance from '@/utils/axiosInstance';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Select from 'react-select';
import Modal from '@/components/common/Modal';
import { Product } from '@/types/product';

interface DraftFormProps {
  productId: string;
}

interface ProductCategory {
  categoryId: number;
  categoryName: string;
  categoryPicture?: string;
}

const validationSchema = Yup.object().shape({
  productName: Yup.string()
    .min(3, 'Minimum 3 characters')
    .notOneOf(['Draft Product'], 'Product name cannot be "Draft Product"')
    .required('Required'),
  detail: Yup.string()
    .min(3, 'Minimum 3 characters')
    .notOneOf(
      ['This is a draft product.'],
      'Detail cannot be the default draft text'
    )
    .required('Required'),
  price: Yup.number()
    .min(1, 'Must be greater than 0')
    .required('Required'),
  weight: Yup.number()
    .min(1, 'Must be greater than 0')
    .required('Required'),
  productCategory: Yup.object().required('Category is required'),
});

const DraftForm = ({ productId }: DraftFormProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [formValues, setFormValues] = useState<any>(null);

  // Fetch product data
  const { data: product, isLoading: productLoading } = useQuery<Product>({
    queryKey: ['product', productId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/products/${productId}`);
      return response.data;
    },
    enabled: !!productId, // Add this to prevent query when productId is undefined
    retry: false,
  });

  if (!productId || productLoading) return <div>Loading product...</div>;

  const { data: categories } = useQuery<ProductCategory[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await axiosInstance.get('/categories');
      // Ensure we return an empty array if content is missing
      return response.data.data?.content || [];
    },
    // Add initialData to prevent undefined state
    initialData: []
  });

  // Update product mutation
  const updateProductMutation = useMutation({
    mutationFn: (values: any) =>
      axiosInstance.patch(`/products/${productId}/create`, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      router.push('/dashboard/admin/products');
    },
  });

  // Save draft mutation
  const saveDraftMutation = useMutation({
    mutationFn: (values: any) =>
      axiosInstance.patch(`/products/${productId}/draft`, values),
    onSuccess: () => {
      router.push('/dashboard/admin/products');
    },
  });

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: () => axiosInstance.delete(`/products/${productId}/delete`),
    onSuccess: () => {
      router.push('/dashboard/admin/products');
    },
  });

  const handleImageUpload = async (position: number, file: File) => {
    try {
      setImageUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      await axiosInstance.post(
        `/pictures/${productId}/${position}/create`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      await queryClient.invalidateQueries({ queryKey: ['product', productId] });
    } catch (error) {
      console.error('Image upload failed:', error);
    } finally {
      setImageUploading(false);
    }
  };

  const handleImageDelete = async (position: number) => {
    try {
      await axiosInstance.delete(`/pictures/${productId}/${position}/delete`);
      await queryClient.invalidateQueries({ queryKey: ['product', productId] });
    } catch (error) {
      console.error('Image delete failed:', error);
    }
  };

  if (!product || !categories) return <div>Loading...</div>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <Formik
        initialValues={{
          productName: product.productName,
          detail: product.detail,
          price: product.price,
          weight: product.weight,
          productCategory: categories.find(
            (c) => c.categoryName === product.productCategory
          ),
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          const payload = {
            ...values,
            productCategory: values.productCategory?.categoryName,
          };
          updateProductMutation.mutate(payload);
        }}
      >
        {({ values, setFieldValue, isValid, isSubmitting }) => {
          // Store form values in state
          useEffect(() => {
            setFormValues(values);
          }, [values]);

          return (
            <Form>
              {/* ... (rest of the form fields remain the same) ... */}

              {/* Form Actions */}
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowCancelModal(true)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    !isValid ||
                    isSubmitting ||
                    updateProductMutation.isPending ||
                    !product.productPictures?.length
                  }
                  className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {updateProductMutation.isPending ? 'Creating...' : 'Create Product'}
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Save Draft?"
      >
        <div className="space-y-4">
          <p>Do you want to save as draft or delete this product?</p>
          <div className="flex justify-end gap-4">
            <button
              onClick={() => {
                if (formValues) {
                  saveDraftMutation.mutate(formValues);
                }
                setShowCancelModal(false);
              }}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Save Draft
            </button>
            <button
              onClick={() => {
                deleteProductMutation.mutate();
                setShowCancelModal(false);
              }}
              className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DraftForm;