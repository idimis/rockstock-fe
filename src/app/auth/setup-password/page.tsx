"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

const SetupPassword = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setStatus("error");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/setup-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      if (response.ok) {
        setStatus("success");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        throw new Error("Failed to set password");
      }
    } catch (error) {
      console.error("Error setting password:", error);
      setStatus("error");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-xl font-semibold mb-4">Set Your Password</h2>
      <form onSubmit={handlePasswordSubmit} className="w-full max-w-sm">
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded-lg"
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded-lg"
          required
        />
        <button
          type="submit"
          className="w-full px-6 py-2 bg-green-500 text-white rounded-lg"
        >
          Submit
        </button>
      </form>
      {status === "loading" && <p className="text-gray-600">Setting password...</p>}
      {status === "success" && <p className="text-green-600">Password set successfully!</p>}
      {status === "error" && <p className="text-red-500">There was an error. Please try again.</p>}
    </div>
  );
};

export default SetupPassword;
