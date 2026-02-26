'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { apiClient } from "@/services/apiClient";

export default function CategoryFormPage() {
  const router = useRouter();
  const { id } = useParams(); // URL madhun ID ghenyasathi (e.g. /category/edit/[id])

  const [formData, setFormData] = useState({
    name: '',
    sub_category: [],
    image: null, 
    banner: null,
    row_order: 0,
    status: true
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newSubCategory, setNewSubCategory] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);

  // Jar URL madhe ID asel tar data fetch karel (Edit Mode sathi)
  useEffect(() => {
    if (id && id !== 'new') {
      const fetchCategoryData = async () => {
        try {
          const res = await apiClient(`/category/${id}`);
          if (res?.success) {
            const category = res.data;
            setFormData({
              name: category.name || '',
              sub_category: category.sub_category || [],
              image: category.image || '',
              banner: category.banner || '',
              row_order: category.row_order || 0,
              status: category.status || 'true'
            });
            setImagePreview(category.image || null);
            setBannerPreview(category.banner || null);
          }
        } catch (err) {
          setError("Failed to fetch category details");
        }
      };
      fetchCategoryData();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSubCategory = () => {
    if (newSubCategory.trim() && !formData.sub_category.includes(newSubCategory.trim())) {
      setFormData(prev => ({
        ...prev,
        sub_category: [...prev.sub_category, newSubCategory.trim()]
      }));
      setNewSubCategory('');
    }
  };

  const handleRemoveSubCategory = (index) => {
    setFormData(prev => ({
      ...prev,
      sub_category: prev.sub_category.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      setFormData(prev => ({ ...prev, [type]: file }));
      const previewUrl = URL.createObjectURL(file);
      if (type === 'image') {
        setImagePreview(previewUrl);
      } else {
        setBannerPreview(previewUrl);
      }
      setError('');
    }
  };

  const handleRemoveImage = (type) => {
    setFormData(prev => ({ ...prev, [type]: null }));
    if (type === 'image') {
      setImagePreview(null);
    } else {
      setBannerPreview(null);
    }
    const input = document.getElementById(`${type === 'image' ? 'category-image' : 'banner-image'}-upload`);
    if (input) input.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('row_order', formData.row_order);
      submitData.append('status', formData.status);
      
      formData.sub_category.forEach((subCat, index) => {
        submitData.append(`sub_category[${index}]`, subCat);
      });
      
      if (formData.image instanceof File) {
        submitData.append('image', formData.image);
      } else if (typeof formData.image === 'string' && formData.image) {
        submitData.append('existing_image', formData.image);
      }
      
      if (formData.banner instanceof File) {
        submitData.append('banner', formData.banner);
      } else if (typeof formData.banner === 'string' && formData.banner) {
        submitData.append('existing_banner', formData.banner);
      }

      // API Call
      const url = id && id !== 'new' ? `/category/${id}` : '/category';
      const method = id && id !== 'new' ? 'PUT' : 'POST';
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
          method,
          body: submitData
      });
      const result = await res.json();

      if (result.success) {
        router.push('/admin/categories'); // Redirect to category list
      } else {
        setError(result.error || result.message);
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = () => {
    if (!formData.name) return '';
    return formData.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  };

  return (
<div className="p-6 bg-gray-100 min-h-screen -ml-12">

  {/* CARD */}
  <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-6">

    {/* HEADER */}
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-gray-900">
        {id && id !== 'new' ? 'Edit Category' : 'Create New Category'}
      </h2>

      <button
        onClick={() => router.back()}
        className="text-gray-400 hover:text-gray-500"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    {error && (
      <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-600">{error}</p>
      </div>
    )}

    {/* FORM */}
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* ===== BASIC ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* NAME */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category Name *
          </label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-900"
            placeholder="e.g., Electronics, Fashion"
          />
        </div>

        {/* SLUG */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL Slug
          </label>

          <div className="flex">
            <span className="inline-flex items-center px-3 py-2 rounded-l-md border border-r-0 border-gray-700 bg-gray-50 text-gray-500 text-sm">
              /categories/
            </span>

            <div className="flex-1 px-3 py-2 border border-gray-700 rounded-r-md bg-gray-50">
              <span className="text-gray-700">{generateSlug()}</span>
            </div>
          </div>
        </div>

        {/* ORDER */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Display Order
          </label>

          <input
            type="number"
            name="row_order"
            value={formData.row_order}
            onChange={handleChange}
            min="0"
            className="w-full px-3 py-2 border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-900"
          />
        </div>

        {/* STATUS */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-900"
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>
      </div>

      {/* ===== SUB CATEGORY ===== */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Sub-Categories</h3>

        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={newSubCategory}
            onChange={(e) => setNewSubCategory(e.target.value)}
            onKeyPress={(e) =>
              e.key === 'Enter' && (e.preventDefault(), handleAddSubCategory())
            }
            className="flex-1 px-3 py-2 border border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 text-gray-900"
            placeholder="Add a sub-category"
          />

          <button
            type="button"
            onClick={handleAddSubCategory}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Add
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {formData.sub_category.map((subCat, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
            >
              {subCat}

              <button
                type="button"
                onClick={() => handleRemoveSubCategory(index)}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* ===== IMAGES ===== */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Images</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* CATEGORY IMAGE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Image
            </label>
<input
  type="file"
  accept="image/*"
  onChange={(e) => handleImageUpload(e, 'image')}
  className="w-full px-3 py-2 border border-gray-700 rounded-md text-gray-700 file:mr-4 file:px-4 file:py-2 file:border-0 file:rounded-md file:bg-blue-600 file:text-white hover:file:bg-blue-700"
/>

            {(imagePreview || formData.image) && (
              <img
                src={imagePreview || formData.image}
                className="mt-2 h-20 w-20 object-cover rounded border"
              />
            )}
          </div>

          {/* BANNER IMAGE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Banner Image
            </label>

          <input
  type="file"
  accept="image/*"
  onChange={(e) => handleImageUpload(e, 'banner')}
  className="w-full px-3 py-2 border border-gray-700 rounded-md text-gray-700 file:mr-4 file:px-4 file:py-2 file:border-0 file:rounded-md file:bg-blue-600 file:text-white hover:file:bg-blue-700"
/>

            {(bannerPreview || formData.banner) && (
              <img
                src={bannerPreview || formData.banner}
                className="mt-2 h-20 w-full object-cover rounded border"
              />
            )}
          </div>
        </div>
      </div>

      {/* ===== BUTTONS ===== */}
      <div className="border-t border-gray-200 pt-6 flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-700 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading
            ? 'Saving...'
            : id && id !== 'new'
              ? 'Update Category'
              : 'Create Category'}
        </button>
      </div>

    </form>
  </div>
</div>  );
}