import React from "react";
import { Filter, X, GitBranch, GitPullRequest, GitMerge } from "lucide-react";

export default function FilterBar({ selectedFilters, setSelectedFilters }) {
  const filterOptions = [
    { 
      value: "PUSH", 
      label: "Push", 
      icon: GitBranch,
      color: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200",
      activeColor: "bg-blue-500 text-white border-blue-500 shadow-lg shadow-blue-200"
    },
    { 
      value: "PULL_REQUEST", 
      label: "Pull Request", 
      icon: GitPullRequest,
      color: "bg-green-100 text-green-800 border-green-200 hover:bg-green-200",
      activeColor: "bg-green-500 text-white border-green-500 shadow-lg shadow-green-200"
    },
    { 
      value: "MERGE", 
      label: "Merge", 
      icon: GitMerge,
      color: "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200",
      activeColor: "bg-purple-500 text-white border-purple-500 shadow-lg shadow-purple-200"
    },
  ];

  const toggleFilter = (filterValue) => {
    setSelectedFilters(
      selectedFilters.includes(filterValue)
        ? selectedFilters.filter((f) => f !== filterValue)
        : [...selectedFilters, filterValue]
    );
  };

  const clearFilters = () => {
    setSelectedFilters([]);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Filter className="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Filter Events</h2>
            <p className="text-sm text-gray-500">Choose event types to display</p>
          </div>
        </div>
        
        {selectedFilters.length > 0 && (
          <button
            onClick={clearFilters}
            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-4 w-4" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-4">
        {filterOptions.map((option) => {
          const isSelected = selectedFilters.includes(option.value);
          return (
            <button
              key={option.value}
              onClick={() => toggleFilter(option.value)}
              className={`flex items-center space-x-2 px-5 py-3 rounded-xl border-2 font-medium transition-all duration-200 ${
                isSelected
                  ? option.activeColor + " transform scale-105"
                  : option.color
              }`}
            >
              <option.icon className="h-4 w-4" />
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>
      
      {selectedFilters.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Active filters:</span> {selectedFilters.length} selected
            <span className="ml-2 text-gray-400">({selectedFilters.join(', ')})</span>
          </p>
        </div>
      )}
    </div>
  );
}