'use client';

import { useState } from 'react';
import { STOCK_STATUS } from '@/components/products/productTypes';

export default function ProductVariants({ formData, updateFormData }) {
  const [newVariant, setNewVariant] = useState({
    variant_name: '',
    variant_price: 0,
    variant_specialPrice: 0,
    variant_sku: '',
    variant_totalStock: 0,
    variant_stockStatus: STOCK_STATUS.IN_STOCK,
    variant_weight: 0,
    variant_height: 0,
    variant_breadth: 0,
    variant_length: 0,
    variant_images: [],
    variant_isActive: true
  });

  const handleVariantChange = (e, index) => {
    const { name, value } = e.target;
    const updatedVariants = [...formData.variants];
    updatedVariants[index] = {
      ...updatedVariants[index],
      [name]: name.includes('Price') || name.includes('Stock') || name.includes('weight') || name.includes('height') || name.includes('breadth') || name.includes('length') 
        ? parseFloat(value) || 0 
        : value
    };
    updateFormData('variants', updatedVariants);
  };

  const handleNewVariantChange = (e) => {
    const { name, value } = e.target;
    setNewVariant(prev => ({
      ...prev,
      [name]: name.includes('Price') || name.includes('Stock') || name.includes('weight') || name.includes('height') || name.includes('breadth') || name.includes('length') 
        ? parseFloat(value) || 0 
        : value
    }));
  };

  const addVariant = () => {
    if (!newVariant.variant_name.trim()) {
      alert('Variant name is required');
      return;
    }
    if (newVariant.variant_price <= 0) {
      alert('Variant price must be greater than 0');
      return;
    }
    if (newVariant.variant_specialPrice >= newVariant.variant_price) {
      alert('Special price must be less than regular price');
      return;
    }

    updateFormData('variants', [...formData.variants, { ...newVariant, _id: Date.now().toString() }]);
    setNewVariant({
      variant_name: '',
      variant_price: 0,
      variant_specialPrice: 0,
      variant_sku: '',
      variant_totalStock: 0,
      variant_stockStatus: STOCK_STATUS.IN_STOCK,
      variant_weight: 0,
      variant_height: 0,
      variant_breadth: 0,
      variant_length: 0,
      variant_images: [],
      variant_isActive: true
    });
  };

  const removeVariant = (index) => {
    const updatedVariants = formData.variants.filter((_, i) => i !== index);
    updateFormData('variants', updatedVariants);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Product Variants</h2>
      
      <div className="mb-8 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Add New Variant</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Variant Name *
            </label>
            <input
              type="text"
              name="variant_name"
              value={newVariant.variant_name}
              onChange={handleNewVariantChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Large, Red"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Regular Price *
            </label>
            <input
              type="number"
              name="variant_price"
              value={newVariant.variant_price}
              onChange={handleNewVariantChange}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Special Price
            </label>
            <input
              type="number"
              name="variant_specialPrice"
              value={newVariant.variant_specialPrice}
              onChange={handleNewVariantChange}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SKU
            </label>
            <input
              type="text"
              name="variant_sku"
              value={newVariant.variant_sku}
              onChange={handleNewVariantChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
              placeholder="Variant SKU"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock Quantity
            </label>
            <input
              type="number"
              name="variant_totalStock"
              value={newVariant.variant_totalStock}
              onChange={handleNewVariantChange}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock Status
            </label>
            <select
              name="variant_stockStatus"
              value={newVariant.variant_stockStatus}
              onChange={handleNewVariantChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={STOCK_STATUS.IN_STOCK}>In Stock</option>
              <option value={STOCK_STATUS.OUT_OF_STOCK}>Out of Stock</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <button
            type="button"
            onClick={addVariant}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add Variant
          </button>
        </div>
      </div>

      {/* Existing Variants */}
      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-4">Existing Variants ({formData.variants.length})</h3>
        
        {formData.variants.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No variants added yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variant</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Special Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {formData.variants.map((variant, index) => (
                  <tr key={variant._id || index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        name="variant_name"
                        value={variant.variant_name}
                        onChange={(e) => handleVariantChange(e, index)}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        name="variant_price"
                        value={variant.variant_price}
                        onChange={(e) => handleVariantChange(e, index)}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        name="variant_specialPrice"
                        value={variant.variant_specialPrice}
                        onChange={(e) => handleVariantChange(e, index)}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        name="variant_sku"
                        value={variant.variant_sku}
                        onChange={(e) => handleVariantChange(e, index)}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 uppercase"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="number"
                        name="variant_totalStock"
                        value={variant.variant_totalStock}
                        onChange={(e) => handleVariantChange(e, index)}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        name="variant_stockStatus"
                        value={variant.variant_stockStatus}
                        onChange={(e) => handleVariantChange(e, index)}
                        className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value={STOCK_STATUS.IN_STOCK}>In Stock</option>
                        <option value={STOCK_STATUS.OUT_OF_STOCK}>Out of Stock</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => removeVariant(index)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}