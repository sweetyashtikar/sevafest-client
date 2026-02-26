"use client";

import { memo } from "react";
import { Search, LayoutGrid, List, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FilterAnim = ({
  search,
  onSearchChange,
  view,
  onViewChange,
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 mb-8 text-black"
    >
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
       
        <div className="relative flex-1 w-full group">
          <motion.div
            whileFocus={{ scale: 1.01 }}
            className="relative"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors w-5 h-5" />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search premium products..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl text-black placeholder:text-gray-400
                         focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
            />
          </motion.div>
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">

          <div className="h-8 w-[1px] bg-gray-200 hidden sm:block mx-2"></div>

          <div className="flex bg-gray-100 p-1 rounded-xl">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onViewChange("grid")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                view === "grid"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden md:inline">Grid</span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onViewChange("list")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                view === "list"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <List className="w-4 h-4" />
              <span className="hidden md:inline">List</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default memo(FilterAnim);