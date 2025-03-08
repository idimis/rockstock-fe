const SkeletonRow = () => (
  <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg shadow-sm animate-pulse">
    {/* Placeholder for Image */}
    <div className="w-14 h-14 bg-gray-300 rounded-lg"></div>

    {/* Placeholder for Category Name */}
    <div className="ml-4 space-y-2">
      <div className="h-4 w-32 bg-gray-300 rounded"></div> {/* Category Name */}
      {/* Optional: Add a placeholder for description if needed */}
      <div className="h-3 w-24 bg-gray-300 rounded"></div>
    </div>

    {/* Placeholder for Buttons (Edit/Delete) */}
    <div className="flex space-x-6">
      <div className="w-20 h-8 bg-gray-300 rounded-lg"></div> {/* Edit Button */}
      <div className="w-20 h-8 bg-gray-300 rounded-lg"></div> {/* Delete Button */}
    </div>
  </div>
);
export default SkeletonRow;