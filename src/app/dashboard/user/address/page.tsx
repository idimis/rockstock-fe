"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/common/Header";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import UserSidebarPanel from "@/components/common/UserSidebar";
import axios from "axios";

// Define types for address and event
type Address = {
  id: number;
  street: string;
  city: string;
  province: string;
  isPrimary: boolean;
};

type AddressChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLSelectElement>;

const AddressManagement = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newAddress, setNewAddress] = useState<Address>({
    street: "",
    city: "",
    province: "",
    isPrimary: false,
    id: 0, // Temporarily set to 0 for new addresses
  });

  const router = useRouter();

  // Fetch addresses from the backend
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await axios.get("/api/v1/addresses");
        setAddresses(response.data);
        if (response.data.length > 0) {
          setSelectedAddress(response.data[0]);
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };
    fetchAddresses();
  }, []);

  const handleAddressChange = (event: AddressChangeEvent) => {
    const { name, value } = event.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
  };

  // Add new address
  const addAddress = async () => {
    try {
      const response = await axios.post("/api/v1/addresses", newAddress);
      setAddresses((prev) => [
        ...prev,
        {
          ...newAddress,
          id: Date.now(), // Simulating the new id for the address
        },
      ]);
      setNewAddress({ street: "", city: "", province: "", isPrimary: false, id: 0 });
    } catch (error) {
      console.error("Error adding new address:", error);
    }
  };

  // Mark address as primary
  const setPrimaryAddress = (id: number) => {
    setAddresses((prev) =>
      prev.map((address) =>
        address.id === id ? { ...address, isPrimary: true } : { ...address, isPrimary: false }
      )
    );
  };

  // Delete address
  const deleteAddress = async (id: number) => {
    try {
      await axios.delete(`/api/v1/addresses/${id}`);
      setAddresses((prev) => prev.filter((address) => address.id !== id));
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 text-black">
      <Header />
      <Navbar />
      <div className="flex text-black">
        <UserSidebarPanel />
        <main className="flex-grow p-6 bg-white shadow-md">
          <h1 className="text-2xl font-bold mb-4">📍 Manage Addresses</h1>
          <div className="p-4 bg-gray-100 shadow rounded-lg">
            {addresses.length > 0 ? (
              <select
                className="w-full p-2 border rounded-lg mt-2"
                value={selectedAddress?.id || ""}
                onChange={(e: AddressChangeEvent) => {
                  const selected = addresses.find((a) => a.id === Number(e.target.value));
                  if (selected) setSelectedAddress(selected);
                }}
              >
                {addresses.map((address) => (
                  <option key={address.id} value={address.id}>
                    {address.street}, {address.city}, {address.province} ({address.isPrimary ? "Primary" : ""})
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-red-500">No address found. Please add a new address.</p>
            )}
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
              onClick={() => setIsEditing(true)}
            >
              Add New Address
            </button>
          </div>

          {isEditing && (
            <div className="mt-6 p-4 bg-gray-100 shadow rounded-lg">
              <h2 className="text-xl font-bold mb-4">Add New Address</h2>
              <input
                type="text"
                name="street"
                value={newAddress.street}
                onChange={handleAddressChange}
                placeholder="Street"
                className="w-full p-2 mb-2 border rounded-lg"
              />
              <input
                type="text"
                name="city"
                value={newAddress.city}
                onChange={handleAddressChange}
                placeholder="City"
                className="w-full p-2 mb-2 border rounded-lg"
              />
              <input
                type="text"
                name="province"
                value={newAddress.province}
                onChange={handleAddressChange}
                placeholder="Province"
                className="w-full p-2 mb-2 border rounded-lg"
              />
              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  name="isPrimary"
                  checked={newAddress.isPrimary}
                  onChange={() =>
                    setNewAddress((prev) => ({ ...prev, isPrimary: !prev.isPrimary }))
                  }
                />
                <label className="ml-2">Set as Primary Address</label>
              </div>
              <button
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500"
                onClick={addAddress}
              >
                Add Address
              </button>
            </div>
          )}

          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">Your Addresses</h2>
            {addresses.map((address) => (
              <div key={address.id} className="flex items-center justify-between p-4 bg-gray-200 mb-2 rounded-lg">
                <div>
                  <p>{address.street}, {address.city}, {address.province}</p>
                  {address.isPrimary && <span className="text-green-500">Primary</span>}
                </div>
                <div>
                  <button
                    className="mr-2 text-blue-500"
                    onClick={() => setPrimaryAddress(address.id)}
                  >
                    Set as Primary
                  </button>
                  <button
                    className="text-red-500"
                    onClick={() => deleteAddress(address.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default AddressManagement;
