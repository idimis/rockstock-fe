// "use client";

// import { useEffect, useState } from "react";
// import Header from "@/components/common/Header";
// import Navbar from "@/components/common/Navbar";
// import Footer from "@/components/common/Footer";
// import AdminSidebarPanel from "@/components/common/AdminSidebar";
// import axios from "axios";

// const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// interface Admin {
//   id: number;
//   fullname: string;
//   email: string;
//   role: string;
// }

// interface Warehouse {
//   id: number;
//   name: string;
// }

// const AssignWarehouseAdminPage = () => {
//   const [admins, setAdmins] = useState<Admin[]>([]);
//   const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedAdminId, setSelectedAdminId] = useState<number | "">("");
//   const [selectedWarehouseId, setSelectedWarehouseId] = useState<number | "">("");

//   useEffect(() => {
//     fetchAdmins();
//     fetchWarehouses();
//   }, []);

//   const fetchAdmins = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await axios.get<Admin[]>(`${BACKEND_URL}/api/v1/admin`);
//       setAdmins(response.data);
//     } catch (err) {
//       setError("Failed to fetch admins");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchWarehouses = async () => {
//     try {
//       const response = await axios.get<Warehouse[]>(`${BACKEND_URL}/api/v1/warehouse`);
//       setWarehouses(response.data);
//     } catch (err) {
//       console.error("Failed to fetch warehouses", err);
//     }
//   };

//   const assignWarehouseAdmin = async () => {
//     if (!selectedAdminId || !selectedWarehouseId) {
//       console.error("Admin or Warehouse not selected");
//       return;
//     }
  
//     try {
//       const token = localStorage.getItem("token"); // Ambil token dari localStorage
//       if (!token) {
//         console.error("No token found. User might not be logged in.");
//         return;
//       }
  
//       const payload = {
//         userId: selectedAdminId, 
//         warehouseId: selectedWarehouseId,
//       };
  
//       console.log("Sending payload:", payload);
  
//       await axios.post(
//         `${BACKEND_URL}/api/v1/warehouse-admins/assign`, 
//         {
//           headers: {
//             Authorization: `Bearer ${token}`, 
//             "Content-Type": "application/json",
//           },
//         }
//       );
  
//       setSelectedAdminId("");
//       setSelectedWarehouseId("");
//     } catch (err) {
//       console.error("Failed to assign admin", err);
//     }
//   };
  
  
  

//   return (
//     <div className="flex min-h-screen flex-col bg-gray-100 text-black">
//       <Header />
//       <Navbar />
//       <div className="flex flex-grow">
//         <AdminSidebarPanel />
//       <div className="flex-grow p-6 bg-white shadow-md">
//         <h1 className="text-2xl font-bold mb-4">🏭 Assign Admin to Warehouse</h1>
//         {error && <div className="text-red-500 mb-4">{error}</div>}

//         {/* Assign Admin to Warehouse */}
//         <div className="mb-4">
//           <h2 className="text-lg font-semibold">Select Admin and Warehouse</h2>
//           <select className="border p-2 mr-2 text-black" value={selectedAdminId} onChange={(e) => setSelectedAdminId(Number(e.target.value))}>
//             <option value="" className="text-black">Select Admin</option>
//             {admins.map((admin) => (
//               <option key={admin.id} value={admin.id} className="text-black">{admin.fullname}</option>
//             ))}
//           </select>
//           <select className="border p-2 mr-2 text-black" value={selectedWarehouseId} onChange={(e) => setSelectedWarehouseId(Number(e.target.value))}>
//             <option value="" className="text-black">Select Warehouse</option>
//             {warehouses.map((warehouse) => (
//               <option key={warehouse.id} value={warehouse.id} className="text-black">{warehouse.name}</option>
//             ))}
//           </select>
//           <button className="bg-blue-500 text-white px-4 py-2" onClick={assignWarehouseAdmin}>Assign</button>
//         </div>
//       </div>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default AssignWarehouseAdminPage;
