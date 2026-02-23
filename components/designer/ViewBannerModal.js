"use client";

import Image from "next/image";
import { X, Calendar, Tag, Layers, Activity } from "lucide-react";

const ViewBannerModal = ({ isOpen, onClose, banner }) => {
  if (!isOpen || !banner) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-[90%] h-[90%] bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col">

        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-800">Banner Details</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 transition"
          >
            <X size={18} className="text-black" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          <div className="relative w-full h-72 rounded-xl overflow-hidden border border-slate-200">
            <Image
              src={banner.image}
              alt={banner.title}
              fill
              className="object-cover"
            />
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-slate-800">
              {banner.title}
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="flex items-center gap-3">
              <Layers size={20} className="text-blue-500" />
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase">
                  Type
                </p>
                <p className="text-base font-medium capitalize text-slate-700">
                  {banner.bannerType}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Activity size={20} className="text-emerald-500" />
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase">
                  Status
                </p>
                <p
                  className={`text-base font-semibold ${
                    banner.status ? "text-emerald-600" : "text-slate-400"
                  }`}
                >
                  {banner.status ? "Active" : "Inactive"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Tag size={20} className="text-purple-500" />
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase">
                  Category
                </p>
                <p className="text-base font-medium text-slate-700">
                  {banner.category?.name || "Uncategorized"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar size={20} className="text-orange-500" />
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase">
                  Created
                </p>
                <p className="text-base font-medium text-slate-700">
                  {new Date(banner.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200 text-sm text-slate-500 space-y-2">
            <p>
              <strong>Updated:</strong>{" "}
              {new Date(banner.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewBannerModal;