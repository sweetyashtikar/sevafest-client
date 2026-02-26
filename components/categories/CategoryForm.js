'use client';

import { useState, useEffect } from 'react';

export default function CategoryForm({ category, onSubmit, onCancel }) {
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

  // Initialize form with category data if editing
  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        sub_category: category.sub_category || [],
        image: category.image || '',
        banner: category.banner || '',
        row_order: category.row_order || 0,
        status: category.status || 'true'
      });
       // Set previews if editing
      setImagePreview(category.image || null);
      setBannerPreview(category.banner || null);
    }
  }, [category]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle sub-category addition
  const handleAddSubCategory = () => {
    if (newSubCategory.trim() && !formData.sub_category.includes(newSubCategory.trim())) {
      setFormData(prev => ({
        ...prev,
        sub_category: [...prev.sub_category, newSubCategory.trim()]
      }));
      setNewSubCategory('');
    }
  };

  // Handle sub-category removal
  const handleRemoveSubCategory = (index) => {
    setFormData(prev => ({
      ...prev,
      sub_category: prev.sub_category.filter((_, i) => i !== index)
    }));
  };

 // Fixed image upload handler
  const handleImageUpload = (e, type) => {
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

      // Update form data with file
      setFormData(prev => ({
        ...prev,
        [type]: file
      }));

      // Create preview
      const previewUrl = URL.createObjectURL(file);
      if (type === 'image') {
        setImagePreview(previewUrl);
      } else {
        setBannerPreview(previewUrl);
      }
      
      // Clear error
      setError('');
    }
  };

   // Fixed remove image handler
  const handleRemoveImage = (type) => {
    setFormData(prev => ({
      ...prev,
      [type]: null
    }));
    
    if (type === 'image') {
      setImagePreview(null);
    } else {
      setBannerPreview(null);
    }
    
    // Reset file input
    const input = document.getElementById(`${type === 'image' ? 'category-image' : 'banner-image'}-upload`);
    if (input) input.value = '';
  };


  // Handle form submission
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Create FormData for file upload
      const submitData = new FormData();
      
      // Append all form fields
      submitData.append('name', formData.name);
      submitData.append('row_order', formData.row_order);
      submitData.append('status', formData.status);
      
      // Append sub_category array
      formData.sub_category.forEach((subCat, index) => {
        submitData.append(`sub_category[${index}]`, subCat);
      });
      
      // Append files if they exist
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

      const result = await onSubmit(submitData);
      if (!result.success) {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };


 // Generate slug from name
  const generateSlug = () => {
    if (!formData.name) return '';
    return formData.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {category ? 'Edit Category' : 'Create New Category'}
        </h2>
        <button
          onClick={onCancel}
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category Name */}
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
              className="w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              placeholder="e.g., Electronics, Fashion, Home & Kitchen"
            />
          </div>

          {/* Auto-generated Slug Preview */}
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
            <p className="text-sm text-gray-500 mt-2">
              This slug will be auto-generated from the category name
            </p>
          </div>

          {/* Row Order */}
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
              className="w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            />
            <p className="text-sm text-gray-500 mt-2">
              Lower numbers appear first
            </p>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>

        {/* Sub-Categories */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Sub-Categories</h3>

          <div className="mb-4">
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newSubCategory}
                onChange={(e) => setNewSubCategory(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSubCategory())}
                className="flex-1 px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
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

            {/* Sub-categories list */}
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
              {formData.sub_category.length === 0 && (
                <p className="text-gray-500 text-sm">No sub-categories added yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Images</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Image
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'image')}
                  className="hidden"
                  id="category-image-upload"
                />
                <label
                  htmlFor="category-image-upload"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
                >
                  Choose Image
                </label>
                 {(formData.image || imagePreview) && (
                  <span className="text-sm text-gray-600">
                    {formData.image instanceof File ? formData.image.name : 'Image selected'}
                  </span>
                )}
              </div>
              {(imagePreview || formData.image) && (
                <div className="mt-2">
                  <img
                    src={imagePreview || (typeof formData.image === 'string' ? formData.image : '')}
                    alt="Preview"
                    className="h-20 w-20 object-cover rounded border border-gray-200"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/80?text=Error';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage('image')}
                    className="mt-2 text-sm text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Banner Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Banner Image
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'banner')}
                  className="hidden"
                  id="banner-image-upload"
                />
                <label
                  htmlFor="banner-image-upload"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
                >
                  Choose Image
                </label>
                 {(formData.banner || bannerPreview) && (
                  <span className="text-sm text-gray-600">
                    {formData.banner instanceof File ? formData.banner.name : 'Image selected'}
                  </span>
                )}
              </div>
            {(bannerPreview || formData.banner) && (
                <div className="mt-2">
                  <img
                    src={bannerPreview || (typeof formData.banner === 'string' ? formData.banner : '')}
                    alt="Banner Preview"
                    className="h-20 w-full object-cover rounded border border-gray-200"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x80?text=Error';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage('banner')}
                    className="mt-2 text-sm text-red-600 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-500">
            <p>Image Guidelines:</p>
            <ul className="list-disc pl-5 mt-1">
              <li>Category Image: Square image, 300x300 pixels recommended</li>
              <li>Banner Image: Wide image, 1200x300 pixels recommended</li>
              <li>Use high-quality, relevant images</li>
              <li>Supported formats: JPG, PNG, WebP</li>
              <li>Maximum file size: 5MB</li>
            </ul>
          </div>
        </div>

        {/* Form Actions */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-700 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
                </span>
              ) : (
                category ? 'Update Category' : 'Create Category'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}