"use client";

import { useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import debounce from "lodash.debounce";
import { FiSearch } from "react-icons/fi"; // 🔍 Search icon
import { IoClose } from "react-icons/io5"; // ✖ Close icon

interface SearchBarProps {
  basePath: string;
}

const SearchBar = ({ basePath }: SearchBarProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const searchQueryFromURL = searchParams.get("search") || "";
  const [searchQuery, setSearchQuery] = useState(searchQueryFromURL);

  const updateSearchParams = useCallback((search: string) => {
    // Only update the URL if the query has actually changed
    if (search !== searchParams.get("search")) {
      const params = new URLSearchParams(searchParams.toString());
  
      if (search.trim() === "") {
        params.delete("search");
      } else {
        params.set("search", search);
      }
      params.delete("page"); // Reset page when searching
  
      const newUrl = `${basePath}${params.toString() ? "?" + params.toString() : ""}`;
      router.push(newUrl); // Use push to update the URL without affecting history
    }
  }, [router, searchParams, basePath]);  

  // Debounce search when typing (not when clicking search)
  const debouncedUpdate = debounce(updateSearchParams, 1500);

  // Handle search button click
  const handleSearch = () => {
    updateSearchParams(searchQuery);
  };

  // Handle enter key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Clear search input
  const clearSearch = () => {
    setSearchQuery("");
    updateSearchParams(""); // Reset URL
  };

  return (
<div className="flex items-center border p-2 rounded w-72 max-w-md">
<input
      type="text"
      placeholder="Search..."
      value={searchQuery}
      onChange={(e) => {
        setSearchQuery(e.target.value);
        debouncedUpdate(e.target.value);
      }}
      onKeyDown={handleKeyPress} // ✅ Press Enter to search
      className="text-gray-500 p-2 outline-none w-full" // Use w-full to make the input span the full width of its parent
    />
    {searchQuery && (
      <button onClick={clearSearch} className="text-gray-500 hover:text-gray-700 p-1">
        <IoClose className="h-5 w-5" />
      </button>
    )}
    <button onClick={handleSearch} className="text-blue-500 hover:text-blue-700 p-1">
      <FiSearch className="h-5 w-5" />
    </button>
  </div>


  );
};

export default SearchBar;