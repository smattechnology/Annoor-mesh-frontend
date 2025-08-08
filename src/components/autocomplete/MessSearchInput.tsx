import { MessData } from "@/types";
import api from "@/utils/api";
import React, { useState, useEffect, useRef } from "react";

interface MessSearchInputProps {
  input: string;
  onSelectProduct?: (mess?: MessData) => void;
  setIsFound: (isFound: boolean) => void;
  enable?: boolean;
}

const MessSearchInput: React.FC<MessSearchInputProps> = ({
  input,
  onSelectProduct,
  setIsFound,
  enable,
}) => {
  const [searchResults, setSearchResults] = useState<MessData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Mock API search function - replace with your actual API call
  const searchProducts = async (query: string) => {
    const response = await api.get(
      `/mess/search?q=${encodeURIComponent(query)}`
    );
    const data: MessData[] = response.data?.messes;
    console.log(data);

    return data;
  };

  const handleSelectProduct = (mess?: MessData) => {
    if (!mess) return;
    setIsDropdownOpen(false);
    setSearchResults([]);
    onSelectProduct?.(mess);
  };

  // Handle input changes with debounce
  useEffect(() => {
    if (enable) {
      // Clear previous timeout
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      if (input.trim().length > 0) {
        setIsDropdownOpen(true);
        debounceRef.current = setTimeout(async () => {
          setIsLoading(true);
          try {
            const results = await searchProducts(input);
            setSearchResults(results);
          } catch (error) {
            console.error("Search failed:", error);
            setSearchResults([]);
          } finally {
            setIsLoading(false);
          }
        }, 500); // 500ms debounce delay
      } else {
        setIsDropdownOpen(false);
        setSearchResults([]);
      }
    }
  }, [input, enable]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setIsFound(searchResults.length > 0);
  }, [searchResults]);

  return (
    isDropdownOpen && (
      <div
        ref={dropdownRef}
        className="absolute bottom-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto"
      >
        {isLoading ? (
          <div className="px-4 py-3 text-center text-gray-500">
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
              Searching...
            </div>
          </div>
        ) : searchResults.length > 0 ? (
          <>
            <div className="px-4 py-2 text-xs text-gray-500 bg-gray-50 border-b border-gray-100">
              {searchResults.length} result
              {searchResults.length !== 1 ? "s" : ""} found
            </div>
            {searchResults.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelectProduct(item)}
                className="w-full px-4 py-3 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors duration-150 border-b border-gray-50 last:border-b-0"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-900 space-x-2">
                      <span>{item.name}</span>
                      <span>-</span>
                      <span className="text-sm text-gray-500">
                        {item.address.area}, {item.address.street}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      <span>{item.owner.name}</span>
                    </div>
                  </div>
                  <div className="text-gray-400">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </button>
            ))}
          </>
        ) : null}
      </div>
    )
  );
};

export default MessSearchInput;
