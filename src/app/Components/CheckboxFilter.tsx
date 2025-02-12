"use client";

import React from "react";

interface CheckboxFilterProps {
  options: string[]; // Categories ya Capacities ka array
  activeFilters: string[]; // Active selected filters
  onChange: (filter: string) => void; // Toggle function
  disableFirst?: boolean;
}

const CheckboxFilter: React.FC<CheckboxFilterProps> = ({ options, activeFilters, onChange }) => {
  return (
    <div className="space-y-2">
      {options.map((option) => (
        <label key={option} className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            value={option}
            checked={activeFilters.includes(option)}
            onChange={() => onChange(option)}
            className="hidden peer"
            // className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <div className="w-5 h-5 border border-gray-400 rounded flex items-center justify-center peer-checked:bg-blue-500 peer-checked:border-blue-500">
            {activeFilters.includes(option) && <span className="text-white">✔</span>} {/* ✅ Check Mark */}
          </div>
          <span className="flex justify-start whitespace-nowrap text-[#596780] text-[16px] font-medium cursor-pointer">{option}</span>
        </label>
      ))}
    </div>
  );
};

export default CheckboxFilter;
