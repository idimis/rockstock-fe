"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/common/UserSidebar";
import Header from "@/components/common/Header";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

const UserDashboard = () => {
  const [fullname, setFullname] = useState<string | null>(null);

  useEffect(() => {
    const storedFullname = localStorage.getItem("fullname");
    setFullname(storedFullname || "User");
  }, []);
  

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 text-black">
      <Header />
      <Navbar />
      <div className="flex flex-grow">
        <Sidebar />
        <main className="flex-grow p-6 bg-white shadow-md">
          <h1 className="text-2xl font-bold mb-4">👋 Welcome, {fullname}!</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Order Summary */}
            <div className="p-4 bg-blue-100 shadow rounded-lg">
              <h2 className="text-lg font-semibold">📦 My Orders</h2>
              <p className="text-2xl font-bold">5 Active Orders</p>
              <p className="text-sm text-gray-600">Track your recent purchases</p>
            </div>
            
            {/* Wishlist */}
            <div className="p-4 bg-green-100 shadow rounded-lg">
              <h2 className="text-lg font-semibold">💖 Wishlist</h2>
              <p className="text-2xl font-bold">12 Items</p>
              <p className="text-sm text-gray-600">Save items for later</p>
            </div>

            {/* Account Balance */}
            <div className="p-4 bg-yellow-100 shadow rounded-lg">
              <h2 className="text-lg font-semibold">💳 Account Balance</h2>
              <p className="text-2xl font-bold">$120.50</p>
              <p className="text-sm text-gray-600">Available for purchases</p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="p-4 bg-white shadow rounded-lg">
              <h2 className="text-lg font-semibold">📜 Recent Orders</h2>
              <ul className="mt-2 space-y-2">
                <li>✅ Order #12345 - Delivered</li>
                <li>🚚 Order #12346 - Out for Delivery</li>
                <li>⏳ Order #12347 - Processing</li>
              </ul>
            </div>

            <div className="p-4 bg-white shadow rounded-lg">
              <h2 className="text-lg font-semibold">🔥 Recommended for You</h2>
              <ul className="mt-2 space-y-2">
                <li>1. Product X - Special Offer</li>
                <li>2. Product Y - Best Seller</li>
                <li>3. Product Z - New Arrival</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default UserDashboard;
