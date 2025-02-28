import React, { useEffect, useState } from "react";
import axios from "axios";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/lib/utils/auth";

interface DetailPaymentProps {
  subtotal: number;
  shippingFee: number;
  totalPrice: number;
  onShowPopup: () => void;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const accessToken = getAccessToken();

const DetailPayment: React.FC<DetailPaymentProps> = ({ subtotal, shippingFee, totalPrice, onShowPopup }) => {
  const [paymentMethods, setPaymentMethods] = useState<{ id: number; name: string }[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<number | null>(null);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/payments/methods`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setPaymentMethods(response.data.data);
      } catch (error) {
        console.error("Error fetching payment methods:", error);
      }
    };

    fetchPaymentMethods();
  }, []);

  const handlePayNow = () => {
    if (!selectedMethod) {
      alert("Please select a payment method before proceeding!");
      return;
    }
    onShowPopup();
  };

  return (
    <div className="flex flex-col justify-between w-full p-6 bg-white shadow-md rounded-lg">
      <div>
        <div className="mb-6 border-b border-gray-300 pb-2">
          <h3 className="text-xl font-semibold mb-4 text-black">Payment Methods</h3>
          {paymentMethods.length > 0 ? (
            <div className="space-y-2">
              {paymentMethods.map((method) => (
                <label key={method.id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={selectedMethod === method.id}
                    onChange={() => setSelectedMethod(method.id)}
                    className="form-radio text-red-600"
                  />
                  <span className="text-black">{method.name}</span>
                </label>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Loading payment methods...</p>
          )}
        </div>

        <h3 className="text-xl font-semibold mb-4 text-black">Payment Details</h3>
        <div className="flex flex-col gap-2 text-black">
          <p className="flex justify-between">
            <span>Subtotal</span> {formatCurrency(subtotal)}
          </p>
          <p className="flex justify-between">
            <span>Shipping Fee</span> {formatCurrency(shippingFee)}
          </p>
        </div>
      </div>

      <div>
        <p className="flex justify-between text-xl text-black font-semibold border-t border-gray-300 pt-2">
          <span>Total</span> {formatCurrency(totalPrice)}
        </p>
        <button
          className="mt-4 px-6 py-4 bg-red-600 text-white text-xl font-bold rounded-lg hover:bg-red-500 w-full"
          onClick={handlePayNow}
        >
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default DetailPayment;
