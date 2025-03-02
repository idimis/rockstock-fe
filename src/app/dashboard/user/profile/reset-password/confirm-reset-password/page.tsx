"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const ConfirmResetPasswordPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const resetToken = searchParams.get("token");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmationNewPassword, setConfirmationNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!resetToken) {
      setError("Invalid or missing reset token.");
    }
  }, [resetToken]);

  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmationNewPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/user/confirm-reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resetToken,
          oldPassword,
          newPassword,
          confirmationNewPassword,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password. Please try again.");
      }

      setSuccess(true);
      setTimeout(() => router.push("/login"), 3000);
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-black"
    >
      <h1 className="text-4xl font-bold text-red-700 mb-4 text-center">Reset Password</h1>
      <p className="text-lg text-gray-600 mb-6 text-center">Update your password securely.</p>

      {success ? (
        <p className="text-green-600 font-semibold text-center">
          Password reset successful! Redirecting to login...
        </p>
      ) : (
        <motion.form 
          onSubmit={handleConfirmReset} 
          className="w-full max-w-md bg-white p-6 rounded-2xl shadow-xl"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Old Password</label>
            <input
              type="password"
              placeholder="Enter old password"
              className="border border-gray-300 text-black rounded-lg p-2 w-full"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              className="border border-gray-300 text-black rounded-lg p-2 w-full"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Confirm New Password</label>
            <input
              type="password"
              placeholder="Confirm new password"
              className="border border-gray-300 text-black rounded-lg p-2 w-full"
              value={confirmationNewPassword}
              onChange={(e) => setConfirmationNewPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-500 font-semibold mb-4">{error}</p>}

          <button
            type="submit"
            className="bg-red-700 text-white font-semibold py-3 px-4 rounded-xl hover:bg-red-800 transition duration-300 w-full"
            disabled={loading}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </motion.form>
      )}
    </motion.div>
  );
};

export default ConfirmResetPasswordPage;
