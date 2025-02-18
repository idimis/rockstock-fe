"use client";

import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import Navbar from "@/components/common/Navbar";

const locations = [
  {
    id: 1,
    name: "Jakarta Warehouse",
    address: "Jl. Jakarta No. 10, Jakarta, Indonesia",
    lat: -6.2088,
    lng: 106.8456,
    contact: "021-1234567",
    services: "Furniture, Customer Pickup, Delivery",
  },
  {
    id: 2,
    name: "Surabaya Warehouse",
    address: "Jl. Surabaya No. 5, Surabaya, Indonesia",
    lat: -7.2504,
    lng: 112.7688,
    contact: "031-7654321",
    services: "Furniture, Delivery",
  },
  {
    id: 3,
    name: "Medan Warehouse",
    address: "Jl. Medan No. 8, Medan, Indonesia",
    lat: 3.5952,
    lng: 98.6722,
    contact: "061-9876543",
    services: "Furniture, Customer Pickup",
  },
];

const WarehouseInfoPage: React.FC = () => {
  return (
    <>
      <Header />
      <Navbar />
      <div className="flex flex-col min-h-screen bg-light-gray">
        <div className="text-center p-8">
          <h1 className="text-4xl font-bold text-red-600 mb-4">
            Rockstock Locations Across Indonesia
          </h1>
          <p className="text-gray-600 mb-6">
            Find the nearest Rockstock warehouse for all your furniture needs.
            You can visit our stores for personalized services or choose delivery
            options to have products shipped to your location.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row justify-between p-8">
          {/* Left Column: List of Locations */}
          <div className="w-full lg:w-1/3">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Our Locations
            </h2>
            <ul className="space-y-4">
              {locations.map((location) => (
                <li key={location.id} className="bg-white p-4 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold text-red-600">{location.name}</h3>
                  <p className="text-gray-700">{location.address}</p>
                  <p className="text-gray-700">Contact: {location.contact}</p>
                  <p className="text-gray-700">Services: {location.services}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column: Dummy Map with Pinpoints */}
          <div className="w-full lg:w-2/3 h-96">
            <iframe
              title="Google Maps"
              width="100%"
              height="100%"
              src={`https://www.google.com/maps/d/embed?mid=1Hf61w1ohweghlId0JH3xKJKhBYr1xh0o&hl=en`}
              style={{ border: 0 }}
              allowFullScreen
            ></iframe>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default WarehouseInfoPage;
