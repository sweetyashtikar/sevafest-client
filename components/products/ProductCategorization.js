'use client';

import { INDICATOR_TYPES } from '@/components/products/productTypes';
import { useState } from 'react';

export default function ProductCategorization({ formData, updateFormData }) {
  const [tagInput, setTagInput] = useState('');
  const [categories, setCategories] = useState([]); // Would fetch from API

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData(name, value);
  };

  const handleTagAdd = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim().toLowerCase())) {
      updateFormData('tags', [...formData.tags, tagInput.trim().toLowerCase()]);
      setTagInput('');
    }
  };

  const handleTagRemove = (tagToRemove) => {
    updateFormData('tags', formData.tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Categorization & Classification</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          >
            <option value="">Select Category</option>
            {/* Populate with categories from API */}
            <option value="cat1">Category 1</option>
            <option value="cat2">Category 2</option>
          </select>
        </div>

        {/* Brand */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Brand
          </label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            placeholder="Brand name"
          />
        </div>

        {/* HSN Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            HSN Code
          </label>
          <input
            type="text"
            name="hsnCode"
            value={formData.hsnCode}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase text-gray-900"
            placeholder="Enter HSN code"
          />
        </div>

        {/* Made In */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Made In
          </label>
          <input
            type="text"
            name="madeIn"
            value={formData.madeIn}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            placeholder="Country of origin"
          />
        </div>

        {/* Indicator */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Food Indicator
          </label>
          <select
            name="indicator"
            value={formData.indicator}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          >
            <option value={INDICATOR_TYPES.NONE}>None</option>
            <option value={INDICATOR_TYPES.VEG}>Vegetarian</option>
            <option value={INDICATOR_TYPES.NON_VEG}>Non-Vegetarian</option>
          </select>
        </div>

        {/* Tags */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleTagAdd())}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              placeholder="Add a tag and press Enter"
            />
            <button
              type="button"
              onClick={handleTagAdd}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags.map(tag => (
              <span key={tag} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 text-gray-900">
                {tag}
                <button
                  type="button"
                  onClick={() => handleTagRemove(tag)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Attribute Values (for variable products) */}
        {formData.productType === 'variable' && (
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Attribute Values
            </label>
            <div className="space-y-2">
              {/* Would fetch and select from existing attributes */}
              <p className="text-sm text-gray-500">Select attributes for variable products</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}