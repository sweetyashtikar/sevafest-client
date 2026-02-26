"use client";

import { toast } from "react-toastify";
import { useState, useEffect, useRef } from "react";
import { Upload, Plus, Pencil, Globe, Lock, X } from "lucide-react";
import { apiClient } from "@/services/apiClient";
import { useRouter, useSearchParams } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const isEdit = Boolean(id);

  const [name, setName] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [icon, setIcon] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isEdit) fetchBrand();
  }, [id]);

  const fetchBrand = async () => {
    try {
      setPageLoading(true);
      const res = await apiClient(`/brands/${id}`, { method: "GET" });
      const data = res.data;

      setName(data.name || "");
      setIsPublic(data.status ?? true);
      if (data.icon) setPreview(data.icon);
    } catch (err) {
      console.error("Brand fetch failed", err);
    } finally {
      setPageLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIcon(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("status", isPublic ? "true" : "false");

      if (icon) {
        formData.append("icon", icon);
      }
      console.log("formData", formData);

      if (isEdit) {
        await apiClient(`/brands/${id}`, {
          method: "PATCH",
          body: formData,
        });
        toast.success("Brand updated successfully 🚀");
      } else {
        await apiClient("/brands", {
          method: "POST",
          body: formData,
        });
        toast.success("Brand created successfully 🎉");
      }

      setTimeout(() => {
        router.push("/admin/brands");
      }, 1000);
    } catch (err) {
      console.error("Brand save failed", err);
      toast.error("Failed to save brand ❌");
    } finally {
      setLoading(false);
    }
  };

  // const handleSubmit = async () => {
  //   setLoading(true);

  //   try {
  //     if (!name.trim()) {
  //       toast.error("Brand name is required");
  //       return;
  //     }

  //     const payload = {
  //       name: name.trim(),
  //       status: isPublic,
  //     };

  //     if (isEdit) {
  //       await apiClient(`/brands/${id}`, {
  //         method: "PATCH",
  //         body: payload,
  //       });

  //       toast.success("Brand updated successfully 🚀");
  //     } else {
  //       await apiClient("/brands", {
  //         method: "POST",
  //         body: payload, 
  //       });

  //       toast.success("Brand created successfully 🎉");
  //     }

  //     setTimeout(() => {
  //       router.push("/admin/brands");
  //     }, 1000);
  //   } catch (err) {
  //     console.error("Brand save failed", err);
  //     toast.error(err.response?.data?.error || "Failed to save brand ❌");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  if (pageLoading) {
    return (
      <div className="p-10 text-center">
        <div
          className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full 
        animate-spin mx-auto mb-3"
        ></div>
        Loading brand...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4">
      <div className="max-w-xl mx-auto bg-white rounded-[32px] shadow-sm border border-slate-200/60 overflow-hidden">
        {/* Header Section */}
        <div className="px-8 pt-8 pb-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 rounded-2xl">
                {isEdit ? (
                  <Pencil size={20} className="text-blue-600" />
                ) : (
                  <Plus size={20} className="text-blue-600" />
                )}
              </div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                {isEdit ? "Edit Brand" : "New Brand"}
              </h1>
            </div>
            <p className="text-slate-500 text-sm mt-1 ml-[52px]">
              {isEdit
                ? "Modify existing brand identity"
                : "Add a new brand to your catalog"}
            </p>
          </div>

          <button
            onClick={() => router.push("/admin/brands")}
            className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-full transition-all"
          >
            <X size={22} />
          </button>
        </div>

        <div className="px-8 pb-10 space-y-8">
          {/* Logo Upload - Premium Square/Circle Style */}
          <div className="space-y-3">
            <label className="text-[13px] uppercase tracking-[0.05em] font-bold text-slate-400 ml-1">
              Brand Identity
            </label>

            <div
              onClick={() => fileInputRef.current.click()}
              className="group relative cursor-pointer aspect-[16/9] w-full rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200
                hover:border-blue-400 hover:bg-blue-50/20 transition-all duration-300 flex items-center justify-center overflow-hidden"
            >
              {preview ? (
                <div className="relative w-full h-full flex items-center justify-center p-6">
                  <img
                    src={preview}
                    className="max-w-full max-h-full object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="p-4 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform duration-300">
                    <Upload size={24} className="text-blue-500" />
                  </div>
                  <span className="text-sm font-medium text-slate-500">
                    Upload high-res logo
                  </span>
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

          {/* Brand Name - Minimalist Floating-style Input */}
          <div className="space-y-3">
            <label className="text-[13px] uppercase tracking-[0.05em] font-bold text-slate-400 ml-1">
              General Information
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter brand name (e.g. Nike)"
              className="w-full bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 px-5 py-4 rounded-2xl text-slate-900 transition-all outline-none placeholder:text-slate-300 font-medium"
            />
          </div>

          {/* Visibility Toggle - Stripe Style */}
          <div className="flex items-center justify-between p-5 bg-slate-50/80 rounded-[24px] border border-slate-100">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-800">
                {isPublic ? "Public Visibility" : "Private Draft"}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {isPublic
                  ? "Visible to all customers"
                  : "Only admins can see this"}
              </span>
            </div>

            <button
              onClick={() => setIsPublic(!isPublic)}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${
                isPublic ? "bg-blue-600" : "bg-slate-300"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
                  isPublic ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Action Button - Large & Bold */}
          <div className="pt-2">
            <button
              onClick={handleSubmit}
              disabled={!name || loading}
              className="w-full bg-slate-900 hover:bg-black text-white py-4.5 rounded-2xl font-bold shadow-xl shadow-slate-200 
                active:scale-[0.98] transition-all disabled:opacity-40 disabled:grayscale disabled:cursor-not-allowed
                flex items-center justify-center gap-2 text-base"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>{isEdit ? "Update Identity" : "Launch Brand"}</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
