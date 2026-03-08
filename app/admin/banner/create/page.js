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
        <div
          className="w-8 h-8 border-4 border-blue-600 border-t-transparent
         rounded-full animate-spin mx-auto mb-3"
        ></div>
        Loading banner...
      </div>
    );
  }
  return (
    <div className="min-h-screen py-8 px-0">
      <div className="w-full bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between bg-white">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-xl">
                {isEdit ? (
                  <Pencil size={22} className="text-blue-600" />
                ) : (
                  <Plus size={22} className="text-blue-600" />
                )}
              </div>
              {isEdit ? "Edit Banner Details" : "Create New Banner Campaign"}
            </h2>
            <p className="text-base text-gray-400 mt-1 font-medium ml-16">
              {isEdit
                ? "Update your banner details and visibility across the storefront."
                : "Fill in the details below to launch a new promotional campaign."}
            </p>
          </div>

          <button
            onClick={() => router.push("/admin/banner")}
            className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors border border-gray-100"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-10">
          {error && (
            <div className="mb-8 p-5 bg-red-50 border-l-4 border-red-500 rounded-r-xl text-red-700 text-sm font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[14px] uppercase tracking-widest font-black text-gray-400 ml-1">
                    Banner Type <span className="text-blue-500">*</span>
                  </label>
                  <select
                    name="bannerType"
                    value={formData.bannerType}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-blue-500 px-6 py-4
                     rounded-2xl text-gray-700 transition-all outline-none appearance-none cursor-pointer text-lg"
                  >
                    <option value="">Select banner type</option>
                    {BANNER_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                {formData.bannerType === "category" && (
                  <div className="space-y-3 animate-in fade-in slide-in-from-left-2 duration-300">
                    <label className="text-[14px] uppercase tracking-widest font-black text-gray-400 ml-1">
                      Target Category <span className="text-blue-500">*</span>
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-blue-500 px-6 py-4 
                      rounded-2xl text-gray-700 transition-all outline-none text-lg"
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

                <div className="space-y-3">
                  <label className="text-[14px] uppercase tracking-widest font-black text-gray-400 ml-1">
                    Internal Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    placeholder="e.g. Summer Collection 2024"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-blue-500 px-6 py-4 rounded-2xl
                     text-gray-700 transition-all outline-none placeholder:text-gray-300 text-lg"
                  />
                </div>
              </div>

              {/* Right Side: Image Upload */}
              <div className="space-y-3">
                <label className="text-[14px] uppercase tracking-widest font-black text-gray-400 ml-1">
                  Creative Asset <span className="text-blue-500">*</span>
                </label>

                {!imagePreview ? (
                  <label
                    className="flex flex-col items-center justify-center w-full h-[320px] border-2 border-dashed border-gray-200 
                  rounded-3xl cursor-pointer hover:bg-gray-50 hover:border-blue-300 transition-all group bg-gray-50/30"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <div className="p-5 bg-blue-50 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                        <Plus size={32} className="text-blue-500" />
                      </div>
                      <p className="text-lg text-gray-600 font-bold">
                        Click to upload banner image
                      </p>
                      <p className="text-sm text-gray-400 mt-2">
                        Recommended: 1920x1080px (Max 2MB)
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
                  <div className="relative group rounded-3xl overflow-hidden border border-gray-100 shadow-xl h-[320px]">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="bg-red-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-600 transition-colors flex items-center gap-2"
                      >
                        <X size={20} /> Remove Image
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 pt-6">
              <div className="flex-1 flex justify-between items-center bg-blue-50/30 p-2 px-2 rounded-2xl border border-blue-100">
                <div className="px-6">
                  <p className="font-bold text-gray-900 text-sm">
                    Visible on Storefront
                  </p>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                    Toggle to set this banner live or keep as draft.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((p) => ({ ...p, status: !p.status }))
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors 
                  focus:outline-none ${formData.status ? "bg-blue-600" : "bg-gray-300"}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform ${formData.status ? 
                    "translate-x-6" : "translate-x-1"}`}
                  />
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full lg:w-fit lg:px-12 bg-gray-900 hover:bg-black text-white py-3 rounded-xl font-bold text-sm shadow-lg
                 shadow-gray-200 active:scale-[0.98] transition-all disabled:opacity-70 flex items-center justify-center gap-3"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : isEdit ? (
                  "Update Banner"
                ) : (
                  "Publish Banner"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
