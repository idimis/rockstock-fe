import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";

// Fetch categories from API
const fetchCategories = async () => {
  const response = await axios.get("http://localhost:8080/api/v1/categories?page=0&size=10");
  return response.data.data.content; // Extract categories array
};

const ProductCategories: React.FC = () => {
  const { data: categories, isLoading, isError } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const itemsPerPage = 4;
  const [index, setIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right"); // Track scroll direction

  // Memoized visible categories to avoid unnecessary re-renders
  const visibleCategories = useMemo(() => {
    if (!categories) return [];
    return [
      ...categories.slice(index, index + itemsPerPage),
      ...categories.slice(0, Math.max(0, index + itemsPerPage - categories.length)),
    ];
  }, [categories, index]);

  // Smooth scroll effect with directional animation
  const scroll = useCallback(
    (dir: "left" | "right") => {
      if (isAnimating || !categories || categories.length <= itemsPerPage) return;
      setIsAnimating(true);
      setDirection(dir);

      setIndex((prevIndex) =>
        dir === "right"
          ? (prevIndex + 1) % categories.length
          : (prevIndex - 1 + categories.length) % categories.length
      );

      setTimeout(() => setIsAnimating(false), 300); // Ensure animation completes before next click
    },
    [isAnimating, categories]
  );

  if (isLoading) {
    return (
      <section className="max-w-[1440px] mx-auto px-8 py-12 my-8">
        <h2 className="text-2xl font-semibold text-center text-black mb-8">
          Featured Categories
        </h2>
        <div className="flex justify-center gap-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-[240px] h-[320px] bg-gray-200 animate-pulse rounded-lg"></div>
          ))}
        </div>
      </section>
    );
  }

  if (isError) return <p className="text-center">Failed to load categories.</p>;

  return (
    <section className="max-w-[1440px] mx-auto px-8 py-12 my-8">
      <h2 className="text-2xl font-semibold text-center text-black mb-8">
        Featured Categories
      </h2>

      <div className="relative flex items-center justify-center pl-16">
        {/* Left Button */}
        <button
          onClick={() => scroll("left")}
          disabled={isAnimating}
          className="absolute left-0 bg-black text-white p-4 rounded-full shadow-md hover:bg-gray-700 transition z-10"
        >
          &lt;
        </button>

        {/* Category List with Smooth Slide Animation */}
        <div className="overflow-hidden w-full max-w-6xl relative">
          <motion.div
            key={index}
            initial={{ x: direction === "right" ? "20%" : "-20%", opacity: 0 }}
            animate={{ x: "0%", opacity: 1 }}
            transition={{ type: "spring", stiffness: 80, damping: 10 }}
            className="flex gap-6 p-6"
          >
            {visibleCategories.map((category) => {
              const validImageUrl = category.categoryPicture

              return (
                <div
                  key={category.categoryId}
                  className="relative border rounded-lg shadow-lg overflow-hidden group flex-none w-[240px] h-[320px] bg-white"
                >
                  <div className="relative w-full h-[60%] bg-gray-100 flex items-center justify-center">
                    <Image
                      src={validImageUrl}
                      alt={category.categoryName}
                      width={200}
                      height={200}
                      className="object-cover"
                    />
                  </div>

                  <div className="p-4 bg-white flex flex-col justify-between h-[40%]">
                    <h3 className="text-lg font-semibold text-black">
                      {category.categoryName}
                    </h3>

                    <Link
                      href={{
                        pathname: "/products?[category}",
                        query: { category: category.categoryName }, // Pass category filter
                      }}
                      className="mt-4 inline-block px-6 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-black transition text-center"
                    >
                      Explore {category.categoryName}
                    </Link>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white">
                    <span className="text-xl font-semibold">Click to Explore</span>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Right Button */}
        <button
          onClick={() => scroll("right")}
          disabled={isAnimating}
          className="absolute right-0 bg-black text-white p-4 rounded-full shadow-md hover:bg-gray-700 transition z-10"
        >
          &gt;
        </button>
      </div>
    </section>
  );
};

export default ProductCategories;
