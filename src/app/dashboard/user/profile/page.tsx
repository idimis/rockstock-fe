import Header from "@/components/common/Header";
import Navbar from "@/components/common/Navbar";
import UserSidebar from "@/components/common/UserSidebar";
import Footer from "@/components/common/Footer";

const UserProfilePage = () => {
  return (
    <>
      <Header />
      <Navbar />
      <div className="flex text-black">
        <UserSidebar />
        <div className="container mx-auto p-6 text-black">
          <h1 className="text-2xl font-bold mb-4">User Profile</h1>
          
          {/* Dummy User Information */}
          <div className="mb-6 p-4 border rounded-lg shadow-md bg-gray-100">
            <h2 className="text-xl font-semibold mb-2">User Information</h2>
            <p><strong>Name:</strong> Markonah</p>
            <p><strong>Email:</strong> markonah@example.com</p>
            <p><strong>Status:</strong> Verified</p>
          </div>
          
          {/* Reset Password Section */}
          <section className="mb-6 p-4 border rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Reset Password</h2>
            <p className="text-gray-600 mb-4">You can reset your password through this feature. A reset link will be sent to your email.</p>
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="border p-2 w-full rounded mb-2"
              defaultValue="markonah@example.com"
              disabled
            />
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Send Reset Link
            </button>
          </section>

          {/* Confirm Reset Password Section */}
          <section className="mb-6 p-4 border rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Confirm Reset Password</h2>
            <p className="text-gray-600 mb-4">Enter your new password to complete the reset process.</p>
            <input 
              type="password" 
              placeholder="New Password" 
              className="border p-2 w-full rounded mb-2"
            />
            <input 
              type="password" 
              placeholder="Confirm New Password" 
              className="border p-2 w-full rounded mb-2"
            />
            <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              Confirm Password Reset
            </button>
          </section>

          {/* User Profile Section */}
          <section className="p-4 border rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Profile Information</h2>
            <p className="text-gray-600 mb-4">Update your personal details and profile picture.</p>
            <input 
              type="text" 
              placeholder="Full Name" 
              className="border p-2 w-full rounded mb-2"
              defaultValue="Markonah"
            />
            <input 
              type="email" 
              placeholder="Email Address" 
              className="border p-2 w-full rounded mb-2"
              defaultValue="markonah@example.com"
            />
            <input 
              type="file" 
              accept=".jpg,.jpeg,.png,.gif" 
              className="border p-2 w-full rounded mb-2"
            />
            <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
              Update Profile
            </button>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserProfilePage;