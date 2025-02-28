"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Header from "@/components/common/Header";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import IncreaseQuantityButton from "@/components/buttons/IncreaseQuantityButton";
import DecreaseQuantityButton from "@/components/buttons/DecreaseQuantityButton";
import RemoveItemButton from "@/components/buttons/RemoveItemButton";
import { fetchCartItems, increaseCartItemQuantity, decreaseCartItemQuantity, removeCartItem } from "@/services/cartService";

interface CartItem {
  cartItemId: number;
  quantity: number;
  totalAmount: number;
  cartId: number;
  productId: number;
  productName: string;
  productImage: string;
  productPrice: number;
}

const Cart = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const getCartData = async () => {
      try {
        const data = await fetchCartItems(accessToken);
        setCartItems(data.length ? data : []);
      } catch (err: any) {
        if (err.response?.data?.message === "Item not found !") {
          setCartItems([]);
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };
    getCartData();
  }, [accessToken]);

  const increaseQuantity = async (productId: number) => {
    await increaseCartItemQuantity(productId, accessToken);
    setCartItems((prev) =>
      prev.map((item) => (item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item))
    );
    window.dispatchEvent(new Event("storage"));
  };

  const decreaseQuantity = async (productId: number, currentQuantity: number) => {
    await decreaseCartItemQuantity(productId, currentQuantity, accessToken);
    setCartItems((prev) =>
      prev.map((item) => (item.productId === productId ? { ...item, quantity: item.quantity - 1 } : item))
    );
    window.dispatchEvent(new Event("storage"));
  };

  const handleRemoveItem = async (cartItemId: number) => {
    await removeCartItem(cartItemId, accessToken);
    setCartItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
    window.dispatchEvent(new Event("storage"));
  };

  const totalPrice = cartItems.reduce((total, item) => total + (item.totalAmount || 0), 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Navbar />
      <main className="flex-grow text-black container mx-auto p-6 mt-8 mb-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>
        {loading && <p>Loading cart items...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && cartItems.length === 0 && <p>Your cart is empty.</p>}
        <div className="space-y-6">
          {cartItems.map((item) => (
            <div key={item.cartItemId} className="flex items-center border-b border-gray-300 pb-4">
              <Image
                src={item.productImage || "/images/default-product.jpg"}
                alt={item.productName}
                width={80}
                height={80}
                className="rounded-lg"
              />
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-semibold">{item.productName}</h3>
                <p className="text-gray-600">{formatCurrency(item.productPrice)}</p>
                <div className="mt-2 flex items-center space-x-2">
                  <DecreaseQuantityButton onClick={() => decreaseQuantity(item.productId, item.quantity)} disabled={item.quantity <= 1} />
                  <span className="px-4 py-1 bg-gray-100 rounded-lg">{item.quantity}</span>
                  <IncreaseQuantityButton onClick={() => increaseQuantity(item.productId)} />
                </div>
              </div>
              <RemoveItemButton onClick={() => handleRemoveItem(item.cartItemId)} />
            </div>
          ))}
        </div>

        {/* Total Price & Checkout */}
        {cartItems.length > 0 && (
          <div className="flex justify-between items-center mt-8 p-4 border-t border-gray-300">
            <h3 className="text-xl font-bold">Total: {formatCurrency(totalPrice)}</h3>
            <button
              className="mt-4 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-500 transition"
              onClick={() => router.push("/checkout")}
            >
              Checkout
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Cart;