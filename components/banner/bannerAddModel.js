"use client";

import { useState, useRef, useEffect } from "react";
import { X, Upload, Plus, Globe, Lock, Pencil, Image as ImageIcon } from "lucide-react";
import { apiClient } from "@/services/apiClient";

// Banner type options - MUST match exactly with backend enum
const BANNER_TYPES = [
  { value: "deal of the day", label: "Deal of the Day" },
  { value: "home", label: "Home" },
  { value: "header", label: "Header" },
  { value: "footer", label: "Footer" },
  { value: "coupons", label: "Coupons" },
  { value: "about us", label: "About Us" },
  { value: "category", label: "Category" },
  { value: "products", label: "Products" },
  { value: "contact us", label: "Contact Us" }
];

export default function AddBannerModal({
  onClose,
  initialData = null,
  onSuccess,
  categories = []
}) {
  const isEdit = Boolean(initialData);

  const [formData, setFormData] = useState({
    bannerType: '',
    title: '',
    status: true,
    category: '',
    image: null
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  // Initialize form with initialData if editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        bannerType: initialData.bannerType || '',
        title: initialData.title || '',
        status: initialData.status ?? true,
        category: initialData.category?._id || initialData.category || '',
        image: initialData.image || ''
      });
      setImagePreview(initialData.image || null);
    }
  }, [initialData]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  // Handle image upload - FIXED: Following your category form pattern
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }

      // Update form data with file - following your category form pattern
      setFormData(prev => ({
        ...prev,
        image: file
      }));

      // Create preview
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      
      // Clear error
      setError('');
    }
  };

  // Handle remove image - FIXED: Following your category form pattern
  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null
    }));
    
    setImagePreview(null);
    
    // Reset file input
    const input = document.getElementById('banner-image-upload');
    if (input) input.value = '';
  };

  // Handle form submission - FIXED: Following your category form pattern
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate form
      if (!formData.bannerType) {
        setError('Please select banner type');
        setLoading(false);
        return;
      }

      if (!formData.image && !imagePreview) {
        setError('Please upload a banner image');
        setLoading(false);
        return;
      }

      if (formData.bannerType === 'category' && !formData.category) {
        setError('Please select a category');
        setLoading(false);
        return;
      }

      // Create FormData for file upload - following your category form pattern
      const submitData = new FormData();
      
      // Append all form fields
      submitData.append('bannerType', formData.bannerType);
      submitData.append('status', formData.status);
      
      if (formData.title.trim()) {
        submitData.append('title', formData.title.trim());
      }
      
      if (formData.bannerType === 'category' && formData.category) {
        submitData.append('category', formData.category);
      }
      
      // Handle image upload - following your category form pattern
      if (formData.image instanceof File) {
        submitData.append('image', formData.image);
      } else if (typeof formData.image === 'string' && formData.image) {
        // If editing and image is a string URL, we might need to handle differently
        // Your backend might expect existing_image or something similar
        // For now, we'll just not append anything if it's an existing image
        console.log('Existing image:', formData.image);
      }

      let response;
      if (isEdit) {
        response = await apiClient(`/banners/${initialData._id}`, {
          method: "PUT",
          body: submitData,
          headers: {
            // Don't set Content-Type header
          }
        });
      } else {
        response = await apiClient("/banners", {
          method: "POST",
          body: submitData,
          headers: {
            // Don't set Content-Type header
          }
        });
      }

      console.log("Banner saved successfully:", response);
      onSuccess?.(response.data);
      onClose();
    } catch (err) {
      console.error("Banner save failed", err);
      
      // Handle validation errors from backend
      if (err.response?.data?.errors) {
        const errorMessages = err.response.data.errors.map(e => e.msg).join(', ');
        setError(errorMessages);
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Failed to save banner. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-[550px] rounded-2xl shadow-2xl relative overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-black flex items-center gap-2">
            {isEdit ? (
              <>
                <Pencil size={18} className="text-blue-600" />
                Edit Banner
              </>
            ) : (
              <>
                <Plus size={18} className="text-blue-600" />
                Create New Banner
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

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Banner Type Selection */}
          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-wider text-black/40">
              Banner Type <span className="text-red-500">*</span>
            </label>
            <select
              name="bannerType"
              value={formData.bannerType}
              onChange={handleChange}
              className="w-full border border-slate-200 px-4 py-3 rounded-xl text-black font-medium outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 appearance-none bg-white"
            >
              <option value="">Select banner type</option>
              {BANNER_TYPES.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

              {/* Category Selection (Conditional) */}
          {formData.bannerType === 'category' && (
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-black/40">
                Select Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border border-slate-200 px-4 py-3 rounded-xl text-black font-medium outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 appearance-none bg-white"
              >
                <option value="">Choose a category</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          )}


          {/* Image Upload - FIXED: Following your category form pattern */}
          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-wider text-black/40">
              Banner Image <span className="text-red-500">*</span>
            </label>
            
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="banner-image-upload"
              />
              <label
                htmlFor="banner-image-upload"
                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 cursor-pointer transition-colors inline-flex items-center gap-2"
              >
                <Upload size={16} />
                Choose Image
              </label>
              
              {(formData.image || imagePreview) && (
                <span className="text-sm text-gray-600">
                  {formData.image instanceof File ? formData.image.name : 'Image selected'}
                </span>
              )}
            </div>

            {/* Image Preview - FIXED: Following your category form pattern */}
            {(imagePreview || (typeof formData.image === 'string' && formData.image)) && (
              <div className="mt-2 relative">
                <img
                  src={imagePreview || formData.image}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded-xl border border-gray-200"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x200?text=Error+Loading+Image';
                  }}
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Title Input */}
          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-wider text-black/40">
              Banner Title <span className="text-xs font-normal text-black/40">(Optional)</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Summer Sale 2024"
              maxLength={100}
              className="w-full border border-slate-200 px-4 py-3 rounded-xl text-black font-medium placeholder:text-black/20 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
            <p className="text-xs text-black/40 text-right">
              {formData.title.length}/100 characters
            </p>
          </div>

      
          {/* Status Switch (Active/Inactive) */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg ${formData.status ? "bg-green-100 text-green-600" : "bg-slate-200 text-slate-600"}`}
              >
                {formData.status ? <Globe size={18} /> : <Lock size={18} />}
              </div>
              <div>
                <p className="font-bold text-black text-sm">
                  {formData.status ? "Active Banner" : "Inactive Banner"}
                </p>
                <p className="text-xs text-black/40">
                  {formData.status ? "Banner is visible on site" : "Banner is hidden from site"}
                </p>
              </div>
            </div>

            {/* Custom Toggle Switch */}
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, status: !prev.status }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                formData.status ? "bg-green-600" : "bg-slate-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.status ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg font-bold text-black hover:bg-slate-100 transition-all"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.bannerType || (!formData.image && !imagePreview)}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-2.5 rounded-lg font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Upload size={16} />
                  {isEdit ? 'Update Banner' : 'Save Banner'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}