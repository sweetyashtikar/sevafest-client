"use client";

import { useRouter } from "next/navigation";
import { apiClient } from "@/services/apiClient";
import { Star } from "lucide-react";

export default function TopTrendingProducts({
  products = [],
  loading = false,
}) {
  const router = useRouter();

  const topNine = products.slice(0, 9);

  const getProductPrice = (product) => {
    if (product?.effectivePrice != null) return product.effectivePrice;
    if (product?.simpleProduct?.sp_specialPrice != null)
      return product.simpleProduct.sp_specialPrice;
    if (product?.simpleProduct?.sp_price != null)
      return product.simpleProduct.sp_price;
    return 0;
  };

  const addToCart = async (productId) => {
    try {
      await apiClient("/viewCart/addtoCart", {
        method: "POST",
        body: { productId, qty: 1 },
      });
    } catch (err) {
      console.error("Add to cart error", err);
    }
  };

  // 🔥 Loading State
  if (loading) {
    return (
      <div className="mt-20">
        <h2 className="text-3xl font-bold text-center mb-10">
          🔥 Top Trending Products
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm p-5 animate-pulse"
            >
              <div className="w-full h-56 bg-gray-200 rounded-md"></div>
              <div className="mt-4 h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="mt-2 h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="mt-4 h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!topNine.length) return null;

  return (
    <div className="mt-20 p-8">
      <h2 className="text-3xl font-bold text-center mb-10 text-black">
        🔥 Top Trending Products
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {topNine.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-xl shadow-sm hover:shadow-lg transition duration-300 p-5 group"
          >
            <div
              className="relative overflow-hidden cursor-pointer"
              onClick={() => router.push(`/products/${product._id}`)}
            >
              <img
                src={product?.mainImage}
                alt={product?.name}
                className="w-full h-56 object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            <div className="mt-4">
              <p className="text-xs text-orange-500 font-medium">
                {product?.brand}
              </p>

              <h3 className="text-base font-semibold mt-1 line-clamp-2 text-black">
                {product?.name}
              </h3>

              <div className="flex items-center gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    className={
                      star <= Math.round(product.rating?.average || 0)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-700"
                    }
                  />
                ))}

                <span className="text-sm text-gray-500 ml-2">
                  ({product.rating?.count || 0})
                </span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-red-600 font-bold">
                  ₹{getProductPrice(product)}
                </span>

                {product?.simpleProduct?.sp_price && (
                  <span className="text-gray-400 line-through text-sm">
                    ₹{product.simpleProduct.sp_price}
                  </span>
                )}
              </div>

              <button
                onClick={() => addToCart(product._id)}
                className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-md transition"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-12">
        <button
          onClick={() => router.push("/products")}
          className="px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-gray-800 transition"
        >
          View More
        </button>
      </div>
    </div>
  );
}
