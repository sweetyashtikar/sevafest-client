"use client";

import { memo } from "react";
import { Star, ChevronDown, Filter, X } from "lucide-react";
import { motion } from "framer-motion";

const FilterSection = ({ title, children, showScroll }) => (
  <div className="mb-8 last:mb-0">
    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center justify-between">
      {title}
      <ChevronDown className="w-4 h-4 text-gray-400" />
    </h3>
    <div
      className={`space-y-3 pr-2 ${showScroll ? "max-h-40 overflow-y-auto custom-scrollbar" : ""}`}
    >
      {children}
    </div>
  </div>
);

const FilterSidebar = ({
  categories = [],
  selectedCategory,
  onCategoryChange,

  priceRanges = [],
  selectedPrice,
  onPriceChange,

  brands = [],
  selectedBrands = [],
  onBrandChange,

  ratings = [4, 3, 2, 1],
  selectedRatings = [],
  onRatingChange,

  onClearFilters,
}) => {
  return (
    <aside className="lg:w-72 shrink-0 ">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-7 sticky top-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Filter className="w-4 h-4 text-blue-600" />
            </div>
            <h2 className="font-bold text-lg text-gray-900">Filters</h2>
          </div>
          <button
            onClick={onClearFilters}
            className="text-xs font-semibold text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1"
          >
            <X className="w-3 h-3" /> Clear
          </button>
        </div>

        {/* 📁 Category Filter */}
        {categories.length > 0 && (
          <FilterSection title="Category" showScroll={categories.length > 4}>
            {categories.map((cat, index) => (
              <label
                key={cat._id ?? `cat-${index}`}
                className="flex items-center group cursor-pointer"
              >
                <div className="relative flex items-center">
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === cat._id}
                    onChange={() => onCategoryChange(cat._id)}
                    className="peer appearance-none w-5 h-5 border-2 border-gray-200 rounded-full checked:border-blue-600 checked:border-[6px] transition-all"
                  />
                </div>
                <span className="ml-3 text-sm font-medium text-gray-600 group-hover:text-blue-600 transition-colors">
                  {cat.name}
                </span>
              </label>
            ))}
          </FilterSection>
        )}

        {/* 💰 Price Filter */}
        {priceRanges.length > 0 && (
          <FilterSection
            title="Price Range"
            showScroll={priceRanges.length > 4}
          >
            {priceRanges.map((range) => (
              <label
                key={range.value}
                className="flex items-center group cursor-pointer"
              >
                <input
                  type="radio"
                  name="price"
                  checked={selectedPrice === range.value}
                  onChange={() => onPriceChange(range.value)}
                  className="w-4 h-4 rounded-full border-gray-300 text-blue-600 focus:ring-blue-500 accent-blue-600"
                />
                <span className="ml-3 text-sm font-medium text-gray-600 group-hover:text-blue-600 transition-colors">
                  {range.label}
                </span>
              </label>
            ))}
          </FilterSection>
        )}

        {/* 🏷 Brand Filter */}
        {brands.length > 0 && (
          <FilterSection title="Brands" showScroll={brands.length > 4}>
            {brands.map((brand) => (
              <label
                key={brand}
                className="flex items-center group cursor-pointer"
              >
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => onBrandChange(brand)}
                    className="w-5 h-5 rounded-md border-gray-200 text-blue-600 focus:ring-blue-500 transition-all accent-blue-600"
                  />
                </div>
                <span className="ml-3 text-sm font-medium text-gray-600 group-hover:text-blue-600 transition-colors">
                  {brand}
                </span>
              </label>
            ))}
          </FilterSection>
        )}

        {/* ⭐ Rating Filter */}
        {ratings.length > 0 && (
          <FilterSection
            title="Customer Rating"
            showScroll={ratings.length > 4}
          >
            {ratings.map((rating) => (
              <label
                key={rating}
                className="flex items-center group cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedRatings.includes(rating)}
                  onChange={() => onRatingChange(rating)}
                  className="w-5 h-5 rounded-md border-gray-200 text-blue-600 transition-all accent-blue-600"
                />
                <span className="ml-3 flex items-center text-sm font-medium text-gray-600 group-hover:text-blue-600 transition-colors">
                  {rating}
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400 ml-1.5" />
                  <span className="ml-1">& Above</span>
                </span>
              </label>
            ))}
          </FilterSection>
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </aside>
  );
};

export default memo(FilterSidebar);
