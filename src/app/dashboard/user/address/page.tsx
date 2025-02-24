"use client";

import { useEffect, useState } from "react";
import Header from "@/components/common/Header";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import UserSidebarPanel from "@/components/common/UserSidebar";
import axios from "axios";

interface Address {
  id: number;
  label: string;
  addressDetail: string;
  longitude: number;
  latitude: number;
  note: string;
  isMain: boolean;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const AddressPage = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      fetchUserAddresses();
    }
  }, [userId]);

  const fetchUserAddresses = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("accessToken");

    if (!userId || !token) {
      setError("You are not logged in");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${BACKEND_URL}/api/v1/addresses/users`, {
        params: { userId },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success && response.data.data) {
        setAddresses(response.data.data);
      } else {
        setError("Failed to retrieve address data");
      }
    } catch (err) {
      setError("Error fetching addresses");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  
  const setMainAddress = async (addressId: number) => {
    const token = localStorage.getItem("accessToken");
    if (!userId || !token) return;

    try {
      await axios.get(`${BACKEND_URL}/api/v1/addresses/user/${userId}/main`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUserAddresses();
    } catch (err) {
      console.error("Failed to set main address", err);
    }
  };

  // Update Address
  const updateAddress = async () => {
    if (!selectedAddress) return;
    const token = localStorage.getItem("accessToken");

    try {
      await axios.put(
        `${BACKEND_URL}/api/v1/addresses/${selectedAddress.id}/user/${userId}`,
        selectedAddress,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditModalOpen(false);
      fetchUserAddresses();
    } catch (err) {
      console.error("Failed to update address", err);
    }
  };

  // Delete Address
  const deleteAddress = async (addressId: number) => {
    const token = localStorage.getItem("accessToken");
    if (!userId || !token) return;

    try {
      await axios.put(
        `${BACKEND_URL}/api/v1/addresses/soft-delete/${addressId}/user/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUserAddresses();
    } catch (err) {
      console.error("Failed to delete address", err);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 text-black">
      <Header />
      <Navbar />
      <div className="flex flex-grow">
        <UserSidebarPanel />
        <main className="flex-grow p-6 bg-white shadow-md">
          <h1 className="text-2xl font-bold mb-4">📍 My Addresses</h1>

          {error && <div className="text-red-500 mb-4">{error}</div>}

          <div className="p-4 bg-blue-100 shadow rounded-lg">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <ul>
                {addresses.length > 0 ? (
                  addresses.map((address) => (
                    <li key={address.id} className="mt-2 p-3 bg-white rounded-lg shadow">
                      <div>
                        <h3 className="font-semibold">{address.label}</h3>
                        <p>{address.addressDetail}</p>
                        <p>{address.isMain ? "✅ Main Address" : "Secondary Address"}</p>
                      </div>
                      <div className="mt-2 flex gap-2">
                        {!address.isMain && (
                          <button
                            className="px-4 py-2 bg-green-500 text-white rounded"
                            onClick={() => setMainAddress(address.id)}
                          >
                            Set as Main
                          </button>
                        )}
                        <button
                          className="px-4 py-2 bg-yellow-500 text-white rounded"
                          onClick={() => {
                            setSelectedAddress(address);
                            setEditModalOpen(true);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="px-4 py-2 bg-red-500 text-white rounded"
                          onClick={() => deleteAddress(address.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))
                ) : (
                  <p>No addresses found</p>
                )}
              </ul>
            )}
          </div>
        </main>
      </div>
      <Footer />

      {/* Edit Modal */}
      {editModalOpen && selectedAddress && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Edit Address</h2>
            <input
              type="text"
              className="border p-2 w-full mb-2"
              placeholder="Label"
              value={selectedAddress.label}
              onChange={(e) => setSelectedAddress({ ...selectedAddress, label: e.target.value })}
            />
            <input
              type="text"
              className="border p-2 w-full mb-2"
              placeholder="Address Detail"
              value={selectedAddress.addressDetail}
              onChange={(e) =>
                setSelectedAddress({ ...selectedAddress, addressDetail: e.target.value })
              }
            />
            <input
              type="text"
              className="border p-2 w-full mb-2"
              placeholder="Longitude"
              value={selectedAddress.longitude}
              onChange={(e) =>
                setSelectedAddress({ ...selectedAddress, longitude: parseFloat(e.target.value) })
              }
            />
            <input
              type="text"
              className="border p-2 w-full mb-2"
              placeholder="Latitude"
              value={selectedAddress.latitude}
              onChange={(e) =>
                setSelectedAddress({ ...selectedAddress, latitude: parseFloat(e.target.value) })
              }
            />
            <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2" onClick={updateAddress}>
              Save
            </button>
            <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setEditModalOpen(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressPage;
