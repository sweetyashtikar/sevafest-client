"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/services/apiClient";
import { useParams, useRouter } from "next/navigation";
import { Loader } from "@/ui/Loader";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Page = () => {
  
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await apiClient(
          `/product/category/${id}?page=${currentPage}&limit=10`,
        );

        setProducts(response?.data?.products || []);
        setTotalPages(response?.data?.pagination?.totalPages || 1);
      } catch (err) {
        console.log("err", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, currentPage]);

  const Pagination = () => {
    return (
      <div className="flex justify-center items-center gap-2 mt-10">
        {/* Previous Button */}
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className="w-10 h-10 flex items-center justify-center rounded-md border border-gray-900 bg-white
           hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
        >
          <ChevronLeft size={20} className="text-gray-700" />
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-2">
          {[...Array(totalPages)].map((_, index) => {
            const page = index + 1;
            const isActive = currentPage === page;

            return (
              <button
                key={index}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-md border flex items-center justify-center text-sm font-semibold transition-all shadow-sm ${
                  isActive
                    ? "bg-yellow-400 border-yellow-500 text-black"
                    : "bg-white border-gray-300 text-gray-700 hover:border-yellow-400 hover:text-yellow-600"
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="w-10 h-10 flex items-center justify-center rounded-md border border-gray-900 bg-white hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
        >
          <ChevronRight size={20} className="text-gray-700" />
        </button>
      </div>
    );
  };

  const ProductGrid = ({ products, onNavigate }) => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 p-4">
        {products.map((product, index) => (
          <motion.div
            key={product._id}
            onClick={() => router.push(`/products/${product._id}`)}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{
              scale: 1.03,
              translateY: -5,
              boxShadow: "0px 10px 20px rgba(0,0,0,0.1)",
            }}
            className="bg-white rounded-xl border border-gray-100 shadow-sm transition-all cursor-pointer p-4 flex flex-col h-full"
          >
            <div className="overflow-hidden rounded-lg bg-gray-50 h-40">
              <motion.img
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.4 }}
                src={product.mainImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            <h3 className="mt-3 font-semibold text-sm text-black line-clamp-2 h-10">
              {product.name}
            </h3>

            <div className="mt-2 flex items-center gap-2">
              {product.effectivePrice ? (
                <>
                  <span className="text-yellow-600 font-bold text-base">
                    ₹{product.effectivePrice}
                  </span>
                  <span className="text-gray-400 line-through text-xs">
                    ₹{product.simpleProduct?.sp_price}
                  </span>
                </>
              ) : (
                <span className="text-black font-bold">
                  ₹{product.simpleProduct?.sp_price || "—"}
                </span>
              )}
            </div>

            <div className="mt-2">
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  product.inStock
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {product.inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            <p className="mt-2 text-xs text-gray-500 line-clamp-2 italic">
              {product.shortDescription}
            </p>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <>
      {loading && <Loader fullScreen={true} />}

      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mb-8 text-center">
          <h1 className="text-gray-500 mt-2">Explore our premium collection</h1>
        </div>

        <ProductGrid products={products} />

        <Pagination />
      </div>
    </>
  );
};

export default Page;
