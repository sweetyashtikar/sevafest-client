"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

const Swiper = () => {
  const { categories, loading } = useSelector((state) => state.category);

  console.log("categories", categories);

  return (
    <section className="py-16 px-4 bg-white font-sans overflow-hidden">
      <div className="text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-slate-800 mb-2"
        >
          Explore Products
        </motion.h2>
        <div className="w-64 h-1 bg-yellow-400 mx-auto mb-4 rounded-full" />
        <p className="text-slate-500 font-medium">
          Fresh, Organic & Daily Essentials Delivered to Your Doorstep
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-12">
          {categories?.data?.map((theme, index) => (
            <motion.div
              key={theme?._id || index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="flex flex-col items-center group cursor-pointer w-[140px] md:w-[180px]"
            >
              <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-yellow-400 p-1 bg-white overflow-hidden transition-transform duration-300 group-hover:scale-110 shadow-lg group-hover:shadow-yellow-200">
                <div className="relative w-full h-full rounded-full overflow-hidden">
                  <Image
                    src={theme.image}
                    alt={theme.name}
                    fill
                    className="object-cover"
                  />

                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px] transition-opacity"
                  >
                    <span className="text-white text-xs font-bold uppercase tracking-widest px-3 py-1 border border-white/50 rounded-full">
                      Explore
                    </span>
                  </motion.div>
                </div>
              </div>

              <h3
                className={`mt-4 text-center font-bold text-sm md:text-base transition-colors duration-300 ${
                  theme.name === "Cocomelon theme"
                    ? "text-yellow-500"
                    : "text-slate-700 group-hover:text-yellow-500"
                }`}
              >
                {theme.name}
              </h3>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="text-center mt-16">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-yellow-300 to-yellow-500 text-white font-bold py-3 px-8 
          rounded-full shadow-lg shadow-yellow-100 hover:shadow-xl transition-all flex items-center gap-2 mx-auto"
        >
          View All Products
          <span className="text-lg">→</span>
        </motion.button>
      </div>
    </section>
  );
};

export default React.memo(Swiper);
