const SkeletonRow = () => (
  <div className="flex items-center bg-gray-100 p-4 rounded-lg shadow-sm animate-pulse">
    {/* Placeholder for Image */}
    <div className="w-14 h-14 bg-gray-300 rounded-lg"></div>

    {/* Placeholder for Category Name */}
    <div className="ml-4 h-4 w-32 bg-gray-300 rounded"></div>
  </div>
);

export default SkeletonRow;