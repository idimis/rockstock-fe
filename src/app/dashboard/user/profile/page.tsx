"use client";

import { useState, useEffect } from "react";
import Header from "@/components/common/Header";
import Navbar from "@/components/common/Navbar";
import UserSidebar from "@/components/common/UserSidebar";
import Footer from "@/components/common/Footer";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const UserProfilePage = () => {
  const [user, setUser] = useState({
    id: null,
    fullname: "",
    email: "",
    photoProfileUrl: null,
    birthDate: "",
    gender: "",
    isVerified: false,
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken"); 
      if (!token) {
        console.error("User not authenticated");
        setLoading(false);
        return;
      }
      
      const response = await fetch(`${BACKEND_URL}/api/v1/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      
      const userData = data.data;
      
      const formattedUser = {
        id: userData.id,
        fullname: userData.fullname,
        email: userData.email,
        photoProfileUrl: userData.photoProfileUrl || "/default-avatar.png",
        birthDate: userData.birthDate ? userData.birthDate.split("T")[0] : "",
        gender: userData.gender,
        isVerified: userData.isVerified,
      };
  
      setUser(formattedUser);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("User not authenticated");
        return;
      }
      
      await fetch(`${BACKEND_URL}/api/v1/user/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullname: user.fullname,
          birthDate: user.birthDate, 
          gender: user.gender,
        }),
      });
      alert("Profile updated successfully!");
      fetchUserProfile();
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };
  
  const handleResetPassword = async () => {
    try {
      await fetch(`${BACKEND_URL}/api/v1/user/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });
      alert("Reset password link sent to email.");
    } catch (error) {
      console.error("Failed to send reset password link:", error);
    }
  };

  const handleUploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("User not authenticated");
        return;
      }
      
      const response = await fetch(`${BACKEND_URL}/api/v1/user/upload-avatar`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const data = await response.json();

      if (file.size > 1024 * 1024) {
        alert("File size must be under 1MB.");
        return;
      }      
  
      setUser((prev) => ({ ...prev, photoProfileUrl: data.data.secureUrl }));
      setPreviewImage(URL.createObjectURL(file));
      alert("Profile picture updated!");
    } catch (error) {
      console.error("Failed to upload profile picture:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleResendVerificationEmail = async () => {
    try {
      await fetch(`${BACKEND_URL}/api/v1/user/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });
      alert("Verification email sent!");
    } catch (error) {
      console.error("Failed to resend verification email:", error);
    }
  };
  
  
  return (
    <>
      <Header />
      <Navbar />
      <div className="flex text-black min-h-screen bg-gray-100">
        <UserSidebar />
        <div className="container mx-auto p-6">
          <h1 className="text-2xl font-bold mb-6">👤 User Profile</h1>
  
          {loading ? (
            <p className="text-center text-gray-500 animate-pulse">Loading...</p>
          ) : (
            <>
              {/* User Information */}
              <div className="mb-6 p-6 border border-gray-200 rounded-xl shadow-md bg-white">
                <h2 className="text-xl font-semibold mb-2">User Information</h2>
                <p><strong>Name:</strong> {user.fullname}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Birth Date:</strong> {user.birthDate || "N/A"}</p>
                <p><strong>Gender:</strong> {user.gender || "N/A"}</p>
                <p><strong>Status:</strong> {user.isVerified ? "✅ Verified" : "❌ Unverified"}</p>
              </div>
  
              {/* Verify Email Button */}
              {!user.isVerified && (
                <button 
                  className="px-5 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-transform duration-200 ease-in-out hover:scale-105 active:scale-95"
                  onClick={handleResendVerificationEmail}
                >
                  Verify Email
                </button>
              )}
  
              {/* Reset Password */}
              {user.id && !user.email.includes("google.com") && (
                <section className="mb-6 p-6 border border-gray-200 rounded-xl shadow-md bg-white">
                  <h2 className="text-xl font-semibold mb-2">Reset Password</h2>
                  <button 
                    className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-transform duration-200 ease-in-out hover:scale-105 active:scale-95"
                    onClick={handleResetPassword}
                  >
                    Send Reset Link
                  </button>
                </section>
              )}
  
              {/* Profile Picture */}
              <section className="mb-6 p-6 border border-gray-200 rounded-xl shadow-md bg-white">
                <h2 className="text-xl font-semibold mb-2">Profile Picture</h2>
                <img
                  src={previewImage || user.photoProfileUrl || "/default-avatar.png"}
                  alt="Profile"
                  className="w-24 h-24 rounded-full mb-4 object-cover border border-gray-300 shadow-sm"
                />
                <input 
                  type="file" 
                  accept=".jpg,.jpeg,.png,.gif" 
                  className="border p-2 w-full rounded-lg mb-2 transition-all duration-200 focus:ring-2 focus:ring-blue-400"
                  onChange={handleUploadPhoto}
                />
              </section>
  
              {/* Update Profile */}
              <section className="p-6 border border-gray-200 rounded-xl shadow-md bg-white">
                <h2 className="text-xl font-semibold mb-2">Update Profile</h2>
                <input 
                  type="text" 
                  name="fullname"
                  value={user.fullname}
                  onChange={handleChange}
                  className="border p-2 w-full rounded-lg mb-2 transition-all duration-200 focus:ring-2 focus:ring-blue-400"
                  placeholder="Full Name"
                />
                <input 
                  type="date" 
                  name="birthDate"
                  value={user.birthDate}
                  onChange={handleChange}
                  className="border p-2 w-full rounded-lg mb-2 transition-all duration-200 focus:ring-2 focus:ring-blue-400"
                />
                <button 
                  className="px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-transform duration-200 ease-in-out hover:scale-105 active:scale-95"
                  onClick={handleUpdateProfile}
                >
                  Save Changes
                </button>
              </section>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserProfilePage;