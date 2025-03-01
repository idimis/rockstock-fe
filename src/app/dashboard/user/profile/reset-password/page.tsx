"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Footer from "@/components/common/Footer";

const ResetPassword = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loginType, setLoginType] = useState<"jwt" | "oauth" | null>(null);
  const [identifier, setIdentifier] = useState<string | null>(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      setLoginType("jwt");
      setIdentifier(accessToken);
    } else if (status === "authenticated" && session?.user?.email) {
      setLoginType("oauth");
      setIdentifier(session.user.email);
    } else if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [session, status, router]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !loginType) return;

    if (!oldPassword) {
      setError("Old password is required.");
      return;
    }

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
      const response = await fetch("/api/v1/user/confirm-reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(loginType === "jwt" && { Authorization: `Bearer ${identifier}` }),
        },
        body: JSON.stringify({
          oldPassword,
          newPassword,
          confirmPassword,
          ...(loginType === "oauth" && { email: identifier }),
        }),
      });

      if (!response.ok) {
        throw new Error("Reset failed. Please try again.");
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
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold text-red-600 mb-4 text-center">
        Reset Your Password
      </h1>
      <p className="text-lg text-gray-600 mb-6 text-center">
        Enter your old password and new password below.
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
          <button
            type="submit"
            className="bg-gray-300 text-black font-semibold py-2 px-4 rounded-full hover:bg-gray-500 transition duration-300"
            disabled={loading}
          >
            {loading ? "Resetting Password..." : "Confirm"}
          </button>
        </form>
      )}

      {error && <p className="text-red-500 font-semibold mt-2">{error}</p>}
      <Footer />
    </div>
  );
};

export default ResetPassword;
