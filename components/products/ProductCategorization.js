'use client';
import { useEffect } from 'react';
import { INDICATOR_TYPES,PRODUCT_TYPES } from '@/components/products/productTypes';
import { useState } from 'react';
import { categoryApi, attributeValueApi } from '../../API/api';

export default function ProductCategorization({ formData, updateFormData }) {
  const [tagInput, setTagInput] = useState('');
  const [categories, setCategories] = useState([]); // Would fetch from API
  const [attributeValues, setAttributeValue] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
    fetchAttributeValues();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await categoryApi.getStatusTrue();
      console.log('Fetched categories:', response);
      // Assuming your API returns { success: true, data: [] }
      setCategories(response.data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const fetchAttributeValues = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await attributeValueApi.getStatusTrue();
      console.log('Fetched attribute values:', response);
      // Assuming your API returns { success: true, data: [] }
      setAttributeValue(response.data || []);
    } catch (err) {
      console.error('Error fetching attribute values:', err);
      setError(err.message || 'Failed to load attribute values');
    } finally {
      setLoading(false);
    }
  };

  // Add this handler function to your component
  const handleAttributeValuesChange = (e) => {
    const { options } = e.target;
    const selectedValues = [];

    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedValues.push(options[i].value);
      }
    }

    updateFormData('attributeValues', selectedValues);
  };



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
            disabled={loading}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 ${loading ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
          >
            <option value="">Select Category</option>

            {categories.length === 0 && !loading && (
              <option value="" disabled>No categories available</option>
            )}
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
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



        {formData.productType === PRODUCT_TYPES.VARIABLE && (
          <div className="md:col-span-2">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Attribute Values *
              </label>
              {loading && (
                <span className="text-xs text-gray-500">Loading...</span>
              )}
            </div>

            <div className="border border-gray-300 rounded-md p-3 max-h-60 overflow-y-auto">
              {attributeValues.length === 0 && !loading ? (
                <p className="text-sm text-gray-500">No attribute values available</p>
              ) : (
                <div className="space-y-2">
                  {attributeValues.map((attributeValue) => (
                    <div key={attributeValue._id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`attr-${attributeValue._id}`}
                        checked={(formData.attributeValues || []).includes(attributeValue._id)}
                        onChange={(e) => {
                          const isChecked = e.target.checked;
                          const currentValues = formData.attributeValues || [];

                          if (isChecked) {
                            updateFormData('attributeValues', [...currentValues, attributeValue._id]);
                          } else {
                            updateFormData('attributeValues', currentValues.filter(id => id !== attributeValue._id));
                          }
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor={`attr-${attributeValue._id}`}
                        className="ml-2 text-sm text-gray-900 cursor-pointer"
                      >
                        {attributeValue.attribute_id?.name || 'Attribute'}: {attributeValue.value}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Display selected attribute values as tags */}
            {formData.attributeValues && formData.attributeValues.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Selected Attributes:</p>
                <div className="flex flex-wrap gap-2">
                  {formData.attributeValues.map(attrId => {
                    const selectedAttr = attributeValues.find(attr => attr._id === attrId);
                    if (!selectedAttr) return null;

                    return (
                      <span
                        key={attrId}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                      >
                        {selectedAttr.attribute_id?.name || 'Attribute'}: {selectedAttr.value}
                        <button
                          type="button"
                          onClick={() => {
                            const updated = formData.attributeValues.filter(id => id !== attrId);
                            updateFormData('attributeValues', updated);
                          }}
                          className="ml-2 text-green-600 hover:text-green-800"
                        >
                          ×
                        </button>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}




