"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const ConfirmResetPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/user/confirm-reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      if (!response.ok) {
        throw new Error("Failed to reset password.");
      }

      setMessage("Password reset successfully. Redirecting...");
      setTimeout(() => router.push("/auth/login"), 3000);
    } catch (error: any) {
      setMessage(error.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">Confirm Reset Password</h1>
      <p>Enter your new password below.</p>
      <form onSubmit={handleResetPassword} className="w-full max-w-sm">
        <input
          type="password"
          placeholder="New Password"
          className="border p-2 w-full mb-4"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          className="border p-2 w-full mb-4"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Resetting..." : "Confirm"}
        </button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
};

export default ConfirmResetPassword;
