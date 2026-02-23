"use client";

import Image from "next/image";
import { Eye, Pencil, Trash2, Calendar, Tag, Activity } from "lucide-react";

const BannerTable = ({
  data = [],
  onView,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                Preview
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                Banner Details
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">
                Type
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">
                Status
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                Created
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">
                Actions
              </th>
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-slate-100">
            {data.length > 0 ? (
              data.map((item) => (
                <tr
                  key={item._id}
                  className="group hover:bg-blue-50/30 transition-all duration-200"
                >
                  {/* Image with Glow Effect */}
                  <td className="px-6 py-4">
                    <div className="relative h-14 w-24 overflow-hidden rounded-lg border border-slate-200 shadow-sm group-hover:border-blue-300 transition-colors">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </td>

                  {/* Title & Category Info */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </span>
                      <div className="flex items-center gap-1 mt-1">
                        <Tag size={12} className="text-slate-400" />
                        <span className="text-xs text-slate-500 font-medium">
                          {item.category?.name || "Uncategorized"}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Type Badge */}
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-slate-100 text-slate-600 capitalize">
                      {item.bannerType}
                    </span>
                  </td>

                  {/* Professional Status Pill */}
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-3">
                      {/* Toggle */}
                      <button
                        onClick={() => onStatusChange?.(item)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                          item.status ? "bg-emerald-500" : "bg-slate-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                            item.status ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>

                      {/* Label */}
                      <span
                        className={`text-xs font-semibold ${
                          item.status ? "text-emerald-600" : "text-slate-400"
                        }`}
                      >
                        {item.status ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </td>

                  {/* Date with Icon */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Calendar size={14} />
                      <span className="text-sm font-medium">
                        {new Date(item.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </td>

                  {/* Fancy Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onView?.(item)}
                        className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => onEdit?.(item)}
                        className="p-2 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-all"
                        title="Edit Banner"
                      >
                        <Pencil size={18} />
                      </button>
                      <div className="w-px h-4 bg-slate-200 mx-1"></div>
                      <button
                        onClick={() => onDelete?.(item)}
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <Activity size={40} strokeWidth={1} />
                    <p className="font-medium">
                      No banners found in your records.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BannerTable;
