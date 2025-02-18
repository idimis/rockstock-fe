"use client";

import React, { useState } from "react";
import Footer from "@/components/common/Footer";

const ResetPassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    setShowSuccessPopup(true);
    setTimeout(() => {
      setShowSuccessPopup(false);
      window.location.href = "/auth/login"; 
    }, 3000);
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-light-gray">
        <h1 className="text-4xl font-bold text-red-600 mb-4 text-center">Reset Your Password</h1>
        <form onSubmit={handleResetPassword} className="w-full max-w-xs">
          <input
            type="password"
            placeholder="New Password"
            className="border border-gray-300 rounded-lg p-2 w-full mb-4"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-rockstock-primary text-white font-semibold py-2 px-4 rounded-full hover:bg-rockstock-primary-dark transition duration-300 w-full mb-4"
          >
            Reset Password
          </button>
        </form>
        {showSuccessPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <h2 className="text-xl font-semibold mb-2">Password Reset Successful!</h2>
              <p className="text-gray-600">You can now log in with your new password.</p>
            </div>
          </div>
        )}
        <Footer />
      </div>
    </>
  );
};

export default ResetPassword;
