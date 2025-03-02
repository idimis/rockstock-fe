"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/common/UserSidebar";
import Header from "@/components/common/Header";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

const UserDashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [fullname, setFullname] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState<boolean | null>(null);

  useEffect(() => {
    console.log("Session status:", status);
    console.log("Session data:", session);
  
    if (status === "loading") return;
  
    if (session?.user) {
      console.log("User logged in via social login:", session.user);
  
      // Simpan data sementara ke sessionStorage (bukan localStorage)
      sessionStorage.setItem("fullname", session.user.name ?? session.user.email ?? "User");
      sessionStorage.setItem("is_verified", "true");
  
      setFullname(session.user.name ?? session.user.email ?? "User");
      setIsVerified(true);
    } else {
      // Cek localStorage jika tidak ada session
      const storedFullname = localStorage.getItem("fullname");
      const verifiedStatus = localStorage.getItem("is_verified") === "true";
  
      console.log("Checking localStorage:", { storedFullname, verifiedStatus });
  
      if (storedFullname) {
        setFullname(storedFullname);
        setIsVerified(verifiedStatus);
      } else {
        console.log("Redirecting to /login...");
        setTimeout(() => router.push("/login"), 500); 
      }
    }
  }, [session, status]);
  
  if (status === "loading") return <p>Loading...</p>;

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 text-black">
      <Header />
      <Navbar />
      <div className="flex flex-grow">
        <Sidebar />
        <main className="flex-grow p-6 bg-white shadow-md">
          <h1 className="text-2xl font-bold mb-4">👋 Welcome, {fullname}!</h1>

          {/* Notifikasi jika akun belum terverifikasi */}
          {isVerified === false && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              <p>🚨 Email belum diverifikasi! Cek email kamu dan klik link verifikasi untuk mengaktifkan akun.</p>
            </div>
          )}

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
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default UserDashboard;
