"use client";

import { useState, useRef, useEffect } from "react";
import { X, Upload, Plus, Globe, Lock, Pencil } from "lucide-react";
import { apiClient } from "@/services/apiClient";

export default function AddBrandModal({
  onClose,
  initialData = null,
  onSuccess,
}) {
  const isEdit = Boolean(initialData);

  const [name, setName] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [icon, setIcon] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setIsPublic(initialData.status ?? true);
    }
  }, [initialData]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIcon(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    try {
      // Create FormData object
    const formData = new FormData();
    formData.append('name', name.trim());
    formData.append('status', isPublic);
    
    // Append the image if one was selected
    if (icon) {
      formData.append('icon', icon);
    }
    console.log("formData", formData)
      if (isEdit) {
        await apiClient(`/brands/${initialData._id}`, {
          method: "PATCH",
          body: formData,
        });
      } else {
        await apiClient("/brands", {
          method: "POST",
          body: formData,
        });
      }

      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("Brand save failed", err);
      alert("Failed to save brand");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-[500px] rounded-2xl shadow-2xl relative overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-xl font-bold text-black flex items-center gap-2">
            {isEdit ? (
              <>
                <Pencil size={18} className="text-blue-600" />
                Edit Brand
              </>
            ) : (
              <>
                <Plus size={18} className="text-blue-600" />
                Create New Brand
              </>
            )}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-full transition-colors text-black"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Image Picker */}
          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-wider text-black/40">
              Brand Logo
            </label>
            <div
              onClick={() => fileInputRef.current.click()}
              className="group cursor-pointer relative aspect-video w-full rounded-xl bg-slate-50 border-2 border-dashed border-slate-200 hover:border-blue-500 hover:bg-blue-50/30 transition-all flex flex-col items-center justify-center overflow-hidden"
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-contain p-2"
                />
              ) : (
                <div className="text-center">
                  <div className="bg-white p-3 rounded-full shadow-sm mx-auto mb-2 text-slate-400 group-hover:text-blue-600 transition-colors">
                    <Upload size={24} />
                  </div>
                  <p className="text-sm font-medium text-black">
                    Click to upload icon
                  </p>
                  <p className="text-xs text-black/40 mt-1">
                    PNG, JPG up to 5MB
                  </p>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
             accept="image/*"
              />
            </div>
          </div>

          {/* Name Input */}
          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-wider text-black/40">
              Brand Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Nike, Apple"
              className="w-full border border-slate-200 px-4 py-3 rounded-xl text-black font-medium placeholder:text-black/20 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

          {/* Visibility Switch (Public/Private) */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg ${isPublic ? "bg-blue-100 text-blue-600" : "bg-slate-200 text-slate-600"}`}
              >
                {isPublic ? <Globe size={18} /> : <Lock size={18} />}
              </div>
              <div>
                <p className="font-bold text-black text-sm">
                  {isPublic ? "Public Brand" : "Private Brand"}
                </p>
                <p className="text-xs text-black/40">
                  {isPublic ? "Visible to everyone" : "Only visible to admins"}
                </p>
              </div>
            </div>

            {/* Custom Toggle Switch */}
            <button
              onClick={() => setIsPublic(!isPublic)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                isPublic ? "bg-blue-600" : "bg-slate-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isPublic ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg font-bold text-black hover:bg-slate-100 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!name}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-2.5 rounded-lg font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95"
          >
            Save Brand
          </button>
        </div>
      </div>
    </div>
  );
}
