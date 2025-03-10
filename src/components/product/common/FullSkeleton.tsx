const FullSkeleton = () => {
  return (
    <div className="p-6 bg-white shadow-md rounded-lg space-y-6 animate-pulse">
      {/* Product List Skeleton */}
      <div className="space-y-4">
        {Array.from({ length: 1 }).map((_, index) => ( // Showing 5 skeleton items
          <div
            key={index}
            className="bg-gray-100 p-4 rounded-lg shadow-sm flex flex-col md:flex-row items-center space-y-4 md:space-x-6"
          >
            {/* Image Placeholder */}
            <div className="relative w-40 h-40 flex-shrink-0 bg-gray-300 rounded-lg"></div>

            {/* Product Details Placeholder */}
            <div className="flex-grow text-center md:text-left space-y-2 w-full">
              <div className="w-3/4 h-6 bg-gray-300 rounded"></div> {/* Product Name */}
              <div className="w-1/2 h-4 bg-gray-300 rounded"></div> {/* Category */}
              <div className="w-1/3 h-4 bg-gray-300 rounded"></div> {/* Weight */}
              <div className="w-1/2 h-5 bg-gray-300 rounded"></div> {/* Price */}
              <div className="w-full h-10 bg-gray-200 rounded"></div> {/* Description */}
            </div>

            {/* Total Stock Placeholder */}
            <div className="flex items-center text-center gap-2">
              <div className="w-20 h-6 bg-gray-300 rounded"></div>
              <div className="w-10 h-6 bg-gray-400 rounded"></div>
            </div>

            {/* Buttons Placeholder */}
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-gray-300 rounded"></div> {/* Edit Button */}
              <div className="w-10 h-10 bg-gray-300 rounded"></div> {/* Delete Button */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FullSkeleton;