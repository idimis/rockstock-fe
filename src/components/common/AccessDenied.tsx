const AccessDenied = () => {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
        <div className="text-center">
          <div className="text-6xl sm:text-7xl text-red-600 mb-4">🚫</div>
          <h1 className="text-3xl sm:text-4xl font-semibold text-gray-800">Access Denied!</h1>
          <p className="text-lg sm:text-xl text-gray-600 mt-2">Redirecting...</p>
        </div>
      </div>
    );
  };
  
  export default AccessDenied;  