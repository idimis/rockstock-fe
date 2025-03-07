"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAccessToken } from "@/lib/utils/auth";
import { IoIosPin } from "react-icons/io";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const accessToken = getAccessToken();

interface Address {
  addressId: number;
  label: string;
  addressDetail: string;
  latitude: string;
  longitude: string;
  note?: string;
  isMain: boolean;
  addressPostalCode: string;
}

interface Warehouse {
  id: number;
  name: string;
  address: string;
  latitude: string;
  longitude: string;
  subDistrictPostalCode: string;
}

interface AddressComponentProps {
  addressId: number | null;
  setAddressId: (id: number) => void;
  addressPostalCode: string | null;
  setAddressPostalCode: (addressPostalCode: string) => void;
  nearestWarehouse: Warehouse | null;
  setNearestWarehouse: (warehouse: Warehouse | null) => void;
}

const AddressComponent: React.FC<AddressComponentProps> = ({ 
  addressId, setAddressId, 
  addressPostalCode, setAddressPostalCode, 
  nearestWarehouse, setNearestWarehouse
}) => {
  const [defaultAddress, setDefaultAddress] = useState<Address | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAddresses = async (attempt = 1) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/addresses`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const addressList = response.data?.data;
      if (Array.isArray(addressList)) {
        const mainAddress = addressList.find((addr: Address) => addr.isMain) || addressList[0];

        if (mainAddress) {
          console.log("Default Address ID:", mainAddress.id);
          setDefaultAddress(mainAddress);
          setAddressId(mainAddress.id);
          setAddressPostalCode(mainAddress.addressPostalCode)
        }
        setAddresses(addressList);
      } else {
        throw new Error("Invalid API response format: 'data' is not an array");
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message;
      console.error("Failed to fetch addresses:", errorMessage);

      if (errorMessage.includes("JDBC")) {
        const retryDelay = Math.min(2 ** attempt * 1000, 30000);
        console.warn(`Retrying fetchAddresses in ${retryDelay / 1000}s...`);
        setTimeout(() => fetchAddresses(attempt + 1), retryDelay);
      } else {
        setError("Failed to fetch addresses");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchWarehouses = async (attempt = 1) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/warehouses`);
      const warehouseList = response.data;
      setWarehouses(warehouseList);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message;
      console.error("Failed to fetch warehouses:", errorMessage);

      if (errorMessage.includes("JDBC")) {
        const retryDelay = Math.min(2 ** attempt * 1000, 30000);
        console.warn(`Retrying fetchWarehouses in ${retryDelay / 1000}s...`);
        setTimeout(() => fetchWarehouses(attempt + 1), retryDelay);
      } else {
        setError("Failed to fetch warehouses");
      }
    }
  };

  const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const toRadians = (degree: number) => (degree * Math.PI) / 180;
    const R = 6371; // Radius of the Earth in km
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  const findNearestWarehouse = () => {
    if (!defaultAddress || warehouses.length === 0) return;
  
    const { latitude, longitude } = defaultAddress;
    const userLat = parseFloat(latitude);
    const userLon = parseFloat(longitude);
  
    let nearest: Warehouse | null = null;
    let minDistance = Infinity;
  
    warehouses.forEach((warehouse: Warehouse) => {
      const warehouseLat = parseFloat(warehouse.latitude);
      const warehouseLon = parseFloat(warehouse.longitude);
      const distance = haversineDistance(userLat, userLon, warehouseLat, warehouseLon);
  
      if (distance < minDistance) {
        minDistance = distance;
        nearest = warehouse;
      }
    });
  
    if (nearest) {
      setNearestWarehouse(nearest);
    } else {
      console.warn("No nearest warehouse found!");
    }
  };
  

  useEffect(() => {
    if (!accessToken) return;
    fetchAddresses();
  }, [setAddressId]);

  useEffect(() => {
    fetchWarehouses();
  }, []);

  useEffect(() => {
    findNearestWarehouse();
  }, [defaultAddress, warehouses]);

  useEffect(() => {
    console.log("Selected address postal code:", addressPostalCode);
  }, [addressPostalCode]);  

  useEffect(() => {
    if (defaultAddress) {
      setAddressId(defaultAddress.addressId);
      setAddressPostalCode(defaultAddress.addressPostalCode);
    }
  }, [defaultAddress]);  

  const handleChangeAddress = () => {
    setShowPopup(true);
  };

  const handleSelectAddress = (address: Address) => {
    setDefaultAddress(address);
    setAddressId(address.addressId);
    setAddressPostalCode(address.addressPostalCode)
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
            {nearestWarehouse && (
              <p className="text-gray-700 text-sm">
                Nearest Warehouse: <strong>{nearestWarehouse.name}</strong> ({nearestWarehouse.address})
              </p>
            )}
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
              <div key={address.addressId} className="p-3 border-b border-gray-300">
                <div className="flex justify-between">
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold text-black">{address.label}</p>
                    <p className="text-gray-800">{address.addressDetail}</p>
                    {address.note && <p className="text-gray-700 text-sm">{address.note}</p>}
                  </div>
                  <button className="my-4 px-4 py-2 bg-red-500 text-white rounded-lg" onClick={() => handleSelectAddress(address)}>
                    Choose
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressComponent;
