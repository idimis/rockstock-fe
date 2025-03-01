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
import CartSummary from "@/components/cart/CartSummary";
import { getAccessToken } from "@/lib/utils/auth";

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
  const [totalPrice, setTotalPrice] = useState(0);
  const accessToken = getAccessToken();

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

  useEffect(() => {
    const newTotalPrice = cartItems.reduce((total, item) => total + item.productPrice * item.quantity, 0);
    setTotalPrice(newTotalPrice);
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
                        src={item.productImage || "/images/default-product.jpg"}
                        alt={item.productName}
                        width={80}
                        height={80}
                        className="rounded-lg"
                      />
                      <h3 className="text-lg text-black">{item.productName}</h3>
                    </div>
                    <p className="text-black font-semibold">{formatCurrency(item.productPrice)}</p>
                  </div>
                  <div className="flex gap-4 items-center ml-auto">
                    <div className="flex items-center space-x-1 border border-red-600 px-2 py-0.5 rounded-full">
                      <DecreaseQuantityButton onClick={() => decreaseQuantity(item.productId, item.quantity)}/>
                      <span className="px-4 py-1">{item.quantity}</span>
                      <IncreaseQuantityButton onClick={() => increaseQuantity(item.productId)} />
                    </div>
                    <RemoveItemButton onClick={() => handleRemoveItem(item.cartItemId)} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            {cartItems.length > 0 && <CartSummary totalPrice={totalPrice} />}
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
};

export default Cart;