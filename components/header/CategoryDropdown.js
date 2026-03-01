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
      className="absolute top-full left-0 mt-3 w-[1300px] bg-white rounded-xl shadow-2xl border border-gray-200 z-50 p-6"
    >
      <h3 className="text-lg font-semibold mb-6 text-[#1a1c24]">
        Browse Categories
      </h3>

      {loading && categoryList.length === 0 ? (
        <div className="text-center text-sm text-gray-500">Loading...</div>
      ) : categoryList.length > 0 ? (
        <div className="grid grid-cols-6 gap-8">
          {categoryList.map((cat) => (
            <div
              key={cat._id}
              onClick={() => {
                router.push(`/category/${cat._id}`);
                onClose();
              }}
              className="flex items-start gap-4 cursor-pointer group"
            >
              <div className="w-16 h-16 flex-shrink-0">
                <div className="w-full h-full bg-[#fdd835] p-1 rounded-lg">
                  <div className="w-full h-full bg-white rounded-md overflow-hidden">
                    <img
                      src={
                        cat.image && cat.image.trim() !== ""
                          ? cat.image
                          : "/images/category-placeholder.png"
                      }
                      alt={cat.name || "Category"}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src =
                          "/images/category-placeholder.png";
                      }}
                    />
                  </div>
                </div>
              </div>
              <div>
                <p className="font-semibold text-[#1a1c24] text-sm group-hover:text-[#fcc221] transition">
                  {cat.name}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Explore decoration services
                </p>
              </div>
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
