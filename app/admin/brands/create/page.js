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
      toast.error(err.message);
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
    <div className="min-h-screen py-8">
      <div className="w-full bg-white rounded-[32px] shadow-sm border border-slate-200/60 overflow-hidden">
        <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="p-3 bg-blue-50 rounded-2xl">
              {isEdit ? (
                <Pencil size={24} className="text-blue-600" />
              ) : (
                <Plus size={24} className="text-blue-600" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                {isEdit ? "Edit Brand Identity" : "Launch New Brand"}
              </h1>
              <p className="text-slate-500 text-sm font-medium mt-0.5">
                {isEdit
                  ? "Modify existing brand details and market presence."
                  : "Add a new brand to your global catalog."}
              </p>
            </div>
          </div>
        </div>

        <div className="p-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              <label className="text-[14px] uppercase tracking-widest font-black text-slate-400 ml-1">
                Brand Logo / Asset
              </label>

              <div
                onClick={() => fileInputRef.current.click()}
                className="group relative cursor-pointer aspect-video w-full rounded-[32px] bg-slate-50 border-2 border-dashed border-slate-200
              hover:border-blue-400 hover:bg-blue-50/20 transition-all duration-500 flex items-center justify-center overflow-hidden"
              >
                {preview ? (
                  <div className="relative w-full h-full flex items-center justify-center p-8">
                    <img
                      src={preview}
                      className="max-w-full max-h-full object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-5 bg-white rounded-3xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                      <Upload size={32} className="text-blue-500" />
                    </div>
                    <div className="text-center">
                      <span className="block text-base font-bold text-slate-700">
                        Upload High-Resolution Logo
                      </span>
                      <span className="text-sm text-slate-400 mt-1 block">
                        Supports PNG, SVG or WebP
                      </span>
                    </div>
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

            <div className="flex flex-col justify-between space-y-8">
              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[14px] uppercase tracking-widest font-black text-slate-400 ml-1">
                    General Information
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter brand name (e.g. Nike)"
                    className="w-full bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 px-6 py-5 rounded-2xl
                     text-slate-900 transition-all outline-none placeholder:text-slate-300 font-bold text-lg"
                  />
                </div>

                {/* Visibility Toggle */}
                <div className="flex items-center justify-between p-6 bg-slate-50/80 rounded-[28px] border border-slate-100">
                  <div className="flex flex-col">
                    <span className="text-base font-black text-slate-800">
                      {isPublic ? "Public Visibility" : "Private Draft"}
                    </span>
                    <span className="text-sm text-slate-500 font-medium">
                      {isPublic
                        ? "Visible to all customers in the store"
                        : "Only administrators can view this brand"}
                    </span>
                  </div>

                  <button
                    onClick={() => setIsPublic(!isPublic)}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none ${
                      isPublic ? "bg-blue-600" : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
                        isPublic ? "translate-x-7" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleSubmit}
                  disabled={!name || loading}
                  className="w-fit px-12 bg-slate-900 hover:bg-black text-white py-4 rounded-2xl font-black shadow-2xl shadow-slate-200 
                active:scale-[0.98] transition-all disabled:opacity-40 disabled:grayscale disabled:cursor-not-allowed
                flex items-center justify-center gap-3 text-lg"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>{isEdit ? "Update Identity" : "Launch Brand"}</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
