"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ShoppingCart,
  Heart,
  Star,
  Filter,
  Search,
  ChevronDown,
} from "lucide-react";
import { apiClient } from "@/services/apiClient";

// Constants
const ITEMS_PER_PAGE = 20;
const PRICE_RANGES = [
  { id: "under-500", label: "Under ₹500", min: 0, max: 500 },
  { id: "500-1000", label: "₹500 - ₹1000", min: 500, max: 1000 },
  { id: "above-1000", label: "Above ₹1000", min: 1000, max: Infinity },
];
const BRANDS = ["PremiumWear", "EcoWear"];
const RATING_OPTIONS = [4, 3, 2];
const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

// Reusable Components
const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-20">
    <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600"></div>
  </div>
);

const EmptyState = ({ message }) => (
  <p className="text-center text-gray-500 py-10">{message}</p>
);

const Breadcrumb = ({ items }) => (
  <div className="mb-6 text-sm text-gray-600">
    {items.join(" / ")}
  </div>
);

const FilterCheckbox = ({ label, checked, onChange }) => (
  <label className="flex items-center text-black cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="rounded accent-black cursor-pointer"
    />
    <span className="ml-2 text-sm">{label}</span>
  </label>
);

const FilterSection = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="font-medium mb-3 text-black">{title}</h3>
    <div className="space-y-2">{children}</div>
  </div>
);

const ViewToggle = ({ view, setView }) => (
  <div className="flex gap-2">
    <button
      onClick={() => setView("grid")}
      className={`p-2 rounded transition-colors ${
        view === "grid"
          ? "bg-blue-600 text-white"
          : "bg-gray-100 text-black hover:bg-gray-200"
      }`}
      aria-label="Grid view"
    >
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    </button>
    <button
      onClick={() => setView("list")}
      className={`p-2 rounded transition-colors ${
        view === "list"
          ? "bg-blue-600 text-white"
          : "bg-gray-100 text-black hover:bg-gray-200"
      }`}
      aria-label="List view"
    >
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  </div>
);

const RatingStars = ({ rating, count }) => (
  <div className="flex items-center mb-3">
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < Math.floor(rating)
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300"
          }`}
        />
      ))}
    </div>
    {count !== undefined && (
      <span className="ml-2 text-sm text-gray-600">({count})</span>
    )}
  </div>
);

const ProductCard = ({ product, view }) => {
  const isListView = view === "list";

  return (
    <Link href={`/products/${product._id}`} className="block">
      <div
        className={`bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden ${
          isListView ? "flex" : ""
        }`}
      >
        {/* Product Image */}
        <div
          className={`relative ${
            isListView ? "w-48 flex-shrink-0" : "aspect-[3/4]"
          } overflow-hidden group`}
        >
          <img
            src={product.mainImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {product.discountPercentage > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded-md text-sm font-semibold shadow-lg">
              -{product.discountPercentage}%
            </div>
          )}
          <button
            onClick={(e) => {
              e.preventDefault();
              // Handle wishlist logic here
            }}
            className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
            aria-label="Add to wishlist"
          >
            <Heart className="w-5 h-5 text-gray-600 hover:text-red-500 transition-colors" />
          </button>
        </div>

        {/* Product Info */}
        <div className="p-4 flex-1">
          <div className="mb-2">
            <span className="text-xs text-gray-500 uppercase tracking-wide">
              {product.brand}
            </span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.shortDescription}
          </p>

          {/* Rating */}
          <RatingStars
            rating={product.rating.average}
            count={product.rating.count}
          />

          {/* Price */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl font-bold text-gray-900">
              ₹{product.effectivePrice}
            </span>
            {product.discountPercentage > 0 && (
              <span className="text-sm text-gray-500 line-through">
                ₹
                {product.simpleProduct?.sp_price ||
                  product.simpleProduct?.price ||
                  product.variants?.[0]?.variant_price}
              </span>
            )}
          </div>

          {/* Stock Status */}
          <div className="mb-4">
            {product.inStock ? (
              <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                In Stock
              </span>
            ) : (
              <span className="text-sm text-red-600 font-medium flex items-center gap-1">
                <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                Out of Stock
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              // Handle add to cart logic here
            }}
            disabled={!product.inStock}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-5 h-5" />
            {product.inStock ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>
    </Link>
  );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      return [...Array(totalPages)].map((_, i) => i + 1);
    }

    // Always show first page
    pages.push(1);

    if (currentPage > 3) {
      pages.push("...");
    }

    // Show pages around current page
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="mt-8 flex justify-center items-center gap-2 flex-wrap">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
      >
        Previous
      </button>

      {getPageNumbers().map((page, index) => {
        if (page === "...") {
          return (
            <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
              ...
            </span>
          );
        }

        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              currentPage === page
                ? "bg-blue-600 text-white shadow-md"
                : "border hover:bg-gray-50"
            }`}
          >
            {page}
          </button>
        );
      })}

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
      >
        Next
      </button>
    </div>
  );
};

// Main Component
export default function ProductsPage() {
  const [view, setView] = useState("grid");
  const [sortBy, setSortBy] = useState("featured");
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    priceRanges: [],
    brands: [],
    ratings: [],
  });

  const fetchProducts = async (page = 1) => {
    try {
      setLoading(true);
      const res = await apiClient(`product?page=${page}&limit=${ITEMS_PER_PAGE}`);
      
      if (res?.success) {
        setProducts(res.data.products);
        setCurrentPage(res.data.pagination.currentPage);
        setTotalPages(res.data.pagination.totalPages);
      }
    } catch (err) {
      console.error("Failed to fetch products", err);
      // You can add toast notification here
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter((item) => item !== value)
        : [...prev[filterType], value],
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Breadcrumb items={["Home", "Women's Fashion", "T-Shirts"]} />

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-lg text-black">Filters</h2>
                <Filter className="w-5 h-5 text-gray-600" />
              </div>

              {/* Price Range */}
              <FilterSection title="Price Range">
                {PRICE_RANGES.map((range) => (
                  <FilterCheckbox
                    key={range.id}
                    label={range.label}
                    checked={filters.priceRanges.includes(range.id)}
                    onChange={() => handleFilterChange("priceRanges", range.id)}
                  />
                ))}
              </FilterSection>

              {/* Brand */}
              <FilterSection title="Brand">
                {BRANDS.map((brand) => (
                  <FilterCheckbox
                    key={brand}
                    label={brand}
                    checked={filters.brands.includes(brand)}
                    onChange={() => handleFilterChange("brands", brand)}
                  />
                ))}
              </FilterSection>

              {/* Rating */}
              <FilterSection title="Rating">
                {RATING_OPTIONS.map((rating) => (
                  <FilterCheckbox
                    key={rating}
                    label={
                      <span className="flex items-center">
                        {rating}
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 ml-1" />
                        <span className="ml-1">& above</span>
                      </span>
                    }
                    checked={filters.ratings.includes(rating)}
                    onChange={() => handleFilterChange("ratings", rating)}
                  />
                ))}
              </FilterSection>

              {/* Clear Filters */}
              {(filters.priceRanges.length > 0 ||
                filters.brands.length > 0 ||
                filters.ratings.length > 0) && (
                <button
                  onClick={() =>
                    setFilters({ priceRanges: [], brands: [], ratings: [] })
                  }
                  className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </aside>

          {/* Products Section */}
          <main className="flex-1">
            {/* Search and Sort Bar */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Search */}
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Sort + View */}
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2 text-black bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer transition-all"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  <ViewToggle view={view} setView={setView} />
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && <LoadingSpinner />}

            {/* Empty State */}
            {!loading && products.length === 0 && (
              <EmptyState message="No products found" />
            )}

            {/* Products Grid/List */}
            {!loading && products.length > 0 && (
              <>
                <div
                  className={
                    view === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                      : "space-y-4"
                  }
                >
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} view={view} />
                  ))}
                </div>

                {/* Pagination */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}