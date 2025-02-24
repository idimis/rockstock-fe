"use client";

import { useEffect, useState } from "react";
import Header from "@/components/common/Header";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import AdminSidebarPanel from "@/components/common/AdminSidebar";
import axios from "axios";
import Dialog from "@/components/ui/Dialog";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface Admin {
  id: number;
  name: string;
  email: string;
  role: string;
}

const AdminPage = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [newAdmin, setNewAdmin] = useState<Omit<Admin, "id">>({
    name: "",
    email: "",
    role: "",
  });
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<Admin[]>(`${BACKEND_URL}/api/v1/admin`);
      setAdmins(response.data);
    } catch (err) {
      setError("Failed to fetch admins");
    } finally {
      setLoading(false);
    }
  };

  const createAdmin = async () => {
    try {
      await axios.post(`${BACKEND_URL}/api/v1/admin`, newAdmin);
      setNewAdmin({ name: "", email: "", role: "" });
      fetchAdmins();
    } catch (err) {
      console.error("Failed to create admin", err);
    }
  };

  const updateAdmin = async () => {
    try {
      if (editingAdmin) {
        await axios.put(`${BACKEND_URL}/api/v1/admin/${editingAdmin.id}`, editingAdmin);
        setEditingAdmin(null);
      }
      fetchAdmins();
    } catch (err) {
      console.error("Failed to update admin", err);
    }
  };

  const deleteAdmin = async (id: number) => {
    try {
      await axios.delete(`${BACKEND_URL}/api/v1/admin/${id}`);
      fetchAdmins();
    } catch (err) {
      console.error("Failed to delete admin", err);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 text-black">
      <Header />
      <Navbar />
      <div className="flex flex-grow">
        <AdminSidebarPanel />
      <div className="flex-grow p-6 bg-white shadow-md">
        <h1 className="text-2xl font-bold mb-4">👤 Admins</h1>
        {error && <div className="text-red-500 mb-4">{error}</div>}

        {/* Modal Edit Admin */}
        {isModalOpen && (
          <Dialog onClose={() => setIsModalOpen(false)}>
            <h2 className="text-lg font-semibold">✏️ Edit Admin</h2>
            <input type="text" placeholder="Admin Name" className="border p-2 mr-2" value={editingAdmin?.name || ""} onChange={(e) => setEditingAdmin({ ...editingAdmin!, name: e.target.value })} />
            <input type="text" placeholder="Email" className="border p-2 mr-2" value={editingAdmin?.email || ""} onChange={(e) => setEditingAdmin({ ...editingAdmin!, email: e.target.value })} />
            <button className="bg-green-500 text-white px-4 py-2 mt-4" onClick={updateAdmin}>Save</button>
          </Dialog>
        )}

        {/* Admin List */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ul>
            {admins.map((admin) => (
              <li key={admin.id} className="p-3 bg-white rounded-lg shadow mb-2">
                <h3 className="font-semibold">{admin.name} ({admin.role})</h3>
                <p>{admin.email}</p>
                <button className="bg-yellow-500 text-white px-2 py-1 mr-2" onClick={() => { setEditingAdmin(admin); setIsModalOpen(true); }}>Edit</button>
                <button className="bg-red-500 text-white px-2 py-1" onClick={() => deleteAdmin(admin.id)}>Delete</button>
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

export default AdminPage;
