"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Header from "@/components/common/Header";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { formatCurrency } from "@/lib/utils/format";
import IncreaseQuantityButton from "@/components/buttons/IncreaseQuantityButton";
import DecreaseQuantityButton from "@/components/buttons/DecreaseQuantityButton";
import RemoveItemButton from "@/components/buttons/RemoveItemButton";
import { fetchCartItems, increaseCartItemQuantity, decreaseCartItemQuantity, removeCartItem } from "@/services/cartService";
import CartSummary from "@/components/cart/CartSummary";
import { getAccessToken } from "@/lib/utils/auth";
import { AxiosError } from "axios";

interface CartItem {
  cartItemId: number;
  quantity: number;
  totalAmount: number;
  cartId: number;
  productId: number;
  productName: string;
  productImage: string;
  productPrice: number;
  productPictures: { productPictureUrl: string; position: number } | null;
}

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const accessToken = getAccessToken();

  useEffect(() => {
    const getCartData = async (attempt = 1) => {
      try {
        const data = await fetchCartItems(accessToken);
        setCartItems(data.length ? data : []);
      } catch (err: unknown) {
        if (err instanceof AxiosError && err.response?.data?.message) {
          const errorMessage = err.response.data.message;
          console.error("Error fetching cart items:", errorMessage);

          if (errorMessage.includes("JDBC")) {
            const retryDelay = Math.min(2 ** attempt * 1000, 30000); // Exponential backoff (max 30s)
            console.warn(`Retrying getCartData in ${retryDelay / 1000}s...`);
            setTimeout(() => getCartData(attempt + 1), retryDelay);
          } else if (errorMessage === "Item not found !") {
            setCartItems([]);
          } else {
            setError(errorMessage);
          }
        } else {
          setError("An unknown error occurred while fetching cart data.");
        }
      } finally {
        setLoading(false);
      }
    };

    getCartData();
  }, [accessToken]);

  const updateCartItemQuantity = (productId: number, newQuantity: number) => {
    setCartItems((prev) =>
      prev.map((item) => (item.productId === productId ? { ...item, quantity: newQuantity } : item))
    );
    window.dispatchEvent(new Event("storage"));
  };

  const increaseQuantity = async (productId: number) => {
    await increaseCartItemQuantity(productId, accessToken);
    updateCartItemQuantity(productId, (cartItems.find((item) => item.productId === productId)?.quantity || 0) + 1);
  };

  const decreaseQuantity = async (productId: number, currentQuantity: number) => {
    if (currentQuantity > 1) {
      await decreaseCartItemQuantity(productId, currentQuantity, accessToken);
      updateCartItemQuantity(productId, currentQuantity - 1);
    }
  };

  const handleRemoveItem = async (cartItemId: number) => {
    await removeCartItem(cartItemId, accessToken);
    setCartItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
    window.dispatchEvent(new Event("storage"));
  };

  useEffect(() => {
    setTotalPrice(cartItems.reduce((total, item) => total + item.productPrice * item.quantity, 0));
  }, [cartItems]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Navbar />
      <main className="flex-1 container mx-auto p-6 mt-8 mb-8">
        <h2 className="text-3xl font-bold mb-4 text-black">Shopping Cart</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex-grow w-full text-black mx-auto p-6 bg-white shadow-lg rounded-lg md:col-span-2">
            {loading && <p>Loading cart items...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && cartItems.length === 0 && <p>Your cart is empty.</p>}
            <div className="space-y-4 w-full">
              {cartItems.map((item) => (
                <div key={item.cartItemId} className="flex flex-col items-center w-full border-b border-gray-300 pb-2">
                  <div className="flex justify-between items-center w-full">
                    <div className="flex items-center gap-2">
                      <Image
                        src={item.productPictures?.productPictureUrl || "/placeholder.png"}
                        alt={item.productName}
                        width={96}
                        height={96}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <h3 className="text-lg text-black">{item.productName}</h3>
                    </div>
                    <p className="text-black font-semibold">{formatCurrency(item.productPrice)}</p>
                  </div>
                  <div className="flex gap-4 items-center ml-auto">
                    <div className="flex items-center space-x-1 border border-red-600 px-2 py-0.5 rounded-full">
                      <DecreaseQuantityButton onClick={() => decreaseQuantity(item.productId, item.quantity)} />
                      <span className="px-4 py-1">{item.quantity}</span>
                      <IncreaseQuantityButton onClick={() => increaseQuantity(item.productId)} />
                    </div>
                    <RemoveItemButton onClick={() => handleRemoveItem(item.cartItemId)} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>{cartItems.length > 0 && <CartSummary totalPrice={totalPrice} />}</div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cart;
