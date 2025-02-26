'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BiSolidUser, BiSolidHeart } from 'react-icons/bi';
import { FaCartShopping } from 'react-icons/fa6';
import { FiSearch } from 'react-icons/fi';
import axios from 'axios';
import logoImage from "@/public/rockstock1.svg";

const Navbar = () => {
  const [isActive, setIsActive] = useState<string>('');
  const [cartQuantity, setCartQuantity] = useState<number>(0);

  // Function to fetch cart quantity from API
  const fetchCartQuantity = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
  
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/carts/active`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (response.data.success && response.data.data) {
        setCartQuantity(response.data.data.itemQuantity || 0);
      } else {
        setCartQuantity(0); // If no items are found, set cart quantity to 0
      }
    } catch (error) {
      console.error("Error fetching cart quantity:", error);
    }
  };  

  useEffect(() => {
    fetchCartQuantity(); // Initial fetch when Navbar mounts

    // Listen for storage event updates
    const handleStorageChange = () => {
      fetchCartQuantity();
    };

    window.addEventListener("storage", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLinkClick = (link: string) => {
    setIsActive(link);
  };

  return (
    <header className="bg-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        {/* Logo */}
        <div>
          <Link href="/">
            <Image src={logoImage} alt="Rockstock Logo" width={400} height={200} />
          </Link>
        </div>

        {/* Search and account section */}
        <div className="flex items-center space-x-6">
          {/* Account & Cart Links */}
          <div className="flex space-x-6">
            {/* Account Icon */}
            <Link
              href="/login"
              className={`inline-flex items-center text-red-600 hover:text-red-600 transition ${
                isActive === '/login' ? 'font-bold' : ''
              }`}
              onClick={() => handleLinkClick('/login')}
            >
              <BiSolidUser className="h-5 w-5" />
            </Link>

            {/* Wishlist Icon */}
            <Link
              href="/wishlist"
              className={`inline-flex items-center text-red-600 hover:text-red-600 transition ${
                isActive === '/wishlist' ? 'font-bold' : ''
              }`}
              onClick={() => handleLinkClick('/wishlist')}
            >
              <BiSolidHeart className="h-5 w-5" />
            </Link>

            {/* Cart Icon with Badge */}
            <Link
              href="/cart"
              className={`relative inline-flex items-center text-red-600 hover:text-red-600 transition ${
                isActive === '/cart' ? 'font-bold' : ''
              }`}
              onClick={() => handleLinkClick('/cart')}
            >
              <FaCartShopping className="h-5 w-5" />
              {cartQuantity > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {cartQuantity}
                </span>
              )}
            </Link>
          </div>

          {/* Search bar */}
          <div className="relative flex-1 max-w-lg ml-6">
            <input
              type="text"
              placeholder="Search furniture..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-600"
            />
            <button className="absolute top-0 right-0 p-2 bg-red-600 rounded-md text-white">
              <FiSearch className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
