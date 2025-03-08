import { useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { FaUpload, FaTrash } from "react-icons/fa";

interface ImageUploaderProps {
  productId: number;
  position: number;
  imageUrl: string | null;
  onImageChange: (position: number, newUrl: string | null) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ productId, position, imageUrl, onImageChange }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;

    const formData = new FormData();
    formData.append("file", event.target.files[0]);

    try {
      setIsUploading(true);
      const response = await axiosInstance.post(`/pictures/${productId}/${position}/create`, formData);
      onImageChange(position, response.data.productPictureUrl);
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/pictures/${productId}/${position}/delete`);
      onImageChange(position, null);
    } catch (error) {
      console.error("Failed to delete image:", error);
    }
  };

  return (
    <div className="relative w-32 h-32 border border-gray-300 rounded-lg flex items-center justify-center">
      {imageUrl ? (
        <>
          <img src={imageUrl} alt={`Product Image ${position}`} className="w-full h-full object-cover rounded-lg" />
          <button
            type="button"
            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
            onClick={handleDelete}
          >
            <FaTrash />
          </button>
        </>
      ) : (
        <>
          <label className="flex flex-col items-center justify-center cursor-pointer">
            <FaUpload className="text-gray-500 text-2xl" />
            <input type="file" className="hidden" onChange={handleUpload} />
          </label>
          {isUploading && <p className="absolute bottom-1 text-sm text-gray-500">Uploading...</p>}
        </>
      )}
    </div>
  );
};

export default ImageUploader;