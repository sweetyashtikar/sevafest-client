'use client';

import { DELIVERABLE_TYPES } from '@/components/products/productTypes';
import { useState } from 'react';

export default function ProductShipping({ formData, updateFormData }) {
  const [zipcodeInput, setZipcodeInput] = useState('');
  const [deliveryZones, setDeliveryZones] = useState([]); // Would fetch from API

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    updateFormData(name, type === 'checkbox' ? checked : value);
  };

  const handleDimensionsChange = (e) => {
    const { name, value } = e.target;
    updateFormData('dimensions', {
      ...formData.dimensions,
      [name]: parseFloat(value) || 0
    });
  };

  const handleZipcodeAdd = () => {
    const zipcode = zipcodeInput.trim();
    if (zipcode && !formData.deliverableZipcodes.includes(zipcode)) {
      updateFormData('deliverableZipcodes', [...formData.deliverableZipcodes, zipcode]);
      setZipcodeInput('');
    }
  };

  const handleZipcodeRemove = (zipcodeToRemove) => {
    updateFormData('deliverableZipcodes', 
      formData.deliverableZipcodes.filter(zipcode => zipcode !== zipcodeToRemove)
    );
  };

  // Auto-calculate volumetric weight
  const calculateVolumetricWeight = () => {
    const { length = 0, breadth = 0, height = 0 } = formData.dimensions;
    if (length && breadth && height) {
      return (length * breadth * height) / 5000; // Common formula
    }
    return 0;
  };

  const volumetricWeight = calculateVolumetricWeight();
  const actualWeight = formData.dimensions.weight || 0;
  const chargeableWeight = Math.max(actualWeight, volumetricWeight);

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Shipping & Logistics</h2>
      
      <div className="space-y-8">
        {/* Delivery Type */}
        <div className="p-6 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Delivery Settings</h3>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Where can this product be delivered? *
            </label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* None */}
              <button
                type="button"
                onClick={() => updateFormData('deliverableType', DELIVERABLE_TYPES.NONE)}
                className={`p-4 border rounded-lg text-left transition-colors ${
                  formData.deliverableType === DELIVERABLE_TYPES.NONE
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full border mr-3 ${
                    formData.deliverableType === DELIVERABLE_TYPES.NONE
                      ? 'border-red-500 bg-red-500'
                      : 'border-gray-400'
                  }`} />
                  <div>
                    <p className="font-medium text-gray-900">No Delivery</p>
                    <p className="text-sm text-gray-500 mt-1">Pickup only / Digital product</p>
                  </div>
                </div>
              </button>

              {/* All */}
              <button
                type="button"
                onClick={() => updateFormData('deliverableType', DELIVERABLE_TYPES.ALL)}
                className={`p-4 border rounded-lg text-left transition-colors ${
                  formData.deliverableType === DELIVERABLE_TYPES.ALL
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full border mr-3 ${
                    formData.deliverableType === DELIVERABLE_TYPES.ALL
                      ? 'border-green-500 bg-green-500'
                      : 'border-gray-400'
                  }`} />
                  <div>
                    <p className="font-medium text-gray-900">All Locations</p>
                    <p className="text-sm text-gray-500 mt-1">Deliver everywhere we service</p>
                  </div>
                </div>
              </button>

              {/* Include */}
              <button
                type="button"
                onClick={() => updateFormData('deliverableType', DELIVERABLE_TYPES.INCLUDE)}
                className={`p-4 border rounded-lg text-left transition-colors ${
                  formData.deliverableType === DELIVERABLE_TYPES.INCLUDE
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full border mr-3 ${
                    formData.deliverableType === DELIVERABLE_TYPES.INCLUDE
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-400'
                  }`} />
                  <div>
                    <p className="font-medium text-gray-900">Specific Areas Only</p>
                    <p className="text-sm text-gray-500 mt-1">Choose zipcodes where delivery is available</p>
                  </div>
                </div>
              </button>

              {/* Exclude */}
              <button
                type="button"
                onClick={() => updateFormData('deliverableType', DELIVERABLE_TYPES.EXCLUDE)}
                className={`p-4 border rounded-lg text-left transition-colors ${
                  formData.deliverableType === DELIVERABLE_TYPES.EXCLUDE
                    ? 'border-yellow-500 bg-yellow-50'
                    : 'border-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full border mr-3 ${
                    formData.deliverableType === DELIVERABLE_TYPES.EXCLUDE
                      ? 'border-yellow-500 bg-yellow-500'
                      : 'border-gray-400'
                  }`} />
                  <div>
                    <p className="font-medium text-gray-900">Exclude Areas</p>
                    <p className="text-sm text-gray-500 mt-1">Deliver everywhere except selected zipcodes</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Zipcode Management for Include/Exclude */}
          {(formData.deliverableType === DELIVERABLE_TYPES.INCLUDE || 
            formData.deliverableType === DELIVERABLE_TYPES.EXCLUDE) && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium text-gray-700">
                  {formData.deliverableType === DELIVERABLE_TYPES.INCLUDE 
                    ? 'Include Zipcodes' 
                    : 'Exclude Zipcodes'}
                </h4>
                <span className="text-sm text-gray-500">
                  {formData.deliverableZipcodes.length} zipcode(s) added
                </span>
              </div>

              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={zipcodeInput}
                  onChange={(e) => setZipcodeInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleZipcodeAdd())}
                  className="flex-1 px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter zipcode (e.g., 400001)"
                  maxLength="6"
                  pattern="[0-9]*"
                />
                <button
                  type="button"
                  onClick={handleZipcodeAdd}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => {
                    // Bulk add example zipcodes
                    updateFormData('deliverableZipcodes', [
                      ...formData.deliverableZipcodes,
                      '400001', '400002', '400003', '400004'
                    ]);
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Add Sample
                </button>
              </div>

              {/* Zipcodes Display */}
              <div className="flex flex-wrap gap-2 mb-4">
                {formData.deliverableZipcodes.map(zipcode => (
                  <span key={zipcode} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                    {zipcode}
                    <button
                      type="button"
                      onClick={() => handleZipcodeRemove(zipcode)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {formData.deliverableZipcodes.length === 0 && (
                  <p className="text-gray-500 text-sm">No zipcodes added yet</p>
                )}
              </div>

              <div className="text-sm text-gray-600">
                <p className="font-medium mb-1">Tips:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Enter one zipcode at a time</li>
                  <li>Use bulk import for large lists</li>
                  <li>Verify zipcodes are in your service area</li>
                  <li>Consider using delivery zones for broader areas</li>
                </ul>
              </div>
            </div>
          )}

          {/* Delivery Type Notes */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Delivery Type Details</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              {formData.deliverableType === DELIVERABLE_TYPES.NONE && (
                <>
                  <li>• Product cannot be delivered (pickup or digital only)</li>
                  <li>• Customer must arrange pickup</li>
                  <li>• No shipping charges applied</li>
                </>
              )}
              {formData.deliverableType === DELIVERABLE_TYPES.ALL && (
                <>
                  <li>• Deliver to all locations in your service area</li>
                  <li>• Shipping charges based on weight/dimensions</li>
                  <li>• Most common setting for physical products</li>
                </>
              )}
              {formData.deliverableType === DELIVERABLE_TYPES.INCLUDE && (
                <>
                  <li>• Deliver ONLY to selected zipcodes</li>
                  <li>• Useful for local delivery or fragile items</li>
                  <li>• Customers outside these areas cannot order</li>
                </>
              )}
              {formData.deliverableType === DELIVERABLE_TYPES.EXCLUDE && (
                <>
                  <li>• Deliver EVERYWHERE EXCEPT selected zipcodes</li>
                  <li>• Useful for excluding remote/hard-to-reach areas</li>
                  <li>• Customers in excluded areas cannot order</li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* Product Dimensions & Weight */}
        <div className="p-6 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Dimensions & Weight</h3>
          <p className="text-sm text-gray-600 mb-6">
            Accurate measurements are crucial for shipping cost calculation
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Weight */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weight (kg) *
              </label>
              <div className="relative">
                <input
  type="number"
  name="weight"
  value={formData.dimensions.weight}
  onChange={handleDimensionsChange}
  min="0"
  step="0.01"
  className="w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md 
  focus:outline-none focus:ring-2 focus:ring-blue-500 
  text-gray-700 placeholder:text-gray-700"
  placeholder="0.00"
/>
                <span className="absolute left-3 top-2 text-gray-500">kg</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Product weight in kilograms</p>
            </div>

            {/* Length */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Length (cm) *
              </label>
              <div className="relative">
                <input
  type="number"
  name="length"
  value={formData.dimensions.length}
  onChange={handleDimensionsChange}
  min="0"
  step="0.1"
  className="w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md 
  focus:outline-none focus:ring-2 focus:ring-blue-500 
  text-gray-700 placeholder:text-gray-700"
  placeholder="0.0"
/>
                <span className="absolute left-3 top-2 text-gray-500">cm</span>
              </div>
            </div>

            {/* Breadth/Width */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Breadth/Width (cm) *
              </label>
              <div className="relative">
              <input
  type="number"
  name="breadth"
  value={formData.dimensions.breadth}
  onChange={handleDimensionsChange}
  min="0"
  step="0.1"
  className="w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md 
  focus:outline-none focus:ring-2 focus:ring-blue-500 
  text-gray-700 placeholder:text-gray-700"
  placeholder="0.0"
/>
                <span className="absolute left-3 top-2 text-gray-500">cm</span>
              </div>
            </div>

            {/* Height */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Height (cm) *
              </label>
              <div className="relative">
                <input
  type="number"
  name="height"
  value={formData.dimensions.height}
  onChange={handleDimensionsChange}
  min="0"
  step="0.1"
  className="w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md 
  focus:outline-none focus:ring-2 focus:ring-blue-500 
  text-gray-700 placeholder:text-gray-700"
  placeholder="0.0"
/>
                <span className="absolute left-3 top-2 text-gray-500">cm</span>
              </div>
            </div>
          </div>

          {/* Weight Calculation Summary */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-4">Shipping Weight Calculation</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-white border border-gray-700 rounded-md">
                <p className="text-sm text-gray-500 mb-1">Actual Weight</p>
                <p className="text-lg font-semibold text-gray-900">
                  {actualWeight.toFixed(2)} kg
                </p>
              </div>
              
              <div className="text-center p-3 bg-white border border-gray-700 rounded-md">
                <p className="text-sm text-gray-500 mb-1">Volumetric Weight</p>
                <p className="text-lg font-semibold text-gray-900">
                  {volumetricWeight.toFixed(2)} kg
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  (L×B×H ÷ 5000)
                </p>
              </div>
              
              <div className="text-center p-3 bg-yellow-50 border border-yellow-300 rounded-md">
                <p className="text-sm text-gray-700 mb-1">Chargeable Weight</p>
                <p className="text-lg font-semibold text-yellow-700">
                  {chargeableWeight.toFixed(2)} kg
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  (Higher of actual vs volumetric)
                </p>
              </div>
            </div>
            
            <div className="mt-4 text-sm text-gray-600">
              <p className="font-medium mb-1">Shipping carriers use:</p>
              <ul className="list-disc pl-5">
                <li><strong>Volumetric weight</strong> for lightweight but bulky items</li>
                <li><strong>Actual weight</strong> for dense, heavy items</li>
                <li><strong>Whichever is higher</strong> becomes the chargeable weight</li>
              </ul>
            </div>
          </div>

          {/* Dimension Guidelines */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2">Measurement Guidelines</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Measure at the longest/widest/tallest points</li>
              <li>• Include packaging in measurements</li>
              <li>• Round up to the nearest 0.5 cm</li>
              <li>• Weigh the packaged product, not just the item</li>
              <li>• Update if packaging changes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}