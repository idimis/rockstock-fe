/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/common/Header";3
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { notFound } from "next/navigation";
import Link from "next/link";
// import { useAuth } from "@/context/AuthContext";

interface User {
  role: string;
}

interface Seller {
  userId: number;
  fullName: string;
  email: string;
  website?: string;
  photoProfileUrl?: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

const ProductPage = ({ params }: any) => {
  const [slug, setSlug] = useState<string>("");
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [seller, setSeller] = useState<Seller | null>(null);
//   const { user } = useAuth() as { user: User | null };

  useEffect(() => {
    const fetchSlug = async () => {
      const paramsData = await params;
      setSlug(paramsData.slug || "");
    };
    fetchSlug();
  }, [params]);

  useEffect(() => {
    const fetchProductFromSlug = async () => {
      setLoading(true);
      try {
        // Uncomment and adjust fetch logic here
        // const response = await fetch(`${BASE_URL}/api/v1/products/${slug}`);
        // const data = await response.json();

        // if (data.success && data.data) {
        //   setProduct(data.data);
        //   if (data.data.sellerId) {
        //     fetchSellerDetails(data.data.sellerId);
        //   } else {
        //     console.error("Seller ID is missing.");
        //   }
        // }
      } catch (error) {
        console.error("Error fetching product details:", error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    const fetchSellerDetails = async (sellerId: number) => {
      try {
        // Uncomment and adjust fetch logic here
        // const response = await fetch(`${BASE_URL}/api/v1/users/${sellerId}/details`);
        // const data = await response.json();
        // if (data.success && data.data) {
        //   setSeller(data.data);
        // } else {
        //   console.error("Failed to fetch seller details:", data.message);
        // }
      } catch (error) {
        console.error("Error fetching seller details:", error);
      }
    };

    if (slug) {
      fetchProductFromSlug();
    }
  }, [slug]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-gray-700">Loading...</div>;
  }

  if (!product) {
    return <div className="flex justify-center items-center h-screen text-gray-700">Product not found</div>;
  }

  const productSlug = product.title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Navbar />
      <main className="flex-grow mx-auto p-6">
        <div className="product-detail max-w-6xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:space-x-8 justify-center items-center">
            <div className="flex-2 md:w-2/3 space-y-4">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-full h-96 object-cover rounded-lg shadow-md mx-auto"
              />
              <div className="space-y-4">
                <h1 className="text-4xl font-semibold text-gray-800">{product.title}</h1>
                <p className="text-gray-500 text-sm">
                  <span className="font-medium">Category: </span>
                  {product.category}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Price: </span>${product.price}
                </p>
                <div className="text-gray-600">
                  <p>
                    <span className="font-medium">Description: </span>
                    {product.description}
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <div className="flex justify-center">
                  {/* {user && user.role === "seller" ? ( */}
                    <Link href={`/products/${productSlug}/edit`}>
                      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Edit Product
                      </button>
                    </Link>
                  ) : (
                    <Link href={`/products/${productSlug}/purchase`}>
                      <button className="bg-gradient-to-r from-orange-600 to-orange-400 text-white py-3 px-6 rounded-lg shadow-md hover:from-orange-500 hover:to-orange-300 transition duration-300">
                        Buy Now
                      </button>
                    </Link>
                  {/* )} */}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12"></div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Seller Details</h2>
            {seller ? (
              <div className="flex flex-col space-y-4 bg-gray-100 p-4 rounded-lg shadow-sm">
                {seller.photoProfileUrl ? (
                  <img
                    src={seller.photoProfileUrl}
                    alt={seller.fullName}
                    className="w-24 h-24 object-cover rounded-full shadow-md ml-0"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-300 rounded-full ml-0"></div>
                )}
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Seller Name: </span>
                  {seller.fullName || "Name Not Available"}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Email: </span>
                  {seller.email || "Email Not Available"}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Website: </span>
                  <a
                    href={seller.website || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600"
                  >
                    {seller.website || "Website Not Available"}
                  </a>
                </p>
                <Link href={`/user/profile/${seller.userId}`} passHref>
                  <button className="bg-gradient-to-r from-gray-400 to-gray-400 text-white py-1 px-2 rounded-lg shadow-md hover:from-orange-500 hover:to-orange-300 transition duration-300">
                    Go to Seller Profile
                  </button>
                </Link>
              </div>
            ) : (
              <p>Loading seller details...</p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductPage;
