'use client';

import { useState ,useRef} from 'react';
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
     variant_images_previews: [], // This will store preview URLs
    variant_isActive: true
  });

  const fileInputRefs = useRef({});


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

   // Handle variant images upload (for new variant form)
  const handleNewVariantImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Validate all files
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image file. Skipping.`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert(`${file.name} is too large (max 5MB). Skipping.`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // Store File objects
    const currentFiles = newVariant.variant_images || [];
    const updatedFiles = [...currentFiles, ...validFiles];
    
    // Create preview URLs
    const currentPreviews = newVariant.variant_images_previews || [];
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    const updatedPreviews = [...currentPreviews, ...newPreviews];

    setNewVariant(prev => ({
      ...prev,
      variant_images: updatedFiles,
      variant_images_previews: updatedPreviews
    }));

    // Clear the input
    e.target.value = '';
  };


    // Handle variant images upload (for existing variants)
  const handleExistingVariantImagesChange = (e, variantIndex) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Validate all files
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image file. Skipping.`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert(`${file.name} is too large (max 5MB). Skipping.`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    const updatedVariants = [...formData.variants];
    const variant = updatedVariants[variantIndex];

    // Store File objects
    const currentFiles = variant.variant_images || [];
    const updatedFiles = [...currentFiles, ...validFiles];
    
    // Create preview URLs
    const currentPreviews = variant.variant_images_previews || [];
    const newPreviews = validFiles.map(file => URL.createObjectURL(file));
    const updatedPreviews = [...currentPreviews, ...newPreviews];

    updatedVariants[variantIndex] = {
      ...variant,
      variant_images: updatedFiles,
      variant_images_previews: updatedPreviews
    };

    updateFormData('variants', updatedVariants);

    // Clear the input
    e.target.value = '';
  };

  // Remove image from new variant
  const removeNewVariantImage = (imageIndex) => {
    setNewVariant(prev => {
      const updatedImages = prev.variant_images.filter((_, i) => i !== imageIndex);
      const updatedPreviews = prev.variant_images_previews.filter((_, i) => i !== imageIndex);
      
      // Clean up the removed preview URL to prevent memory leaks
      URL.revokeObjectURL(prev.variant_images_previews[imageIndex]);
      
      return {
        ...prev,
        variant_images: updatedImages,
        variant_images_previews: updatedPreviews
      };
    });
  };

  const removeImage = (variantIndex, imageIndex, isNewVariant = false) => {
    if (isNewVariant) {
      setNewVariant(prev => ({
        ...prev,
        variant_images: prev.variant_images.filter((_, i) => i !== imageIndex)
      }));
    } else {
      const updatedVariants = [...formData.variants];
      updatedVariants[variantIndex].variant_images = 
        updatedVariants[variantIndex].variant_images.filter((_, i) => i !== imageIndex);
      updateFormData('variants', updatedVariants);
    }
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

    updateFormData('variants', [...formData.variants, 
      { ...newVariant, 
        _id: Date.now().toString(),
        variant_images: newVariant.variant_images || [] ,
         variant_images_previews: newVariant.variant_images_previews || []
       }]);

        // Reset new variant form
    // Clean up preview URLs
    if (newVariant.variant_images_previews) {
      newVariant.variant_images_previews.forEach(url => URL.revokeObjectURL(url));
    }

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
      variant_images_previews: [],
      variant_isActive: true
    });
  };

   const removeVariant = (index) => {
    // Clean up preview URLs before removing
    const variant = formData.variants[index];
    if (variant.variant_images_previews) {
      variant.variant_images_previews.forEach(url => URL.revokeObjectURL(url));
    }
    
    const updatedVariants = formData.variants.filter((_, i) => i !== index);
    updateFormData('variants', updatedVariants);
  };

    // Remove image from existing variant
  const removeExistingVariantImage = (variantIndex, imageIndex) => {
    const updatedVariants = [...formData.variants];
    const variant = updatedVariants[variantIndex];
    
    // Clean up the removed preview URL
    if (variant.variant_images_previews?.[imageIndex]) {
      URL.revokeObjectURL(variant.variant_images_previews[imageIndex]);
    }
    
    const updatedImages = variant.variant_images.filter((_, i) => i !== imageIndex);
    const updatedPreviews = variant.variant_images_previews.filter((_, i) => i !== imageIndex);
    
    updatedVariants[variantIndex] = {
      ...variant,
      variant_images: updatedImages,
      variant_images_previews: updatedPreviews
    };
    
    updateFormData('variants', updatedVariants);
  };

    // Trigger file input click for new variant
  const triggerNewVariantFileInput = () => {
    if (fileInputRefs.current['new']) {
      fileInputRefs.current['new'].click();
    }
  };

  // Trigger file input click for existing variant
  const triggerExistingVariantFileInput = (variantIndex) => {
    if (fileInputRefs.current[variantIndex]) {
      fileInputRefs.current[variantIndex].click();
    }
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

         {/* Image Upload for New Variant - Following ProductMedia pattern */}
        <div className="mt-6 p-4 border border-gray-200 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-md font-medium text-gray-700">Variant Images</h4>
            <span className="text-sm text-gray-500">
              {newVariant.variant_images?.length || 0} image(s) selected
            </span>
          </div>

          <div className="mb-4">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleNewVariantImagesChange}
              className="hidden"
              ref={el => fileInputRefs.current['new'] = el}
            />
            <button
              type="button"
              onClick={triggerNewVariantFileInput}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <svg className="mr-2 -ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Select Images
            </button>
            <p className="text-sm text-gray-500 mt-2">
              You can select multiple images at once. Max 5MB per image.
            </p>
          </div>

          {/* Image Preview Grid for New Variant */}
          {newVariant.variant_images_previews?.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {newVariant.variant_images_previews.map((previewUrl, idx) => (
                <div key={idx} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden border border-gray-300">
                    <img
                      src={previewUrl}
                      alt={`Variant preview ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={() => removeNewVariantImage(idx)}
                        className="p-2 bg-white rounded-full hover:bg-gray-100"
                        title="Remove image"
                      >
                        <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="absolute top-1 left-1 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                    {idx + 1}
                  </div>
                </div>
              ))}
            </div>
          )}
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
          <div className="space-y-6">
            {formData.variants.map((variant, index) => (
              <div key={variant._id || index} className="border border-gray-200 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Variant Name</label>
                    <input
                      type="text"
                      name="variant_name"
                      value={variant.variant_name}
                      onChange={(e) => handleVariantChange(e, index)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Regular Price</label>
                    <input
                      type="number"
                      name="variant_price"
                      value={variant.variant_price}
                      onChange={(e) => handleVariantChange(e, index)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Special Price</label>
                    <input
                      type="number"
                      name="variant_specialPrice"
                      value={variant.variant_specialPrice}
                      onChange={(e) => handleVariantChange(e, index)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                    <input
                      type="text"
                      name="variant_sku"
                      value={variant.variant_sku}
                      onChange={(e) => handleVariantChange(e, index)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md uppercase"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                    <input
                      type="number"
                      name="variant_totalStock"
                      value={variant.variant_totalStock}
                      onChange={(e) => handleVariantChange(e, index)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock Status</label>
                    <select
                      name="variant_stockStatus"
                      value={variant.variant_stockStatus}
                      onChange={(e) => handleVariantChange(e, index)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value={STOCK_STATUS.IN_STOCK}>In Stock</option>
                      <option value={STOCK_STATUS.OUT_OF_STOCK}>Out of Stock</option>
                    </select>
                  </div>
                </div>

                {/* Image Upload for Existing Variant - Following ProductMedia pattern */}
                <div className="mt-4 p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-md font-medium text-gray-700">Variant Images</h4>
                    <span className="text-sm text-gray-500">
                      {variant.variant_images?.length || 0} image(s) uploaded
                    </span>
                  </div>

                  <div className="mb-4">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleExistingVariantImagesChange(e, index)}
                      className="hidden"
                      ref={el => fileInputRefs.current[index] = el}
                    />
                    <button
                      type="button"
                      onClick={() => triggerExistingVariantFileInput(index)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <svg className="mr-2 -ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                      Add More Images
                    </button>
                    <p className="text-sm text-gray-500 mt-2">
                      You can select multiple images at once. Max 5MB per image.
                    </p>
                  </div>

                  {/* Image Preview Grid */}
                  {variant.variant_images_previews?.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {variant.variant_images_previews.map((previewUrl, imgIdx) => (
                        <div key={imgIdx} className="relative group">
                          <div className="aspect-square rounded-lg overflow-hidden border border-gray-300">
                            <img
                              src={previewUrl}
                              alt={`Variant ${index + 1} image ${imgIdx + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <button
                                type="button"
                                onClick={() => removeExistingVariantImage(index, imgIdx)}
                                className="p-2 bg-white rounded-full hover:bg-gray-100"
                                title="Remove image"
                              >
                                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                          <div className="absolute top-1 left-1 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                            {imgIdx + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Remove Variant
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}