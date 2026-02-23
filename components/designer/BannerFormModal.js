"use client";

import { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";
import { apiClient } from "@/services/apiClient";

const BannerFormModal = ({ isOpen, onClose, onSuccess, banner }) => {
  const isEdit = !!banner;

  const [form, setForm] = useState({
    bannerType: "",
    title: "",
    status: true,
    category: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (banner) {
      setForm({
        bannerType: banner.bannerType || "",
        title: banner.title || "",
        status: banner.status ?? true,
        category: banner.category?._id || "",
      });
    } else {
      setForm({
        bannerType: "",
        title: "",
        status: true,
        category: "",
      });
    }
  }, [banner]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("bannerType", form.bannerType);
      formData.append("title", form.title);
      formData.append("status", form.status);
      if (form.bannerType === "category") {
        formData.append("category", form.category);
      }
      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (isEdit) {
        await apiClient(`/banners/${banner._id}`, {
          method: "PUT",
          body: formData,
        });
      } else {
        await apiClient("/banners", {
          method: "POST",
          body: formData,
        });
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Save error:", error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-[90%] max-w-2xl bg-white rounded-2xl shadow-xl">

        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-bold text-lg">
            {isEdit ? "Edit Banner" : "Create Banner"}
          </h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          <div>
            <label className="text-sm font-semibold">Banner Type</label>
            <select
              name="bannerType"
              value={form.bannerType}
              onChange={handleChange}
              required
              className="w-full mt-1 border rounded-lg px-3 py-2"
            >
              <option value="">Select type</option>
              <option value="category">Category</option>
              <option value="deal of the day">Deal of the Day</option>
            </select>
          </div>

          {form.bannerType === "category" && (
            <div>
              <label className="text-sm font-semibold">Category ID</label>
              <input
                type="text"
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full mt-1 border rounded-lg px-3 py-2"
              />
            </div>
          )}

          <div>
            <label className="text-sm font-semibold">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full mt-1 border rounded-lg px-3 py-2"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="w-full mt-1"
              required={!isEdit}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="status"
              checked={form.status}
              onChange={handleChange}
            />
            <label className="text-sm font-medium">Active</label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="animate-spin" size={16} />}
            {isEdit ? "Update Banner" : "Create Banner"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BannerFormModal;