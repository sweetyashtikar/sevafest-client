"use client";

import { Star, Zap } from "lucide-react";
import { memo, useState } from "react";
import { motion } from "framer-motion";

const ProductCard = ({
  image,
  category,
  name,
  shortDescription,
  price,
  originalPrice,
  discount,
  rating = 0,
  reviews = 0,
  onAddToCart,
  onNavigate,
}) => {
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = async (e) => {
    
    e.stopPropagation();
    e.preventDefault();

    if (adding || added) return;

    try {
      setAdding(true);
      await onAddToCart();
      setAdded(true);
    } catch (err) {
      console.error("Add to cart failed", err);
    } finally {
      setAdding(false);
    }
  };

  return (
    <motion.div
      onClick={onNavigate}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="group relative w-full max-w-[280px] bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden font-sans"
    >
      {/* 1. Discount Tag */}
      {discount && (
        <div className="absolute top-3 left-0 z-10">
          <div className="bg-[#CC0C39] text-white text-[11px] font-bold px-2.5 py-1 rounded-r-full shadow-md">
            {discount}% OFF
          </div>
        </div>
      )}

      {/* 2. Image Section */}
      <div className="relative aspect-square overflow-hidden bg-[#F7F8F8] p-5">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* 3. Product Details */}
      <div className="p-4 flex flex-col gap-1">
        {/* Category */}
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          {category}
        </span>

        {/* Product Name */}
        <h3 className="text-[15px] font-bold text-[#0F1111] leading-tight line-clamp-1 group-hover:text-[#C45500] transition-colors">
          {name}
        </h3>

        {/* 📝 Short Description (2 Lines) */}
        <p className="text-[12px] text-gray-500 line-clamp-2 leading-relaxed min-h-[32px]">
          {shortDescription ||
            "No description available for this premium product."}
        </p>

        {/* Ratings */}
        <div className="flex items-center gap-1.5 mt-1">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(rating)
                    ? "fill-[#FFA41C] text-[#FFA41C]"
                    : "fill-gray-200 text-gray-200"
                }`}
              />
            ))}
          </div>
          <span className="text-[12px] text-[#007185] font-medium">
            {reviews.toLocaleString()}
          </span>
        </div>

        {/* Price Section */}
        <div className="mt-2">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#0F1111]">
              <span className="text-xs align-top mr-0.5 font-medium">₹</span>
              {Math.floor(price).toLocaleString()}
            </span>
            {originalPrice && (
              <span className="text-[13px] text-gray-400 line-through">
                ₹{originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 mt-0.5">
            <Zap className="w-3 h-3 fill-orange-400 text-orange-400" />
            <span className="text-[11px] font-bold text-gray-500">
              Fast Delivery
            </span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleAddToCart}
          disabled={adding || added}
          className={`mt-4 w-full py-2 rounded-full font-bold text-[13px] shadow-sm transition-all
            ${
              added
                ? "bg-green-500 text-white"
                : "bg-[#FFD814] hover:bg-[#F7CA00] text-[#0F1111]"
            }
            ${adding ? "opacity-70 cursor-not-allowed" : ""}
          `}
        >
          {adding ? "Adding..." : added ? "Added ✓" : "Add to Cart"}
        </button>
      </div>
    </motion.div>
  );
};

export default memo(ProductCard);
