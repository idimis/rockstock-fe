"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/common/Footer";


const ResetPassword: React.FC = () => {
  const router = useRouter();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
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
     
      const response = await fetch("/api/v1/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword, newPassword }),
      });

      if (!response.ok) {
        throw new Error("Old password is incorrect or reset failed. Please try again.");
      }

      setSuccess(true);
      setTimeout(() => router.push("/auth/login"), 3000); 
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/auth/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      
      <h1 className="text-4xl font-bold text-red-600 mb-4 text-center">Reset Your Password</h1>
      <p className="text-lg text-gray-600 mb-6 text-center">
        Please enter your old password and set your new password. Your new password must be at least 6 characters long.
      </p>

      {success ? (
        <p className="text-green-600 font-semibold">
          Password reset successfully! Redirecting to login...
        </p>
      ) : (
        <form onSubmit={handleResetPassword} className="w-full max-w-xs">
          <input
            type="password"
            placeholder="Old Password"
            className="border border-gray-300 text-black rounded-lg p-2 w-full mb-4"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="New Password"
            className="border border-gray-300 text-black rounded-lg p-2 w-full mb-4"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="border border-gray-300 text-black rounded-lg p-2 w-full mb-4"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <div className="flex justify-center gap-4">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-300 text-black font-semibold py-2 px-4 rounded-full hover:bg-gray-500 transition duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-gray-300 text-black font-semibold py-2 px-4 rounded-full hover:bg-gray-500 transition duration-300"
              disabled={loading}
            >
              {loading ? "Resetting Password..." : "Confirm"}
            </button>
          </div>
        </form>
      )}

      {error && <p className="text-red-500 font-semibold mt-2">{error}</p>}
      <Footer />
    </div>
  );
};

export default ResetPassword;
