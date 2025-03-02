"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Footer from "@/components/common/Footer";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const ConfirmResetPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetToken = searchParams.get("token"); // Ini adalah token untuk reset password

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!resetToken) {
      router.push("/auth/login");
    }
  }, [resetToken, router]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPassword || newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const jwtToken = localStorage.getItem("token"); // Ambil JWT dari localStorage

      const response = await fetch(`${BACKEND_URL}/api/v1/user/confirm-reset-password`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${jwtToken}`, // Kirim JWT token
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resetToken, // Kirim reset token yang diambil dari URL
          newPassword,
        }),
      });

      const data = await response.json();
      console.log("Response Data:", data);

      if (!response.ok) {
        throw new Error(data.message || "Reset failed. Please try again.");
      }

      setSuccess(true);
      setTimeout(() => router.push("/auth/login"), 3000);
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-black">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Reset Your Password</h1>
        <p className="text-gray-700 mb-6">Enter your new password below.</p>

        {success ? (
          <p className="text-green-600 font-semibold">Password reset successfully! Redirecting...</p>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <input
              type="password"
              placeholder="New Password"
              className="border border-gray-300 text-black rounded-lg p-2 w-full"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="border border-gray-300 text-black rounded-lg p-2 w-full"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300 w-full"
              disabled={loading}
            >
              {loading ? "Resetting Password..." : "Confirm"}
            </button>
          </form>
        )}

        {error && <p className="text-red-500 font-semibold mt-2">{error}</p>}
      </div>
      <Footer />
    </div>
  );
};

export default ConfirmResetPassword;
