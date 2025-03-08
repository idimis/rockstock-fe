const SkeletonRow = () => {
  return (
    <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg shadow-sm animate-pulse">
      <div className="flex items-center">
        <div className="w-16 h-16 bg-gray-300 rounded-lg"></div>
        <div className="ml-4">
          <div className="w-24 h-4 bg-gray-300 rounded"></div>
          <div className="w-16 h-3 bg-gray-200 rounded mt-1"></div>
        </div>
      </div>
      <div className="flex space-x-6">
        <div className="w-10 h-4 bg-gray-300 rounded"></div>
        <div className="w-10 h-4 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
};

export default SkeletonRow;