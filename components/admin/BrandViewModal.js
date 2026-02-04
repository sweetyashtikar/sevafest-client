'use client'

import { X, Calendar, Activity, Tag, Image as ImageIcon } from "lucide-react";

export default function BrandViewModal({ brand, onClose }) {
  if (!brand) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      {/* Modal Container: 90% Width, 80% Height */}
      <div className="bg-white w-[90%] h-[80%] rounded-2xl shadow-2xl relative overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100">
          <h2 className="text-2xl font-bold text-black flex items-center gap-2">
            <Tag className="text-blue-600" size={24} />
            Brand Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-black"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content Section */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* Left Side: Brand Image */}
            <div className="space-y-4">
              <label className="text-sm font-bold uppercase tracking-wider text-black/40 flex items-center gap-2">
                <ImageIcon size={16} /> Brand Logo / Cover
              </label>
              <div className="aspect-video w-full rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden">
                {brand.image ? (
                  <img 
                    src={brand.image} 
                    alt={brand.name} 
                    className="w-full h-full object-contain p-4"
                  />
                ) : (
                  <div className="text-center text-black/30">
                    <ImageIcon size={48} className="mx-auto mb-2 opacity-20" />
                    <p>No image available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Side: Details */}
            <div className="space-y-8">
              {/* Name */}
              <div>
                <label className="text-sm font-bold uppercase tracking-wider text-black/40">Brand Name</label>
                <p className="text-3xl font-bold text-black mt-1">{brand.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Status */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <label className="text-sm font-bold uppercase tracking-wider text-black/40 flex items-center gap-2 mb-2">
                    <Activity size={16} /> Status
                  </label>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    brand.status 
                      ? "bg-green-100 text-green-700 border border-green-200" 
                      : "bg-red-100 text-red-700 border border-red-200"
                  }`}>
                    {brand.status ? "Active" : "Inactive"}
                  </span>
                </div>

                {/* Created Date */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <label className="text-sm font-bold uppercase tracking-wider text-black/40 flex items-center gap-2 mb-2">
                    <Calendar size={16} /> Registered
                  </label>
                  <p className="text-black font-semibold">
                    {new Date(brand.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              {/* Description (If available) */}
              {brand.description && (
                <div>
                  <label className="text-sm font-bold uppercase tracking-wider text-black/40">Description</label>
                  <p className="text-black leading-relaxed mt-2">{brand.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button
            onClick={onClose}
            className="bg-black text-white px-8 py-2.5 rounded-lg font-bold hover:bg-slate-800 transition-all active:scale-95"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}