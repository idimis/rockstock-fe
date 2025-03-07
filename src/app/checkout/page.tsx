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
import DeliveryService from "@/components/checkout/DeliveryService";

declare global {
  interface Window {
    snap: {
      pay: (
        token: string,
        options: {
          onSuccess: (result: unknown) => void;
          onPending: (result: unknown) => void;
          onError: (result: unknown) => void;
          onClose: () => void;
        }
      ) => void;
    };
  }
}

interface Warehouse {
  id: number;
  name: string;
  address: string;
  latitude: string;
  longitude: string;
  subDistrictPostalCode: string;
}

interface CartItem {
  cartItemId: number;
  productName: string;
  productPrice: number;
  quantity: number;
  productWeight: number;
  productPictures: { productPictureUrl: string; position: number } | null;
}

interface PaymentMethod {
  id: number;
  name: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const CheckoutPage = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<number | null>(null);
  const [addressId, setAddressId] = useState<number | null>(null);
  const [addressPostalCode, setAddressPostalCode] = useState<string | null>(null);
  const [nearestWarehouse, setNearestWarehouse] = useState<Warehouse | null>(null);
  const [snapToken, setSnapToken] = useState<string | null>(null);
  const [shippingFee, setShippingFee] = useState(0);
  const accessToken = getAccessToken();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!);
    script.onload = () => console.log("Midtrans Snap script loaded.");
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    const getCartData = async (attempt = 1) => {
      try {
        const data = await fetchCartItems(accessToken);
        setCartItems(data.length ? data : []);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error("Error fetching cart items:", err.message);
          setError("Unknown error");
        }
      }
    };
    getCartData();
  }, [accessToken]);

  useEffect(() => {
    if (snapToken && window.snap) {
      window.snap.pay(snapToken, {
        onSuccess: (result) => {
          console.log("Payment success:", result);
          alert("Payment successful! Redirecting...");
          router.push("/checkout/success");
        },
        onPending: (result) => {
          console.log("Waiting for payment:", result);
          alert("Waiting for payment! You can check your order in the order list.");
        },
        onError: (result) => {
          console.log("Payment failed:", result);
          alert("Payment failed! Please try again.");
        },
        onClose: () => {
          console.log("Payment popup closed.");
          alert("You closed the payment popup.");
        },
      });
    }
  }, [snapToken, router]);

  const subtotal = cartItems.reduce((total, item) => total + item.productPrice * item.quantity, 0);
  const totalPrice = subtotal + shippingFee;
  const totalWeight = cartItems.reduce((total, item) => total + item.productWeight, 0);

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
              <AddressComponent
                addressId={addressId}
                setAddressId={setAddressId}
                addressPostalCode={addressPostalCode}
                setAddressPostalCode={setAddressPostalCode}
                nearestWarehouse={nearestWarehouse}
                setNearestWarehouse={setNearestWarehouse}
              />
              <DeliveryService
                origin={nearestWarehouse?.subDistrictPostalCode ?? null}
                destination={addressPostalCode ?? null}
                weight={totalWeight || 0}
                setShippingFee={setShippingFee}
              />
              <OrderSummary cartItems={cartItems} />
            </div>
            <DetailPayment
              subtotal={subtotal}
              shippingFee={shippingFee}
              totalPrice={totalPrice}
              onShowPopup={() => setShowPopup(true)}
              paymentMethods={paymentMethods}
              setPaymentMethods={setPaymentMethods}
              selectedMethod={selectedMethod}
              setSelectedMethod={setSelectedMethod}
            />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutPage;