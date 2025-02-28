import { useState } from "react";
import AddToCartButton from "../buttons/AddToCartButton";

interface QuantitySelectorProps {
  productId: number;
  totalStock: number;
  price: number;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({ productId, totalStock, price }) => {
  const [quantity, setQuantity] = useState(1);

  const increaseQuantity = () => {
    if (quantity < totalStock) setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const subtotal = price * quantity;

  return (
    <div className="p-4 border rounded-md">
      {totalStock === 0 ? (
        <p className="text-red-600 font-bold">Product Not Available</p>
      ) : (
        <>
          <div className="flex items-center space-x-2">
            <button
              onClick={decreaseQuantity}
              disabled={quantity <= 1}
              className="px-3 py-1 border rounded-md text-gray-600 bg-gray-200"
            >
              -
            </button>
            <span className="text-gray-600">{quantity}</span>
            <button
              onClick={increaseQuantity}
              disabled={quantity >= totalStock}
              className="px-3 py-1 border rounded-md text-gray-600 bg-gray-200"
            >
              +
            </button>
          </div>
          <p className="text-gray-700 mt-2">Subtotal: Rp. {subtotal.toLocaleString("id-ID")}</p>

          <AddToCartButton productId={productId} quantity={quantity} />
        </>
      )}
    </div>
  );
};

export default QuantitySelector;