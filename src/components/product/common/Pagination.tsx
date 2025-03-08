import { useRouter } from "next/navigation";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string; // Pass the basePath as a prop
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, basePath, onPageChange }) => {
  const router = useRouter(); // Initialize the router

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(window.location.search);

    if (page === 1) {
      params.delete("page"); // Remove page param if we are going to page 1
    } else {
      params.set("page", page.toString());
    }

    const newUrl = `${basePath}?${params.toString()}`;
    router.push(newUrl); // Update the URL with the new page query
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-6">
      <button
        className={`px-4 py-2 mx-1 rounded-lg ${currentPage === 1 ? "bg-gray-300" : "bg-blue-500 text-white"}`}
        onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Prev
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`px-4 py-2 mx-1 rounded-lg ${
            currentPage === page ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        className={`px-4 py-2 mx-1 rounded-lg ${currentPage === totalPages ? "bg-gray-300" : "bg-blue-500 text-white"}`}
        onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;