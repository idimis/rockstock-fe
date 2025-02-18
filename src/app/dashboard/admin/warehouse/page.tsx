"use client";

import { useState, useEffect } from "react";
import Header from "@/components/common/Header";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import Sidebar from "@/components/common/AdminSidebar";

type Warehouse = {
  id: number;
  name: string;
  address: string;
  longitude: string;
  latitude: string;
};

const AdminWarehouse = () => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [newWarehouse, setNewWarehouse] = useState({ name: "", address: "", longitude: "", latitude: "" });
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);

  // Simulasi role user (ganti dengan auth JWT dari backend)
  const userRole = "SUPER_ADMIN";

  useEffect(() => {
    fetchWarehouses();
  }, []);

  // Fetch all warehouses
  const fetchWarehouses = async () => {
    try {
      const response = await fetch("/api/v1/warehouse");
      if (!response.ok) throw new Error("Failed to fetch warehouses");
      const data: Warehouse[] = await response.json();
      setWarehouses(data);
    } catch (error) {
      console.error("Error fetching warehouses:", error);
    } finally {
      setLoading(false);
    }
  };

  // Create Warehouse
  const createWarehouse = async () => {
    try {
      const response = await fetch("/api/v1/warehouse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newWarehouse),
      });
      if (!response.ok) throw new Error("Failed to create warehouse");
      fetchWarehouses();
    } catch (error) {
      console.error("Error creating warehouse:", error);
    }
  };

  // Update Warehouse
  const updateWarehouse = async () => {
    if (!selectedWarehouse) return;
    try {
      const response = await fetch(`/api/v1/warehouse/${selectedWarehouse.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedWarehouse),
      });
      if (!response.ok) throw new Error("Failed to update warehouse");
      fetchWarehouses();
      setSelectedWarehouse(null);
    } catch (error) {
      console.error("Error updating warehouse:", error);
    }
  };

  // Delete Warehouse
  const deleteWarehouse = async (id: number) => {
    try {
      await fetch(`/api/v1/warehouse/${id}`, { method: "DELETE" });
      fetchWarehouses();
    } catch (error) {
      console.error("Error deleting warehouse:", error);
    }
  };

  // Proteksi: hanya Super Admin yang bisa akses fitur ini
  if (userRole !== "SUPER_ADMIN") {
    return <p className="text-center mt-10 text-red-600">❌ Access Denied: Only Super Admin can manage warehouses.</p>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 text-black">
      <Header />
      <Navbar />
      <div className="flex flex-grow">
        <Sidebar />
        <main className="flex-grow p-6 bg-white shadow-md">
          <h1 className="text-xl font-bold mb-4">Warehouse Management</h1>

          {/* Form untuk tambah warehouse */}
          <div className="mb-6 p-4 bg-gray-50 rounded shadow">
            <h3 className="text-lg font-semibold mb-2">➕ Add Warehouse</h3>
            <input type="text" placeholder="Name" className="p-2 border rounded w-full mb-2" onChange={(e) => setNewWarehouse({ ...newWarehouse, name: e.target.value })} />
            <input type="text" placeholder="Address" className="p-2 border rounded w-full mb-2" onChange={(e) => setNewWarehouse({ ...newWarehouse, address: e.target.value })} />
            <input type="text" placeholder="Longitude" className="p-2 border rounded w-full mb-2" onChange={(e) => setNewWarehouse({ ...newWarehouse, longitude: e.target.value })} />
            <input type="text" placeholder="Latitude" className="p-2 border rounded w-full mb-2" onChange={(e) => setNewWarehouse({ ...newWarehouse, latitude: e.target.value })} />
            <button onClick={createWarehouse} className="p-2 bg-blue-600 text-white rounded">Save</button>
          </div>

          {/* List warehouse */}
          {loading ? (
            <p>Loading warehouses...</p>
          ) : (
            <table className="w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Warehouse ID</th>
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Location</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {warehouses.map((warehouse) => (
                  <tr key={warehouse.id}>
                    <td className="border p-2">{warehouse.id}</td>
                    <td className="border p-2">{warehouse.name}</td>
                    <td className="border p-2">{warehouse.address}</td>
                    <td className="border p-2">
                      <button onClick={() => setSelectedWarehouse(warehouse)} className="bg-yellow-500 text-white px-3 py-1 rounded mr-2">Edit</button>
                      <button onClick={() => deleteWarehouse(warehouse.id)} className="bg-red-600 text-white px-3 py-1 rounded">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Form Edit Warehouse */}
          {selectedWarehouse && (
            <div className="mt-6 p-4 bg-gray-50 rounded shadow">
              <h3 className="text-lg font-semibold mb-2">✏️ Edit Warehouse</h3>
              <input type="text" value={selectedWarehouse.name} className="p-2 border rounded w-full mb-2" onChange={(e) => setSelectedWarehouse({ ...selectedWarehouse, name: e.target.value })} />
              <input type="text" value={selectedWarehouse.address} className="p-2 border rounded w-full mb-2" onChange={(e) => setSelectedWarehouse({ ...selectedWarehouse, address: e.target.value })} />
              <input type="text" value={selectedWarehouse.longitude} className="p-2 border rounded w-full mb-2" onChange={(e) => setSelectedWarehouse({ ...selectedWarehouse, longitude: e.target.value })} />
              <input type="text" value={selectedWarehouse.latitude} className="p-2 border rounded w-full mb-2" onChange={(e) => setSelectedWarehouse({ ...selectedWarehouse, latitude: e.target.value })} />
              <button onClick={updateWarehouse} className="p-2 bg-green-600 text-white rounded">Update</button>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default AdminWarehouse;
