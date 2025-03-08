import axiosInstance from "@/utils/axiosInstance";
import { useRouter } from "next/navigation";

interface CancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: number | null;
}

const CancelModal: React.FC<CancelModalProps> = ({ isOpen, onClose, productId }) => {
  const router = useRouter();

  if (!isOpen || productId === null) return null;

  const handleSaveDraft = async () => {
    await axiosInstance.patch(`/products/${productId}/draft`);
    router.push("/dashboard/admin/products");
  };

  const handleDeleteDraft = async () => {
    await axiosInstance.delete(`/products/${productId}/delete`);
    router.push("/dashboard/admin/products");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold">Cancel Draft</h2>
        <p className="text-gray-600 mt-2">Do you want to save this draft or delete it?</p>
        
        <div className="flex justify-end mt-4">
          <button onClick={handleSaveDraft} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Save Draft</button>
          <button onClick={handleDeleteDraft} className="bg-red-500 text-white px-4 py-2 rounded">Delete Draft</button>
        </div>
      </div>
    </div>
  );
};

export default CancelModal;