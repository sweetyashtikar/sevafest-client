"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchActiveCategories } from "@/redux/slices/categorySlice";
import { useRouter } from "next/navigation";

export const CategoryDropdown = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { categories, loading } = useSelector((state) => state.category);

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchActiveCategories());
    }
  }, [isOpen, dispatch]);

  if (!isOpen) return null;

  const categoryList = categories?.data || [];

  return (
    <div
      onMouseLeave={onClose}
      className="absolute top-full left-0 mt-3 w-[600px] bg-white rounded-xl shadow-2xl border border-gray-100 z-50 p-6"
    >
      <h3 className="text-lg font-semibold mb-4 text-gray-700">
        Browse Categories
      </h3>

      {loading && categoryList.length === 0 ? (
        <div className="text-center text-sm text-gray-500">Loading...</div>
      ) : categoryList.length > 0 ? (
        <div className="grid grid-cols-3 gap-6">
          {categoryList.map((cat) => (
            <div
              key={cat._id}
              onClick={() => {
                router.push(`/category/${cat.slug}`);
                onClose();
              }}
              className="flex flex-col items-center cursor-pointer group"
            >
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-black group-hover:border-green-600 transition duration-300">
                <img
                  src={
                    cat.image && cat.image.trim() !== ""
                      ? cat.image
                      : "/images/category-placeholder.png"
                  }
                  alt={cat.name || "Category"}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/images/category-placeholder.png";
                  }}
                />
              </div>

              {/* Name */}
              <p className="mt-2 text-xs font-medium text-gray-700 group-hover:text-green-600 text-center">
                {cat.name}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-sm text-gray-500">
          No categories found
        </div>
      )}
    </div>
  );
};
