"use client";

import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useState, useMemo } from "react";
import { apiClient } from "@/services/apiClient";
import { useDispatch } from "react-redux";
import { setRecommended } from "@/redux/slices/recommendationSlice";
import { fetchCart } from "@/redux/slices/cartSlice";
import { useRouter } from "next/navigation";
import { Loader } from "@/ui/Loader";

const ProductCard = dynamic(() => import("@/ui/ProductCard"), {
  ssr: false,
  loading: () => <div className="h-96 animate-puls rounded-xl" />,
});

const Pagination = dynamic(() => import("@/ui/Pagination"), {
  ssr: false,
  loading: () => <div className="h-96 animate-pulse rounded-xl" />,
});

const FilterAnim = dynamic(() => import("@/ui/FilterAnim"), {
  ssr: false,
  loading: () => <div className="h-96 animate-pulse rounded-xl" />,
});

const FilterSidebar = dynamic(() => import("@/ui/FilterSidebar"), {
  ssr: false,
  loading: () => <div className="h-96 animate-pulse rounded-xl" />,
});

const RecommendedProducts = dynamic(() => import("@/ui/RecommendedProducts"), {
  ssr: false,
  loading: () => <div className="h-96 animate-pulse rounded-xl" />,
});

const PER_PAGE = 20;

export default function Page() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [view, setView] = useState("grid");
  const [sortBy, setSortBy] = useState("featured");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const [price, setPrice] = useState(null);
  const [brands, setBrands] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [categories, setCategories] = useState([]);

  const addToCart = async (productId, qty = 1) => {
    try {
      console.log("Card");
      const res = await apiClient("/viewCart/addtoCart", {
        method: "POST",
        body: {
          productId,
          qty,
        },
      });

      if (res?.success) {
        dispatch(fetchCart());
        console.log("✅ Added to cart", res);
      } else {
        console.error("Failed to add cart", res);
      }
    } catch (err) {
      console.error("Add to cart error", err);
    }
  };

  // ================= API =================
  const fetchProducts = async () => {
    try {
      const res = await apiClient(`/product?page=1&limit=1000`);
      console.log("res", res)
      if (res?.success) {
        setProducts(res.data.products || []);

      }
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      const recommended = products
        .filter((p) => p.rating?.average >= 0)
        .slice(0, 10);

      console.log("Recommended:", recommended);
      dispatch(setRecommended(recommended));
    }
  }, [products]);

  const toggleBrand = (brand) => {
    setBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand],
    );
  };

  const toggleRating = (rating) => {
    setRatings((prev) =>
      prev.includes(rating)
        ? prev.filter((r) => r !== rating)
        : [...prev, rating],
    );
  };

  const toggleCategory = (categoryId) => {
    setCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((c) => c !== categoryId)
        : [...prev, categoryId],
    );
  };

  const getProductPrice = (product) => {
    // For simple products with effectivePrice
    if (product?.effectivePrice != null) return product.effectivePrice;

    // For simple products with special price
    if (product?.simpleProduct?.sp_specialPrice != null)
      return product.simpleProduct.sp_specialPrice;

    // For simple products with regular price
    if (product?.simpleProduct?.sp_price != null)
      return product.simpleProduct.sp_price;

    // For variable products - check first variant's special price
    if (product?.variants?.length > 0) {
      const firstVariant = product.variants[0];
      // Check for variant special price first
      if (firstVariant?.variant_specialPrice != null)
        return firstVariant.variant_specialPrice;
      // Then check variant regular price
      if (firstVariant?.variant_price != null)
        return firstVariant.variant_price;
    }

    return null;
  };

  const brandList = useMemo(() => {
    const set = new Set();

    products.forEach((p) => {
      if (p.brand) {
        set.add(p.brand);
      }
    });

    return Array.from(set);
  }, [products]);

  const priceRanges = useMemo(() => {
    const prices = products
      .map((p) => getProductPrice(p))
      .filter((p) => typeof p === "number");

    if (prices.length === 0) return [];

    const maxPrice = Math.max(...prices);

    const ranges = [{ label: "Under ₹500", value: "0-500" }];

    if (maxPrice > 500) {
      ranges.push({ label: "₹500 - ₹1000", value: "500-1000" });
    }

    if (maxPrice > 1000) {
      ranges.push({ label: "Above ₹1000", value: "1000+" });
    }

    return ranges;
  }, [products]);

  const categoryList = useMemo(() => {
    const map = new Map();

    products.forEach((p) => {
      if (p.categoryId?._id) {
        map.set(p.categoryId._id, p.categoryId.name);
      }
    });

    return Array.from(map.entries()).map(([id, name]) => ({
      id,
      name,
    }));
  }, [products]);

  // ================= FILTER + SORT =================
  const filteredProducts = useMemo(() => {
    return (
      products
        // 🔍 Search
        .filter((p) =>
          search ? p?.name?.toLowerCase().includes(search.toLowerCase()) : true,
        )

        .filter((p) => {
          if (!price) return true;
          const productPrice = getProductPrice(p);
          if (productPrice == null) return false;

          if (price === "0-500") return productPrice < 500;
          if (price === "500-1000")
            return productPrice >= 500 && productPrice <= 1000;
          if (price === "1000+") return productPrice > 1000;

          return true;
        })

        .filter((p) => (brands.length > 0 ? brands.includes(p.brand) : true))

        .filter((p) =>
          categories.length > 0 ? categories.includes(p.categoryId?._id) : true,
        )

        .filter((p) =>
          ratings.length > 0
            ? ratings.some((r) => (p.rating?.average || 0) >= r)
            : true,
        )
    );
  }, [products, search, price, brands, ratings]);

  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      const priceA = getProductPrice(a) ?? 0;
      const priceB = getProductPrice(b) ?? 0;

      if (sortBy === "price-low") return priceA - priceB;
      if (sortBy === "price-high") return priceB - priceA;
      if (sortBy === "rating")
        return (b.rating?.average || 0) - (a.rating?.average || 0);

      return 0;
    });
  }, [filteredProducts, sortBy]);

  // ================= PAGINATION =================
  useEffect(() => {
    setTotalPages(Math.max(1, Math.ceil(sortedProducts.length / PER_PAGE)));
    setCurrentPage(1);
  }, [sortedProducts]);

  const startIndex = (currentPage - 1) * PER_PAGE;
  const paginatedProducts = sortedProducts.slice(
    startIndex,
    startIndex + PER_PAGE,
  );

  const clearFilters = () => {
    setPrice(null);
    setBrands([]);
    setRatings([]);
    setSearch("");
    setSortBy("featured");
    setCurrentPage(1);
  };

  return (
    <>
      {loading && <Loader fullScreen={true} />}
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6 text-sm text-gray-500 font-medium"
          >
            Home / Womens Fashion / <span className="text-black">T-Shirts</span>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-14">
            {/* Sidebar */}
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:w-64"
            >
              <FilterSidebar
                priceRanges={priceRanges}
                selectedPrice={price}
                onPriceChange={setPrice}
                brands={brandList}
                selectedBrands={brands}
                onBrandChange={toggleBrand}
                ratings={[4, 3, 2]}
                selectedRatings={ratings}
                onRatingChange={toggleRating}
                onClearFilters={clearFilters}
                categories={categoryList}
                selectedCategories={categories}
                onCategoryChange={toggleCategory}
              />
            </motion.aside>

            <main className="flex-1">
              <FilterAnim
                search={search}
                onSearchChange={setSearch}
                view={view}
                onViewChange={setView}
              />

              {paginatedProducts.length === 0 && (
                <p className="text-center text-gray-500 py-10">
                  No products found
                </p>
              )}

              <motion.div
                layout
                className={
                  view === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-8"
                    : "space-y-6"
                }
              >
                <AnimatePresence mode="popLayout">
                  {paginatedProducts.map((product, index) => (
                    <motion.div
                      key={product._id}
                      layout
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{
                        duration: 0.4,
                        delay: index * 0.05,
                        ease: [0.23, 1, 0.32, 1],
                      }}
                    >
                      <ProductCard
                        image={product?.mainImage}
                        name={product?.name}
                        category={product?.categoryId?.name ?? "Uncategorized"}
                        shortDescription={product?.shortDescription}
                        price={getProductPrice(product)}
                        originalPrice={
                          product?.simpleProduct?.sp_price ||
                          (product?.variants?.length > 0
                            ? product.variants[0].variant_price
                            : null)
                        }
                        discount={product?.discountPercentage}
                        rating={Math.round(product.rating?.average || 0)}
                        reviews={product.rating?.count || 0}
                        onNavigate={() =>
                          router.push(`/products/${product._id}`)
                        }
                        onAddToCart={() => addToCart(product._id)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </main>
          </div>
        </div>

        <div className="p-8">
          <RecommendedProducts />
        </div>
      </div>
    </>
  );
}