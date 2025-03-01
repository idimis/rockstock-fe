"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAccessToken } from "@/lib/utils/auth";
import { IoIosPin } from "react-icons/io";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface Address {
  id: number;
  label: string;
  addressDetail: string;
  note?: string;
  isMain: boolean;
}

interface NearestWarehouse {
  id: number;
  name: string;
  address: string;
  latitude: string;
  longitude: string;
}

interface AddressComponentProps {
  addressId: number | null;
  setAddressId: (id: number) => void;
}

const AddressComponent: React.FC<AddressComponentProps> = ({ addressId, setAddressId }) => {
  const [defaultAddress, setDefaultAddress] = useState<Address | null>(null);
  const [nearestWarehouse, setNearestWarehouse] = useState<NearestWarehouse | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const accessToken = getAccessToken();

  useEffect(() => {
    if (!accessToken) return;

    const fetchAddresses = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/addresses`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const addressList = response.data?.data;

        if (Array.isArray(addressList)) {
          const mainAddress = addressList.find((addr: Address) => addr.isMain) || addressList[0];
          setDefaultAddress(mainAddress);
          setAddressId(mainAddress.id)
          setAddresses(addressList);
        } else {
          throw new Error("Invalid API response format: 'data' is not an array");
        }
      } catch (err: any) {
        console.error("Failed to fetch addresses:", err.response?.data || err.message);
        setError("Failed to fetch addresses");
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [setAddressId]);

  const handleChangeAddress = () => {
    setShowPopup(true);
  };

  const handleSelectAddress = (address: Address) => {
    setDefaultAddress(address);
    setAddressId(address.id)
    setShowPopup(false);
  };

  if (loading) return <p className="text-gray-800">Loading address...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-white shadow-md rounded-lg mb-4">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Shipping Address</h2>
      {defaultAddress ? (
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <div className="flex gap-2 items-center">
              <IoIosPin color="red" />
              <p className="font-semibold text-gray-900">{defaultAddress.label}</p>
            </div>
            <p className="text-gray-800">{defaultAddress.addressDetail}</p>
            {defaultAddress.note && <p className="text-gray-700 text-sm">{defaultAddress.note}</p>}
          </div>
          <button
            className="bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded-full"
            onClick={handleChangeAddress}
          >
            Change
          </button>
        </div>
      ) : (
        <p className="text-gray-800">No address found.</p>
      )}

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Address</h3>
            {addresses.map((address) => (
              <div key={address.id} className="p-3 border-b border-gray-300">
                <div className="flex justify-between">
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold text-black">{address.label}</p>
                    <p className="text-gray-800">{address.addressDetail}</p>
                    {address.note && <p className="text-gray-700 text-sm">{address.note}</p>}
                  </div>
                  <button
                    className="my-4 px-4 py-2 bg-red-500 text-white rounded-lg items-center"
                    onClick={() => handleSelectAddress(address)}
                  >
                    Choose
                  </button>
                </div>
              </div>
            ))}
            <button
              className="mt-4 px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg w-full"
              onClick={() => setShowPopup(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressComponent;
