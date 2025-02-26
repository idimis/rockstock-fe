import { useState } from "react";
import axios from "axios";

interface AddToCartButtonProps {
  productId: number;
  quantity: number;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ productId, quantity }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const accessToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const handleAddToCart = async () => {
    if (!accessToken) {
      setError("Please log in to add items to the cart.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    const payload = { productId, quantity };

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/carts/item`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        setSuccess(true);
        window.dispatchEvent(new Event("storage"));
      }
    } catch (err: any) {
      console.error("Error adding to cart:", err);

      if (err.response?.data?.message) {
        setError(
          err.response.data.message === "Hit stock limit !"
            ? "You've reached the stock limit for this product!"
            : err.response.data.message
        );
      } else {
        setError("Failed to add item to cart. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleAddToCart}
        disabled={loading || !accessToken}
        className={`mt-3 px-4 py-2 rounded-md transition ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white"
        }`}
      >
        {loading ? "Adding..." : "Add to Cart"}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}
      {success && <p className="text-green-500 mt-2">Added to cart successfully!</p>}
    </div>
  );
};

export default AddToCartButton;
