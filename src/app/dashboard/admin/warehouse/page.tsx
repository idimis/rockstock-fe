"use client";

import { useEffect, useState } from "react";
import Header from "@/components/common/Header";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import AdminSidebarPanel from "@/components/common/AdminSidebar";
import axios from "axios";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import Dialog from "@/components/ui/Dialog";


const Map = dynamic(() => import("@/components/common/Map"), { ssr: false });

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface Warehouse {
  id: number;
  name: string;
  address: string;
  longitude: string;
  latitude: string;
  cityId: string;
}

const WarehousePage = () => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [newWarehouse, setNewWarehouse] = useState<Omit<Warehouse, "id">>({
    name: "",
    address: "",
    longitude: "",
    latitude: "",
    cityId: "",
  });
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);
  const [adminWarehouseId, setAdminWarehouseId] = useState<number | null>(null);
  const [adminId, setAdminId] = useState<number | "">("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<Warehouse[]>(`${BACKEND_URL}/api/v1/warehouse`);
      setWarehouses(response.data);
    } catch (err) {
      setError("Failed to fetch warehouses");
    } finally {
      setLoading(false);
    }
  };

  const createWarehouse = async () => {
    try {
      await axios.post(`${BACKEND_URL}/api/v1/warehouse`, newWarehouse);
      setNewWarehouse({ name: "", address: "", longitude: "", latitude: "", cityId: "" });
      fetchWarehouses();
    } catch (err) {
      console.error("Failed to create warehouse", err);
    }
  };

  const updateWarehouse = async () => {
    try {
      if (editingWarehouse) {
        await axios.put(`${BACKEND_URL}/api/v1/warehouse/${editingWarehouse.id}`, editingWarehouse);
        setEditingWarehouse(null);
      }
      fetchWarehouses();
    } catch (err) {
      console.error("Failed to update warehouse", err);
    }
  };


  const deleteWarehouse = async (id: number) => {
    try {
      await axios.delete(`${BACKEND_URL}/api/v1/warehouse/${id}`);
      fetchWarehouses();
    } catch (err) {
      console.error("Failed to delete warehouse", err);
    }
  };

  const assignAdmin = async () => {
    if (!adminWarehouseId || !adminId) return;
    try {
      await axios.post(`${BACKEND_URL}/api/v1/warehouse/assign-admin`, {
        warehouseId: adminWarehouseId,
        adminId: adminId,
      });
      setAdminWarehouseId(null);
      setAdminId("");
    } catch (err) {
      console.error("Failed to assign admin", err);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 text-black">
      <Header />
      <Navbar />
      <div className="flex flex-grow">
      <AdminSidebarPanel />
      <div className="flex-grow p-6 bg-white shadow-md">
        <h1 className="text-2xl font-bold mb-4">🏭 Warehouses</h1>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        {/* Add/Edit Warehouse */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold">{editingWarehouse ? "✏️ Edit Warehouse" : "➕ Add Warehouse"}</h2>
          <input
            type="text"
            placeholder="Warehouse Name"
            className="border p-2 mr-2"
            value={editingWarehouse ? editingWarehouse.name : newWarehouse.name}
            onChange={(e) =>
              editingWarehouse
                ? setEditingWarehouse({ ...editingWarehouse, name: e.target.value })
                : setNewWarehouse({ ...newWarehouse, name: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-2 mr-2"
            value={editingWarehouse ? editingWarehouse.address : newWarehouse.address}
            onChange={(e) =>
              editingWarehouse
                ? setEditingWarehouse({ ...editingWarehouse, address: e.target.value })
                : setNewWarehouse({ ...newWarehouse, address: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="City ID"
            className="border p-2 mr-2"
            value={editingWarehouse ? editingWarehouse.cityId : newWarehouse.cityId}
            onChange={(e) =>
              editingWarehouse
                ? setEditingWarehouse({ ...editingWarehouse, cityId: e.target.value })
                : setNewWarehouse({ ...newWarehouse, cityId: e.target.value })
            }
          />

          <div className="mt-4">
            <h2 className="text-lg font-semibold">📍 Select Location</h2>
            <Map
              latitude={editingWarehouse ? parseFloat(editingWarehouse.latitude) : -7.5596}
              longitude={editingWarehouse ? parseFloat(editingWarehouse.longitude) : 110.8253}
              setCoordinates={(lat, lng) =>
                editingWarehouse
                  ? setEditingWarehouse({ ...editingWarehouse, latitude: lat.toString(), longitude: lng.toString() })
                  : setNewWarehouse({ ...newWarehouse, latitude: lat.toString(), longitude: lng.toString() })
              }
            />
          </div>

          <button className="bg-green-500 text-white px-4 py-2 mt-4" onClick={createWarehouse}>
            {editingWarehouse ? "Update Warehouse" : "Add Warehouse"}
          </button>
        </div>

        {/* Assign Admin */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold">👤 Assign Admin</h2>
          <input type="number" placeholder="Warehouse ID" className="border p-2 mr-2" value={adminWarehouseId || ""} onChange={(e) => setAdminWarehouseId(Number(e.target.value))} />
          <input type="number" placeholder="Admin ID" className="border p-2 mr-2" value={adminId} onChange={(e) => setAdminId(Number(e.target.value))} />
          <button className="bg-blue-500 text-white px-4 py-2" onClick={assignAdmin}>Assign Admin</button>
        </div>

                {/* Modal Edit Warehouse */}
                {isModalOpen && (
          <Dialog onClose={() => setIsModalOpen(false)}>
            <h2 className="text-lg font-semibold">✏️ Edit Warehouse</h2>
            <input type="text" placeholder="Warehouse Name" className="border p-2 mr-2" value={editingWarehouse?.name || ""} onChange={(e) => setEditingWarehouse({ ...editingWarehouse!, name: e.target.value })} />
            <input type="text" placeholder="Address" className="border p-2 mr-2" value={editingWarehouse?.address || ""} onChange={(e) => setEditingWarehouse({ ...editingWarehouse!, address: e.target.value })} />
            <button className="bg-green-500 text-white px-4 py-2 mt-4" onClick={updateWarehouse}>Save</button>
          </Dialog>
        )}

        {/* Warehouse List */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {warehouses.map((warehouse) => (
              <li key={warehouse.id} className="p-3 bg-white rounded-lg shadow mb-2">
                <h3 className="font-semibold">{warehouse.name}</h3>
                <p>{warehouse.address}</p>
                <button className="bg-yellow-500 text-white px-2 py-1 mr-2" onClick={() => { setEditingWarehouse(warehouse); setIsModalOpen(true); }}>Edit</button>
                <button className="bg-red-500 text-white px-2 py-1" onClick={() => deleteWarehouse(warehouse.id)}>Delete</button>
              </li>
            ))}
          </ul>
)}
      </div>
      </div>
      <Footer />
    </div>
  );
};

export default WarehousePage;
