// "use client";

// import { useState, useEffect } from "react";
// import { useSearchParams, useRouter } from "next/navigation";

// const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// const ConfirmResetPasswordPage = () => {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const resetToken = searchParams.get("token");
  
//   const [newPassword, setNewPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState(false);

//   useEffect(() => {
//     if (!resetToken) {
//       setError("Invalid or missing reset token.");
//     }
//   }, [resetToken]);

//   const handleConfirmReset = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!resetToken) {
//       setError("Invalid reset token.");
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       const response = await fetch(`${BACKEND_URL}/api/v1/user/confirm-reset-password`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           resetToken,
//           newPassword,
//         }),
//       });

//       const data = await response.json();
//       if (!response.ok) {
//         throw new Error(data.message || "Failed to reset password. Please try again.");
//       }

//       setSuccess(true);
//       setTimeout(() => router.push("/login"), 3000);
//     } catch (err: any) {
//       setError(err.message || "An error occurred.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-black">
//       <h1 className="text-4xl font-bold text-blue-600 mb-4 text-center">Confirm Reset Password</h1>
//       <p className="text-lg text-gray-600 mb-6 text-center">Enter your new password below.</p>

//       {success ? (
//         <p className="text-green-600 font-semibold">Password reset successful! Redirecting to login...</p>
//       ) : (
//         <form onSubmit={handleConfirmReset} className="w-full max-w-xs bg-white p-6 rounded-lg shadow-md">
//           <input
//             type="password"
//             placeholder="Enter new password"
//             className="border border-gray-300 text-black rounded-lg p-2 w-full mb-4"
//             value={newPassword}
//             onChange={(e) => setNewPassword(e.target.value)}
//             required
//           />
//           <button
//             type="submit"
//             className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300 w-full"
//             disabled={loading}
//           >
//             {loading ? "Resetting..." : "Reset Password"}
//           </button>
//         </form>
//       )}

//       {error && <p className="text-red-500 font-semibold mt-2">{error}</p>}
//     </div>
//   );
// };

// export default ConfirmResetPasswordPage;