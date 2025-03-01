"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/common/Footer";
import OrderSummary from "@/components/checkout/OrderSummary";
import DetailPayment from "@/components/checkout/DetailPayment";
import { fetchCartItems } from "@/services/cartService";
import AddressComponent from "@/components/checkout/AddressComponent";
import SimpleNavbar from "@/components/common/SimpleNavbar";
import { getAccessToken } from "@/lib/utils/auth";
import axios from "axios";

interface CartItem {
  cartItemId: number;
  productName: string;
  productImage: string;
  productPrice: number;
  quantity: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const CheckoutPage = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<{ id: number; name: string }[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<number | null>(null);
  const [addressId, setAddressId] = useState<number | null>(null);
  const accessToken = getAccessToken();

  useEffect(() => {
    const getCartData = async () => {
      try {
        const data = await fetchCartItems(accessToken);
        setCartItems(data.length ? data : []);
      } catch (err: unknown) {
        if (err instanceof Error) {
          if ((err as any).response?.data?.message === "Item not found !") {
            setCartItems([]);
          } else {
            setError(err.message);
          }
        }
      } finally {
        setLoading(false);
      }
    };
    getCartData();
  }, [accessToken]);

  const subtotal = cartItems.reduce((total, item) => total + item.productPrice * item.quantity, 0);
  const shippingFee = 10000;
  const totalPrice = subtotal + shippingFee;

  const handleConfirmPayment = async () => {
    setLoading(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/orders`,
        {
          deliveryCost: shippingFee,
          addressId,
          paymentMethodId: selectedMethod,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const orderId = response.data?.data.id;

      const selectedPayment = paymentMethods.find((method) => method.id === selectedMethod);
      if (!selectedPayment) return;

      if (selectedPayment.name === "Manual Bank Transfer") {
        router.push(`/payments/manual/${orderId}`);
      } else {
        router.push(`/payments/gateway/${orderId}`);
      }

      setShowPopup(false);

    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SimpleNavbar />
      <main className="flex-1 container mx-auto p-6 mt-8 mb-8">
        <h1 className="text-3xl font-bold mb-4 text-black">Checkout</h1>
        {loading && <p>Loading cart items...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && cartItems.length === 0 && <p>Your cart is empty.</p>}
        {!loading && !error && cartItems.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col md:col-span-2">
              <AddressComponent addressId={addressId} setAddressId={setAddressId} />
              <OrderSummary cartItems={cartItems} />
            </div>
            <DetailPayment
              subtotal={subtotal}
              shippingFee={shippingFee}
              totalPrice={totalPrice}
              onShowPopup={() => setShowPopup(true)}
              paymentMethods={paymentMethods}
              setPaymentMethods={setPaymentMethods}
              selectedMethod= {selectedMethod}
              setSelectedMethod={setSelectedMethod}
            />
          </div>
        )}
      </main>
      <Footer />

      {/* Confirmation Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold text-black mb-4">Confirm Payment</h2>
            <p className="text-gray-700 mb-4">
              Once you proceed, you <b>cannot change</b>, add, or remove items, and you also
              <b> cannot change the address</b> or payment method. Are you sure you want to continue?
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-400"
                onClick={() => setShowPopup(false)}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 text-white font-bold rounded-lg w-full transition ${
                  loading ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-500"
                }`}
                onClick={handleConfirmPayment}
                disabled={loading}
              >
                {loading ? "Processing..." : "Confirm & Pay"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
