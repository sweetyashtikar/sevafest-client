'use client';

import { useState } from 'react';
import ProductBasicInfo from '@/components/products/ProductBasicInfo';
import ProductCategorization from '@/components/products/ProductCategorization';
import ProductPricing from '@/components/products/ProductPricing';
import ProductInventory from '@/components/products/ProductInventory';
import ProductShipping from '@/components/products/ProductShipping';
import ProductPolicies from '@/components/products/ProductPolicies';
import ProductMedia from '@/components/products/ProductMedia';
import ProductDigital from '@/components/products/ProductDigital';
import ProductSEO from '@/components/products/ProductSEO';
import ProductVariants from '@/components/products/ProductVariants';
import { PRODUCT_TYPES } from '@/components/products/productTypes';
import { apiClient } from '@/services/apiClient';
import { useSelector } from 'react-redux';

export default function AddProductPage() {

  const {token, user} =  useSelector((a)=> a.auth);

  console.log("Token", token)
   console.log("user", user)

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Information
    name: '',
    slug: '',
    shortDescription: '',
    description: '',
    extraDescription: '',
    
    // Categorization
    categoryId: '',
    tags: [],
    brand: '',
    hsnCode: '',
    madeIn: 'India',
    indicator: 'none',
    attributeValues: [],
    
    // Tax & Pricing
    taxId: '',
    isPricesInclusiveTax: false,
    
    // Inventory
    totalAllowedQuantity: 999999,
    minimumOrderQuantity: 1,
    quantityStepSize: 1,
    
    // Product Type & Stock
    productType: PRODUCT_TYPES.SIMPLE,
    variantStockLevelType: '',
    
    // Simple Product Data
    simpleProduct: {
      sp_price: 0,
      sp_specialPrice: 0,
      sp_sku: '',
      sp_totalStock: 0,
      sp_stockStatus: null
    },
    
    // Variable Product Data
    variants: [],
    productLevelStock: {
      pls_sku: '',
      pls_totalStock: 0,
      pls_stockStatus: null
    },
    
    // Shipping & Logistics
    deliverableType: 'none',
    deliverableZipcodes: [],
    dimensions: {
      weight: 0,
      height: 0,
      breadth: 0,
      length: 0
    },
    
    // Policies
    codAllowed: false,
    isReturnable: false,
    isCancelable: false,
    cancelableTill: 'not_returnable',
    warrantyPeriod: '',
    guaranteePeriod: '',
    
    // Media
    mainImage: '',
    otherImages: [],
    video: {
      videoType: '',
      url: '',
      file: ''
    },
    
    // Digital Product
    downloadAllowed: false,
    downloadLinkType: '',
    downloadFile: '',
    downloadLink: '',
    
    // SEO
    seo: {
      metaTitle: '',
      metaDescription: '',
      metaKeywords: []
    },
    
    // Status
    status: true
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiClient('/product', {
        method: 'POST',
        body: formData,
      });

      console.log("create product resposne", response)

      if (!response.ok) {
        throw new Error(response.message || 'Failed to create product');
      }

      // Redirect to product list or show success message
      alert('Product created successfully!');
      // router.push('/products');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <ProductBasicInfo formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <ProductCategorization formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <ProductPricing formData={formData} updateFormData={updateFormData} />;
      case 4:
        return <ProductInventory formData={formData} updateFormData={updateFormData} />;
      case 5:
        return formData.productType === PRODUCT_TYPES.VARIABLE ? 
          <ProductVariants formData={formData} updateFormData={updateFormData} /> :
          <ProductShipping formData={formData} updateFormData={updateFormData} />;
      case 6:
        return <ProductPolicies formData={formData} updateFormData={updateFormData} />;
      case 7:
        return <ProductMedia formData={formData} updateFormData={updateFormData} />;
      case 8:
        return formData.productType === PRODUCT_TYPES.DIGITAL ? 
          <ProductDigital formData={formData} updateFormData={updateFormData} /> : 
          <ProductSEO formData={formData} updateFormData={updateFormData} />;
      case 9:
        return <ProductSEO formData={formData} updateFormData={updateFormData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-gray-600 mt-2">Fill in all required fields to create a new product</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((stepNum) => (
              <div key={stepNum} className={`flex-1 h-2 mx-1 rounded-full ${step >= stepNum ? 'bg-blue-600' : 'bg-gray-200'}`} />
            ))}
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Basic Info</span>
            <span>Categorization</span>
            <span>Pricing</span>
            <span>Inventory</span>
            <span>{formData.productType === PRODUCT_TYPES.VARIABLE ? 'Variants' : 'Shipping'}</span>
            <span>Policies</span>
            <span>Media</span>
            <span>{formData.productType === PRODUCT_TYPES.DIGITAL ? 'Digital' : 'SEO'}</span>
            <span>SEO/Review</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {renderStep()}

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between">
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Back
              </button>
            )}
            
            {step < 9 ? (
              <button
                type="button"
                onClick={handleNext}
                className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="ml-auto px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Product'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}