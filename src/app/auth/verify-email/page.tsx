"use client";

import React, { useState } from "react";
import Footer from "@/components/common/Footer";

const VerifyEmail: React.FC = () => {
  const [password, setPassword] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate email verification process and password setup
    setShowSuccessPopup(true);
    setTimeout(() => {
      setShowSuccessPopup(false);
      window.location.href = "/auth/login"; // Redirect to login page
    }, 3000);
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-light-gray">
        <h1 className="text-4xl font-bold text-red-600 mb-4 text-center">Verify Your Email</h1>
        <p className="text-gray-600 mb-4 text-center">
          Please enter your password to complete the verification.
        </p>
        <form onSubmit={handleVerify} className="w-full max-w-xs">
          <input
            type="password"
            placeholder="Password"
            className="border border-gray-300 text-black rounded-lg p-2 w-full mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-rockstock-primary text-white font-semibold py-2 px-4 rounded-full hover:bg-rockstock-primary-dark transition duration-300 w-full mb-4"
          >
            Verify Email
          </button>
        </form>
        {showSuccessPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h2 className="text-xl font-semibold mb-2">Email Verified!</h2>
              <p className="text-gray-600">You will be redirected to the login page shortly.</p>
            </div>
          </div>
        )}
        <Footer />
      </div>
    </>
  );
};

export default VerifyEmail;
