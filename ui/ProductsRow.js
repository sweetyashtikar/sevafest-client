"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, Star } from "lucide-react";

export default function ProductsRow({ products = [], loading = false, name }) {
  const router = useRouter();

  console.log("prodcut", products);

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

  const getProductImage = (product) => {
    if (product?.mainImage) return product.mainImage;

    if (product?.variants?.length > 0) {
      const variantImage = product.variants?.[0]?.variant_images?.[0];
      if (variantImage) return variantImage;
    }

    return null;
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
          const imageUrl = getProductImage(product);
          const outOfStock = product.inStock === false;

          return (
            <div
              key={product._id}
              className={`bg-white rounded-lg border hover:shadow-lg transition duration-300 overflow-hidden group ${outOfStock ? 'opacity-75' : ''}`}
            >
              {/* Image */}
              <div
                className="relative h-44 overflow-hidden cursor-pointer"
                onClick={() => router.push(`/products/${product._id}`)}
              >
                {discount && !outOfStock && (
                  <div className="absolute top-2 left-2 bg-pink-500 text-white text-[10px] font-bold px-2 py-1 rounded-full z-10">
                    {discount}% OFF
                  </div>
                )}

                <Image
                  src={imageUrl}
                  alt={product?.name || "product"}
                  fill
                  className={`object-cover transition-transform duration-300 ${outOfStock ? 'grayscale' : 'group-hover:scale-105'}`}
                />
                {outOfStock && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                    <span className="bg-white/90 text-gray-800 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm border border-gray-200">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-3">
                <h3 className={`text-xs font-semibold line-clamp-2 transition-colors ${outOfStock ? 'text-gray-400' : 'text-gray-800'}`}>
                  {product?.name}
                </h3>

                <div className="mt-2 flex items-center gap-2">
                  <span className={`font-bold text-sm ${outOfStock ? 'text-gray-400' : 'text-black'}`}>
                    ₹{getProductPrice(product)}
                  </span>

                  {getOldPrice(product) && (
                    <span className="text-gray-400 line-through text-xs">
                      ₹{getOldPrice(product)}
                    </span>
                  )}
                </div>
                <p className={`mt-1 text-[11px] line-clamp-2 min-h-[32px] ${outOfStock ? 'text-gray-400' : 'text-gray-500'}`}>
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
