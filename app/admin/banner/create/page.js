"use client";

import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { X, Upload, Plus, Globe, Lock, Pencil } from "lucide-react";
import { apiClient } from "@/services/apiClient";
import { useSearchParams, useRouter } from "next/navigation";

const BANNER_TYPES = [
  { value: "deal of the day", label: "Deal of the Day" },
  { value: "home", label: "Home" },
  { value: "header", label: "Header" },
  { value: "footer", label: "Footer" },
  { value: "coupons", label: "Coupons" },
  { value: "about us", label: "About Us" },
  { value: "category", label: "Category" },
  { value: "products", label: "Products" },
  { value: "contact us", label: "Contact Us" },
];

export default function CreateBanner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");

  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    bannerType: "",
    title: "",
    status: true,
    category: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [pageLoading, setPageLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
    if (isEdit) {
      fetchBanner();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await apiClient("/category/status-true", {
        method: "GET",
      });
      setCategories(response.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchBanner = async () => {
    try {
      setPageLoading(true);
      const res = await apiClient(`/banners/${id}`, { method: "GET" });
      const data = res.data;

      setFormData({
        bannerType: data.bannerType || "",
        title: data.title || "",
        status: data.status ?? true,
        category: data.category?._id || "",
        image: data.image || null,
      });

      setImagePreview(data.image || null);
    } catch (err) {
      console.error("Error fetching banner:", err);
      setError("Failed to load banner data");
    } finally {
      setPageLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      image: file,
    }));

    setImagePreview(URL.createObjectURL(file));
    setError("");
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: null,
    }));
    setImagePreview(null);

    const input = document.getElementById("banner-image-upload");
    if (input) input.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (!formData.bannerType) {
        throw new Error("Please select banner type");
      }

      if (!formData.image && !imagePreview) {
        throw new Error("Please upload a banner image");
      }

      if (formData.bannerType === "category" && !formData.category) {
        throw new Error("Please select a category");
      }

      const submitData = new FormData();
      submitData.append("bannerType", formData.bannerType);
      submitData.append("status", formData.status);

      if (formData.title.trim()) {
        submitData.append("title", formData.title.trim());
      }

      if (formData.bannerType === "category") {
        submitData.append("category", formData.category);
      }

      if (formData.image instanceof File) {
        submitData.append("image", formData.image);
      }

      if (isEdit) {
        await apiClient(`/banners/${id}`, {
          method: "PUT",
          body: submitData,
        });
        toast.success("Banner updated successfully 🚀");
      } else {
        await apiClient("/banners", {
          method: "POST",
          body: submitData,
        });

        toast.success("Banner created successfully 🎉");
      }

      setTimeout(() => {
        router.push("/admin/banner");
      }, 1000);

      router.push("/admin/banner");
    } catch (err) {
      console.error(err);

      const message =
        err.message || err.response?.data?.error || "Something went wrong";

      toast.error(message);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="p-10 text-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent
         rounded-full animate-spin mx-auto mb-3"></div>
        Loading banner...
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header - Refined with subtle border */}
        <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-white">
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                {isEdit ? (
                  <Pencil size={18} className="text-blue-600" />
                ) : (
                  <Plus size={18} className="text-blue-600" />
                )}
              </div>
              {isEdit ? "Edit Banner" : "Create New Banner"}
            </h2>
            <p className="text-sm text-gray-400 mt-1 font-medium">
              {isEdit
                ? "Update your banner details and visibility."
                : "Fill in the details to launch a new campaign."}
            </p>
          </div>

          <button
            onClick={() => router.push("/admin/banner")}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl text-red-700 text-sm font-medium animate-in fade-in slide-in-from-top-1">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 gap-8">
              {/* Banner Type Selection */}
              <div className="space-y-2">
                <label className="text-[13px] uppercase tracking-wider font-bold text-gray-400 ml-1">
                  Banner Type <span className="text-blue-500">*</span>
                </label>
                <select
                  name="bannerType"
                  value={formData.bannerType}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-blue-500 px-4 py-3.5 rounded-2xl text-gray-700 transition-all outline-none appearance-none cursor-pointer"
                >
                  <option value="">Select banner type</option>
                  {BANNER_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category - Modern conditional slide */}
              {formData.bannerType === "category" && (
                <div className="space-y-2 animate-in fade-in zoom-in-95 duration-300">
                  <label className="text-[13px] uppercase tracking-wider font-bold text-gray-400 ml-1">
                    Target Category <span className="text-blue-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-blue-500 px-4 py-3.5 rounded-2xl text-gray-700 transition-all outline-none"
                  >
                    <option value="">Choose category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Enhanced Image Upload Area */}
              <div className="space-y-2">
                <label className="text-[13px] uppercase tracking-wider font-bold text-gray-400 ml-1">
                  Creative Asset <span className="text-blue-500">*</span>
                </label>

                {!imagePreview ? (
                  <label className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:bg-gray-50 hover:border-blue-300 transition-all group">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <div className="p-3 bg-blue-50 rounded-full mb-3 group-hover:scale-110 transition-transform">
                        <Plus size={24} className="text-blue-500" />
                      </div>
                      <p className="text-sm text-gray-500 font-medium">
                        Click to upload banner
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        PNG, JPG or WebP (Max 2MB)
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                ) : (
                  <div className="relative group rounded-2xl overflow-hidden border border-gray-100 shadow-lg">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="bg-white/20 backdrop-blur-md text-white p-3 rounded-full hover:bg-red-500 transition-colors"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Input - Title */}
              <div className="space-y-2">
                <label className="text-[13px] uppercase tracking-wider font-bold text-gray-400 ml-1">
                  Internal Title
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="e.g. Summer Collection 2024"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-blue-500 px-4 py-3.5 rounded-2xl text-gray-700 transition-all outline-none placeholder:text-gray-300"
                />
              </div>
            </div>

            {/* Status Toggle - Luxury feel */}
            <div className="flex justify-between items-center bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
              <div>
                <p className="font-bold text-gray-900 text-sm">
                  Visible on Storefront
                </p>
                <p className="text-xs text-gray-500 font-medium mt-0.5">
                  Toggle to set banner live or draft.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setFormData((p) => ({ ...p, status: !p.status }))
                }
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${formData.status ? "bg-blue-600" : "bg-gray-300"}`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${formData.status ? "translate-x-6" : "translate-x-1"}`}
                />
              </button>
            </div>

            {/* Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 hover:bg-black text-white py-4 rounded-2xl font-bold shadow-xl shadow-gray-200 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : isEdit ? (
                "Save Changes"
              ) : (
                "Publish Banner"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
