"use client";

import React, { useState } from "react";
import Footer from "@/components/common/Footer";
import Image from "next/image";
import darkImage from "@/public/darkacadem.jpg";

const Signup: React.FC = () => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"customer" | "organizer">("customer");
  const [referralCode, setReferralCode] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    setShowSuccessPopup(true);
    setTimeout(() => {
      setShowSuccessPopup(false);
      window.location.href = "/verify"; 
    }, 3000);
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row min-h-screen bg-light-gray">
        <div className="relative w-full lg:w-1/2">
          <Image
            src={darkImage}
            alt="Signup Background"
            layout="fill"
            objectFit="cover"
            className="absolute inset-0"
          />
        </div>

        <div className="flex flex-col items-center justify-center w-full lg:w-1/2 p-8">
          <h1 className="text-4xl font-bold text-purple-600 mb-4 text-center">
            Welcome to Rockstock
          </h1>
          <p className="text-gray-600 mb-4 text-center">
            A place where dark souls, goths, and emos can find peace in their
            golden years.
          </p>

          <form onSubmit={handleSignup} className="w-full max-w-xs">
            <input
              type="email"
              placeholder="Email Address"
              className="border border-gray-300 rounded-lg p-2 w-full mb-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Referral Code (optional)"
              className="border border-gray-300 rounded-lg p-2 w-full mb-4"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
            />

            <div className="flex justify-between mb-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="customer"
                  checked={role === "customer"}
                  onChange={() => setRole("customer")}
                  className="mr-2"
                />
                Customer
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="role"
                  value="organizer"
                  checked={role === "organizer"}
                  onChange={() => setRole("organizer")}
                  className="mr-2"
                />
                Organizer
              </label>
            </div>

            <button
              type="submit"
              className="bg-rockstock-primary text-white font-semibold py-2 px-4 rounded-full hover:bg-rockstock-primary-dark transition duration-300 w-full mb-4"
            >
              Sign Up
            </button>
          </form>

          {/* Social Login Buttons */}
          <button className="flex items-center bg-white border border-gray-300 rounded-full py-2 px-4 hover:bg-gray-100 transition duration-300 w-full max-w-xs mb-4">
            <Image
              src="/google-icon.svg"
              alt="Google Icon"
              width={20}
              height={20}
              className="mr-2"
            />
            Login with Google
          </button>

          <button className="flex items-center bg-white border border-gray-300 rounded-full py-2 px-4 hover:bg-gray-100 transition duration-300 w-full max-w-xs mb-4">
            <Image
              src="/facebook-icon.svg"
              alt="Facebook Icon"
              width={20}
              height={20}
              className="mr-2"
            />
            Login with Facebook
          </button>

          <button className="flex items-center bg-white border border-gray-300 rounded-full py-2 px-4 hover:bg-gray-100 transition duration-300 w-full max-w-xs mb-4">
            <Image
              src="/twitter-icon.svg"
              alt="Twitter Icon"
              width={20}
              height={20}
              className="mr-2"
            />
            Login with Twitter
          </button>

          <p className="mt-4 text-gray-700 text-center">
            Already have an account?{" "}
            <a href="/login" className="text-purple-600 underline">
              Login
            </a>
          </p>
        </div>
      </div>

      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-semibold mb-2">Account Created Successfully!</h2>
            <p className="text-gray-600">You will be redirected to email verification page shortly.</p>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Signup;
