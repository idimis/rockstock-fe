"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Header from "@/components/common/Header";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import UserSidebarPanel from "@/components/common/UserSidebar";

// Define types for the address and city state
type Address = {
  city_id: string;
  city_name: string;
};

type ShippingCostResponse = {
  value: number;
};

const ShippingCalculation = () => {
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [shippingCost, setShippingCost] = useState<number | null>(null);
  const [destinationOptions, setDestinationOptions] = useState<any[]>([]);
  const [selectedCourier, setSelectedCourier] = useState("jne");
  const router = useRouter();
  const apiKey = "YOUR_API_KEY_HERE";

  const fetchDestinations = async (city: string) => {
    try {
      const response = await axios.get("https://rajaongkir.komerce.id/api/v1/destination/domestic-destination", {
        params: { search: city, limit: 10 },
        headers: {
          "Authorization": `Bearer ${apiKey}`,
        },
      });
      setDestinationOptions(response.data.results);
    } catch (error) {
      console.error("Error fetching destinations:", error);
      alert("Failed to fetch destination data.");
    }
  };

  const calculateShipping = async () => {
    if (!selectedAddress || !destinationOptions.length) return;

    const origin = selectedAddress.city_id; // Corrected property
    const destination = destinationOptions[0].city_id; // Corrected property
    const weight = 1000;
    const courier = selectedCourier;

    try {
      const response = await axios.post(
        "https://rajaongkir.komerce.id/api/v1/calculate/domestic-cost",
        {
          origin,
          destination,
          weight,
          courier,
          price: "lowest",
        },
        {
          headers: {
            "Authorization": `Bearer ${apiKey}`,
          },
        }
      );
      const costData = response.data.results[0].costs[0];
      setShippingCost(costData.value);
    } catch (error) {
      console.error("Error calculating shipping cost:", error);
      alert("Failed to calculate shipping cost.");
    }
  };

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedCity = event.target.value;
    setSelectedAddress({ city_id: selectedCity, city_name: selectedCity });
    fetchDestinations(selectedCity);
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-100 text-black">
      <Header />
      <Navbar />
      <div className="flex flex-grow">
        <UserSidebarPanel />
        <main className="flex-grow p-6 bg-white shadow-md">
          <h1 className="text-2xl font-bold mb-4">🚚 Shipping Calculation</h1>

          <div className="p-4 bg-gray-100 shadow rounded-lg">
            {/* City selection for shipping calculation */}
            <input
              type="text"
              placeholder="Enter City"
              className="w-full p-2 border rounded-lg mt-2"
              onChange={handleAddressChange}
            />

            {/* Select destination options */}
            {destinationOptions.length > 0 && (
              <select
                className="w-full p-2 border rounded-lg mt-4"
                onChange={(e) => setSelectedCourier(e.target.value)}
                value={selectedCourier}
              >
                <option value="jne">JNE</option>
                <option value="sicepat">SiCepat</option>
                <option value="jnt">J&T</option>
              </select>
            )}

            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500"
              onClick={calculateShipping}
            >
              Calculate Shipping Cost
            </button>

            {shippingCost !== null && (
              <p className="mt-4 text-lg font-semibold">Estimated Shipping Cost: Rp {shippingCost}</p>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default ShippingCalculation;
