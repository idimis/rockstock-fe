"use client";

import { useState, useEffect } from "react";
import Header from "@/components/common/Header";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import Sidebar from "@/components/common/AdminSidebar";
import axios from "axios";

// Define the type for the admin object
type Admin = {
  id: string;
  username: string;
  email: string;
  role: "Warehouse Admin" | "Super Admin";
};

const AdminManagement = () => {
  // Define the state types properly
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [newAdmin, setNewAdmin] = useState<Admin>({
    id: "", // id will be populated if editing
    username: "",
    email: "",
    role: "Warehouse Admin",
  });
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);

  useEffect(() => {
    // Fetch admins from the backend
    const fetchAdmins = async () => {
      const response = await axios.get("/api/v1/admin");
      setAdmins(response.data);
    };

    fetchAdmins();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewAdmin((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAdmin) {
        // Update admin
        await axios.put(`/api/v1/admin/${editingAdmin.id}`, newAdmin);
      } else {
        // Create new admin
        await axios.post("/api/v1/admin", newAdmin);
      }
      setNewAdmin({ id: "", username: "", email: "", role: "Warehouse Admin" });
      setEditingAdmin(null);
      // Refetch the admins list
      const response = await axios.get("/api/v1/admin");
      setAdmins(response.data);
    } catch (error) {
      console.error("Error creating or updating admin:", error);
    }
  };

  const handleEdit = (admin: Admin) => {
    setEditingAdmin(admin);
    setNewAdmin({
      id: admin.id,
      username: admin.username,
      email: admin.email,
      role: admin.role,
    });
  };

  const handleDelete = async (adminId: string) => {
    try {
      await axios.delete(`/api/v1/admin/${adminId}`);
      // Refetch the admins list after deletion
      const response = await axios.get("/api/v1/admin");
      setAdmins(response.data);
    } catch (error) {
      console.error("Error deleting admin:", error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 text-black">
      <Header />
      <Navbar />
      <div className="flex flex-grow">
        <Sidebar />
        {/* Content */}
        <main className="flex-grow p-6 bg-white shadow-md">
          <h1 className="text-xl font-bold mb-4">Admin Management</h1>

          {/* Admin Creation/Editing Form */}
          <div className="p-4 bg-gray-200 shadow rounded-lg mb-6">
            <h2 className="text-lg font-bold mb-4">{editingAdmin ? "Edit Admin" : "Create New Admin"}</h2>
            <form onSubmit={handleAdminSubmit}>
              <input
                type="text"
                name="username"
                value={newAdmin.username}
                onChange={handleInputChange}
                placeholder="Username"
                className="w-full p-2 mb-2 border rounded-lg"
                required
              />
              <input
                type="email"
                name="email"
                value={newAdmin.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="w-full p-2 mb-2 border rounded-lg"
                required
              />
              <select
                name="role"
                value={newAdmin.role}
                onChange={handleInputChange}
                className="w-full p-2 mb-4 border rounded-lg"
              >
                <option value="Warehouse Admin">Warehouse Admin</option>
                <option value="Super Admin">Super Admin</option>
              </select>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
              >
                {editingAdmin ? "Update Admin" : "Create Admin"}
              </button>
            </form>
          </div>

          {/* Admin List Table */}
          <h2 className="text-xl font-bold mb-4">Admin Users</h2>
          <table className="w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Username</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Role</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.id}>
                  <td className="border p-2">{admin.username}</td>
                  <td className="border p-2">{admin.email}</td>
                  <td className="border p-2">{admin.role}</td>
                  <td className="border p-2">
                    <button
                      className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                      onClick={() => handleEdit(admin)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded"
                      onClick={() => handleDelete(admin.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default AdminManagement;
