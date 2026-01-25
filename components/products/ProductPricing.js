'use client';

import { useState, useEffect } from 'react';

export default function ProductPricing({ formData, updateFormData }) {
  const [taxes, setTaxes] = useState([]); // Would fetch from API

  useEffect(() => {
    // Fetch taxes from API
    // fetch('/api/taxes').then(res => res.json()).then(setTaxes);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    updateFormData(name, type === 'checkbox' ? checked : value);
  };

  const handleSimpleProductChange = (e) => {
    const { name, value } = e.target;
    const field = name.replace('simpleProduct.', '');
    updateFormData('simpleProduct', {
      ...formData.simpleProduct,
      [field]: value
    });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Tax & Pricing</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tax */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tax Rate
          </label>
          <select
            name="taxId"
            value={formData.taxId}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Tax Rate</option>
            {taxes.map(tax => (
              <option key={tax._id} value={tax._id}>
                {tax.name} - {tax.amount}%
              </option>
            ))}
          </select>
        </div>

        {/* Price Inclusive Tax */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isPricesInclusiveTax"
            name="isPricesInclusiveTax"
            checked={formData.isPricesInclusiveTax}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isPricesInclusiveTax" className="ml-2 block text-sm text-gray-700">
            Prices are inclusive of tax
          </label>
        </div>

        {/* Simple/Digital Product Pricing */}
        {(formData.productType === 'simple' || formData.productType === 'digital') && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Regular Price *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">₹</span>
                <input
                  type="number"
                  name="simpleProduct.sp_price"
                  value={formData.simpleProduct.sp_price}
                  onChange={handleSimpleProductChange}
                  min="0"
                  step="0.01"
                  required
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">₹</span>
                <input
                  type="number"
                  name="simpleProduct.sp_specialPrice"
                  value={formData.simpleProduct.sp_specialPrice}
                  onChange={handleSimpleProductChange}
                  min="0"
                  step="0.01"
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>
              {formData.simpleProduct.sp_specialPrice >= formData.simpleProduct.sp_price && (
                <p className="text-sm text-red-600 mt-1">Special price must be less than regular price</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SKU(Stock Keeping Unit)
              </label>
              <input
                type="text"
                name="simpleProduct.sp_sku"
                value={formData.simpleProduct.sp_sku}
                onChange={handleSimpleProductChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                placeholder="Product SKU"
              />
            </div>
          </>
        )}

        {/* Variable Product Pricing - will be handled in variants */}
        {formData.productType === 'variable' && (
          <div className="md:col-span-2">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-yellow-800">
                Pricing for variable products will be set in the Variants section.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}