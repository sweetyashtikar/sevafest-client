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

export default function Page() {
  const [view, setView] = useState("grid");
  const [sortBy, setSortBy] = useState("featured");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async (page = 1) => {
    try {
      setLoading(true);

      const res = await apiClient(`product?page=${page}&limit=20`);
      if (res?.success) {
        setProducts(res.data.products);
        setCurrentPage(res.data.pagination.currentPage);
        setTotalPages(res.data.pagination.totalPages);
      }
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  {
    loading && (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600"></div>
      </div>
    );
  }

  {
    !loading && products.length === 0 && (
      <p className="text-center text-gray-500 py-10">No products found</p>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-gray-600">
          Home / Women's Fashion / T-Shirts
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24 text-black">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-lg text-black">Filters</h2>
                <Filter className="w-5 h-5 text-black" />
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-medium mb-3 text-black">Price Range</h3>
                <div className="space-y-2">
                  <label className="flex items-center text-black">
                    <input type="checkbox" className="rounded accent-black" />
                    <span className="ml-2 text-sm">Under ₹500</span>
                  </label>
                  <label className="flex items-center text-black">
                    <input type="checkbox" className="rounded accent-black" />
                    <span className="ml-2 text-sm">₹500 - ₹1000</span>
                  </label>
                  <label className="flex items-center text-black">
                    <input type="checkbox" className="rounded accent-black" />
                    <span className="ml-2 text-sm">Above ₹1000</span>
                  </label>
                </div>
              </div>

              {/* Brand */}
              <div className="mb-6">
                <h3 className="font-medium mb-3 text-black">Brand</h3>
                <div className="space-y-2">
                  <label className="flex items-center text-black">
                    <input type="checkbox" className="rounded accent-black" />
                    <span className="ml-2 text-sm">PremiumWear</span>
                  </label>
                  <label className="flex items-center text-black">
                    <input type="checkbox" className="rounded accent-black" />
                    <span className="ml-2 text-sm">EcoWear</span>
                  </label>
                </div>
              </div>

              {/* Rating */}
              <div>
                <h3 className="font-medium mb-3 text-black">Rating</h3>
                <div className="space-y-2">
                  {[4, 3, 2].map((rating) => (
                    <label
                      key={rating}
                      className="flex items-center text-black"
                    >
                      <input type="checkbox" className="rounded accent-black" />
                      <span className="ml-2 flex items-center text-sm">
                        {rating}
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 ml-1" />
                        <span className="ml-1">& above</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Products Section */}
          <main className="flex-1">
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6 text-black">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Search */}
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-2 border rounded-lg text-black placeholder:text-black/60
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Sort + View */}
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border rounded-lg px-4 py-2 text-black bg-white
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setView("grid")}
                      className={`p-2 rounded ${
                        view === "grid"
                          ? "bg-gray-200 text-black"
                          : "bg-gray-100 text-black"
                      }`}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    </button>

                    <button
                      onClick={() => setView("list")}
                      className={`p-2 rounded ${
                        view === "list"
                          ? "bg-gray-200 text-black"
                          : "bg-gray-100 text-black"
                      }`}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div
              className={
                view === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }
            >
              {products.map((product) => (
                <Link
                  key={product._id}
                  href={`/products/${product._id}`}
                  className="block"
                >
                  <div
                    key={product._id}
                    className={`bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden ${view === "list" ? "flex" : ""}`}
                  >
                    {/* Product Image */}
                    <div
                      className={`relative ${view === "list" ? "w-48 flex-shrink-0" : "aspect-[3/4]"} overflow-hidden group`}
                    >
                      <img
                        src={product.mainImage}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      {product.discountPercentage > 0 && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
                          -{product.discountPercentage}%
                        </div>
                      )}
                      <button className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                        <Heart className="w-5 h-5 text-gray-600 hover:text-red-500" />
                      </button>
                    </div>

                    {/* Product Info */}
                    <div className="p-4 flex-1">
                      <div className="mb-2">
                        <span className="text-xs text-gray-500">
                          {product.brand}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {product.shortDescription}
                      </p>

                      {/* Rating */}
                      <div className="flex items-center mb-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < Math.floor(product.rating.average) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">
                          ({product.rating.count})
                        </span>
                      </div>

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
                          <span className="text-sm text-green-600 font-medium">
                            In Stock
                          </span>
                        ) : (
                          <span className="text-sm text-red-600 font-medium">
                            Out of Stock
                          </span>
                        )}
                      </div>

                      {/* Add to Cart Button */}
                      <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                        <ShoppingCart className="w-5 h-5" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex justify-center items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>

              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "border hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
