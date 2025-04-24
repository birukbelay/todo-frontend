"use client";

import { Tag } from "antd";
import { Filter } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface TodoFilterProps {
  availableTags: string[];
  activeFilters: string[];
  tagColors: Record<string, string>;
  onFilterChange: (filters: string[]) => void;
}

export function TodoFilter({
  availableTags,
  activeFilters,
  tagColors,
  onFilterChange,
}: TodoFilterProps) {
  const [showFilters, setShowFilters] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // Handle click outside for filter dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setShowFilters(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [filterRef]);

  // Toggle a tag in filter
  const toggleTagFilter = (tag: string) => {
    if (activeFilters.includes(tag)) {
      onFilterChange(activeFilters.filter((t) => t !== tag));
    } else {
      onFilterChange([...activeFilters, tag]);
    }
  };

  return (
    <div className="relative" ref={filterRef}>
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
      >
        <Filter className="h-4 w-4" />
        <span>Filter</span>
        {activeFilters.length > 0 && (
          <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
            {activeFilters.length}
          </span>
        )}
      </button>

      {showFilters && (
        <div className="absolute mt-2 p-3 bg-white rounded-lg shadow-lg border border-gray-200 z-10 min-w-[200px]">
          <div className="px-2 py-1 text-sm font-medium text-gray-600 mb-2">
            Filter by tag:
          </div>
          {availableTags.map((tag) => (
            <div
              key={tag}
              className="flex items-center px-2 py-1.5 hover:bg-gray-50 rounded cursor-pointer"
              onClick={() => toggleTagFilter(tag)}
            >
              <input
                type="checkbox"
                checked={activeFilters.includes(tag)}
                onChange={() => {}}
                className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <Tag color={tagColors[tag]} className="text-xs">
                {tag}
              </Tag>
            </div>
          ))}
          {activeFilters.length > 0 && (
            <button
              onClick={() => onFilterChange([])}
              className="w-full mt-2 text-xs text-red-600 hover:text-red-800 font-medium py-1"
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
