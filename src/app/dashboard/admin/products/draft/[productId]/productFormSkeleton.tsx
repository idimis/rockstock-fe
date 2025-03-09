import React from "react";

const ProductFormSkeleton = () => {
  return (
    <div className="p-8 bg-white shadow-lg rounded-xl max-w-3xl mx-auto animate-pulse">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 bg-gray-200 h-10 w-1/2 mx-auto"></h2>

      <form className="space-y-6">
        {/* Product Name */}
        <div className="space-y-2">
          <div className="h-10 w-full bg-gray-200 rounded"></div>
          <div className="h-6 w-full bg-gray-200 rounded"></div>
        </div>

        {/* Detail */}
        <div className="space-y-2">
          <div className="h-10 w-full bg-gray-200 rounded"></div>
          <div className="h-6 w-full bg-gray-200 rounded"></div>
        </div>

        {/* Price */}
        <div className="space-y-2">
          <div className="h-10 w-1/4 bg-gray-200 rounded"></div>
          <div className="h-6 w-full bg-gray-200 rounded"></div>
        </div>

        {/* Weight */}
        <div className="space-y-2">
          <div className="h-10 w-1/4 bg-gray-200 rounded"></div>
          <div className="h-6 w-full bg-gray-200 rounded"></div>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <div className="h-10 w-full bg-gray-200 rounded"></div>
          <div className="h-6 w-full bg-gray-200 rounded"></div>
        </div>

        {/* Product Pictures */}
        <div className="space-y-4">
          <div className="w-56 h-40 bg-gray-200 rounded"></div>
          <div className="w-56 h-40 bg-gray-200 rounded"></div>
          <div className="w-56 h-40 bg-gray-200 rounded"></div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
          <div className="h-12 w-1/2 bg-gray-200 rounded-md"></div>
          <div className="h-12 w-1/2 bg-gray-200 rounded-md"></div>
        </div>
      </form>
    </div>
  );
};

export default ProductFormSkeleton;
