"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const ForbiddenPage = () => {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.push("/"); // Redirect home after 3 seconds
    }, 3000);
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="text-center">
        <div className="text-8xl sm:text-9xl text-red-600 font-bold">403</div>
        <h1 className="text-3xl sm:text-4xl font-semibold text-gray-800 mt-2">Forbidden</h1>
        <p className="text-lg sm:text-xl text-gray-600 mt-2">You don&apos;t have permission to access this page.</p>
        <p className="text-gray-500 mt-1">Redirecting to homepage...</p>
      </div>
    </div>
  );
};

export default ForbiddenPage;