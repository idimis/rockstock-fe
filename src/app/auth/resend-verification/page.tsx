"use client";

import React, { useState } from "react";
import Footer from "@/components/common/Footer";

const ResendVerification: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleResendVerification = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate sending verification email again
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      window.location.href = "/auth/verify-email"; // Redirect to verify email page
    }, 3000);
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-light-gray">
        <h1 className="text-4xl font-bold text-red-600 mb-4 text-center">Resend Verification Email</h1>
        <form onSubmit={handleResendVerification} className="w-full max-w-xs">
          <input
            type="email"
            placeholder="Enter Your Email"
            className="border border-gray-300 rounded-lg p-2 w-full mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-red-600 text-white font-semibold py-2 px-4 rounded-full hover:bg-red-700 transition duration-300 w-full mb-4"
          >
            Resend Verification Email
          </button>
        </form>

        {isSuccess && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h2 className="text-xl font-semibold mb-2">Verification Email Sent!</h2>
              <p className="text-gray-600">Please check your email for the verification link.</p>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </>
  );
};

export default ResendVerification;
