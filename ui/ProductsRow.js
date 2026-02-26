"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Star } from "lucide-react";

export default function ProductsRow({ products = [], loading = false, name }) {
  const router = useRouter();

  const topTen = products.slice(0, 50);

  const getProductPrice = (product) => {
    if (product?.effectivePrice != null) return product.effectivePrice;
    if (product?.simpleProduct?.sp_specialPrice != null)
      return product.simpleProduct.sp_specialPrice;
    if (product?.simpleProduct?.sp_price != null)
      return product.simpleProduct.sp_price;
    return 0;
  };

  const getOldPrice = (product) => {
    return product?.simpleProduct?.sp_price || null;
  };

  const getDiscountPercent = (product) => {
    const oldPrice = getOldPrice(product);
    const newPrice = getProductPrice(product);

    if (!oldPrice || oldPrice <= newPrice) return null;

    return Math.round(((oldPrice - newPrice) / oldPrice) * 100);
  };

  if (loading) return null;
  if (!topTen.length) return null;

  return (
    <div className="px-16 pb-10">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-bold text-gray-900">{name}</h2>

        <button
          onClick={() => router.push("/products")}
          className="text-orange-500 font-semibold flex items-center gap-2 group"
        >
          View All
          <ArrowRight
            size={18}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </button>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {topTen.slice(0, 5).map((product) => {
          const discount = getDiscountPercent(product);

          return (
            <div
              key={product._id}
              className="bg-white rounded-lg border hover:shadow-lg transition duration-300 overflow-hidden group"
            >
              {/* Image */}
              <div
                className="relative h-44 overflow-hidden cursor-pointer"
                onClick={() => router.push(`/products/${product._id}`)}
              >
                {discount && (
                  <div className="absolute top-2 left-2 bg-pink-500 text-white text-[10px] font-bold px-2 py-1 rounded-full z-10">
                    {discount}% OFF
                  </div>
                )}

                <img
                  src={product?.mainImage}
                  alt={product?.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Content */}
              <div className="p-3">
                <h3 className="text-xs font-semibold text-gray-800 line-clamp-2">
                  {product?.name}
                </h3>

                <div className="mt-2 flex items-center gap-2">
                  <span className="text-black font-bold text-sm">
                    ₹{getProductPrice(product)}
                  </span>

                  {getOldPrice(product) && (
                    <span className="text-gray-400 line-through text-xs">
                      ₹{getOldPrice(product)}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-[11px] text-gray-500 line-clamp-2 min-h-[32px]">
                  {product?.shortDescription}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
