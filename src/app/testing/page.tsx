"use client";

import { useState } from "react";
import useProducts from "@/hooks/useProducts";
import Navbar from "@/components/common/Navbar";
import Pagination from "@/components/products/Pagination";
import ProductCard from "@/components/products/ProductCard";

const ProductListingPage = () => {
  const {
    products,
    categories,
    currentPage,
    setCurrentPage,
    totalPages,
    loading,
    selectedCategory,
    setSelectedCategory,
    sortOption,
    setSortOption,
    sortDirection,
    setSortDirection,
  } = useProducts();

  // Lifted search state
// Keep searchQuery state
  const [searchQuery, setSearchQuery] = useState("");

  // Function to handle search and reset pagination
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset pagination to page 1 when searching
  };
  
  return (
    <>
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <div className="p-8">
        {/* Filters */}
        <div className="flex space-x-4 mb-6">
          <select
            className="text-gray-500 border p-2 rounded"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.categoryId} value={category.categoryName}>
                {category.categoryName}
              </option>
            ))}
          </select>

          <p>Sort By</p>
          <select
            className="border p-2 rounded text-gray-500"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="createdAt">Newest</option>
            <option value="price">Price</option>
          </select>

          <select
            className="border p-2 rounded text-gray-500"
            value={sortDirection}
            onChange={(e) => setSortDirection(e.target.value)}
          >
            <option value="ASC">Ascending</option>
            <option value="DESC">Descending</option>
          </select>
        </div>

        {/* Product List */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.length > 0 ? (
              products
                .filter((product) =>
                  product.productName
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
                )
                .map((product) => (
                  <ProductCard
                    key={product.productId}
                    productId={product.productId}
                    productName={product.productName}
                    price={product.price}
                    productPictures={product.productPictures}
                  />
                ))
            ) : (
              <p>No products available</p>
            )}
          </div>
        )}

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </>
  );
};

export default ProductListingPage;