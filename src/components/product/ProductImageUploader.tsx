import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { FaUpload, FaTrash } from "react-icons/fa";
import axiosInstance from "@/utils/axiosInstance";
import { ProductImageUploaderProps } from "@/types/productImageUploaderProps";

const ProductImageUploader = ({ productId }: ProductImageUploaderProps) => {
  const [images, setImages] = useState<
    { position: number; productPictureUrl: string | null; pictureId: number | null }[] 
  >([]);
  const [loading, setLoading] = useState<{ [key: number]: boolean }>({});
  const [fetching, setFetching] = useState<boolean>(false);

  const fetchImages = useCallback(async () => {
    setFetching(true);
    try {
      const response = await axiosInstance.get(`/pictures/${productId}`);
      
      const updatedImages = [1, 2, 3].map((position) =>
        response.data.data.find((img: any) => img.position === position) || {
          pictureId: null,
          productPictureUrl: null,
          position,
        }
      );
      
      setImages(updatedImages);
    } catch (error) {
      console.error("Failed to load images", error);
    } finally {
      setFetching(false);
    }
  }, [productId, setImages]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);
  

  const handleUpload = async (position: number, file: File) => {
    setLoading((prev) => ({ ...prev, [position]: true })); // Disable button
    try {
      const formData = new FormData();
      formData.append("file", file);

      await axiosInstance.post(`/pictures/${productId}/${position}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(`Picture ${position} uploaded successfully!`);
      await fetchImages();
    } catch (error) {
      toast.error("Failed to upload picture");
      console.error(error);
    } finally {
      setLoading((prev) => ({ ...prev, [position]: false })); // Re-enable button
    }
  };

  const handleFileChange = (position: number, event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
  
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Only .jpeg, .jpg, .png, .gif files are allowed.");
        return;
      }
  
      const maxSize = 1 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error("File size must be less than 1MB.");
        return;
      }
  
      handleUpload(position, file);
    }
  };  

  const handleDelete = async (position: number, pictureId: number | null) => {
    if (!pictureId) return;
  
    setImages((prevImages) => prevImages.filter((img) => img.position !== position));
  
    setLoading((prev) => ({ ...prev, [position]: true }));
    try {
      await axiosInstance.delete(`/pictures/${productId}/${pictureId}/delete`);
      toast.success("Picture deleted successfully!");
      await fetchImages();
    } catch (error) {
      toast.error("Failed to delete picture");
      console.error(error);
    } finally {
      setLoading((prev) => ({ ...prev, [position]: false }));
    }
  };

  return (
    <div className="flex md:flex-row flex-col gap-2 md:h-40 w-2/3 md:w-1/2">
      {[1, 2, 3].map((position) => {
        const image = images.find((img) => img.position === position);
        const isLoading = loading[position] || false;

        return (
          <div key={position} className="h-100 md:w-full md:h-full relative rounded-lg p-2 flex flex-col items-center justify-center">
            <div className="h-40 w-full md:h-full flex justify-center items-center bg-gray-200 rounded-lg">
              {fetching || isLoading ? (
                <div className="w-full h-full bg-gray-300 animate-pulse rounded-lg"></div>
              ) : image?.productPictureUrl ? (
                <img
                  src={image.productPictureUrl}
                  alt={`Product image ${position}`}
                  className="w-full h-full object-contain rounded-lg"
                />
              ) : (
                <span className="text-gray-500 text-xl">No picture yet</span>
              )}
            </div>

            {/* Buttons */}
            <div className="absolute top-2 right-2 flex space-x-2">

              {!image?.productPictureUrl && (
                <label
                  className={`cursor-pointer ${isLoading ? "opacity-50 cursor-not-allowed" : ""} bg-blue-500 text-white p-1 rounded-full hover:bg-blue-700`}
                >
                  <FaUpload size={16} />
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => handleFileChange(position, e)}
                    disabled={isLoading}
                  />
                </label>
              )}

              {image?.productPictureUrl && (
                <button
                  onClick={() => handleDelete(position, image.pictureId)}
                  className={`bg-red-500 text-white p-1 rounded-full hover:bg-red-700 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={isLoading}
                >
                  <FaTrash size={16} />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductImageUploader;