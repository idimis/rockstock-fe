"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const VerifyEmail = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    const verifyEmail = async () => {
      console.log("Verifying token:", token);

      try {
        // Menggunakan URL dari NEXT_PUBLIC_BACKEND_URL di .env.local
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/verify-email?token=${token}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        // Jika status respons tidak OK, throw error
        if (!response.ok) {
          console.error("Response not OK:", response);
          throw new Error("Invalid or expired token");
        }

        const data = await response.json();
        console.log("Server response:", data); 

        setStatus("success");
        setTimeout(() => router.push(`/auth/setup-password?token=${token}`), 2000);
      } catch (error) {
        console.error("Error during verification:", error);
        setStatus("error");
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {status === "loading" && <p className="text-gray-600">Verifying your email...</p>}
      {status === "success" && (
        <div>
          <p className="text-green-600 font-semibold">
            Email verified! Redirecting to password setup...
          </p>
          <button
            onClick={() => router.push(`/auth/setup-password?token=${token}`)}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg"
          >
            Set Password
          </button>
        </div>
      )}
      {status === "error" && (
        <p className="text-red-500 font-semibold">
          Verification failed. The link may be expired or invalid.
        </p>
      )}
    </div>
  );
};

export default VerifyEmail;
