"use client";

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
import { PRODUCT_TYPES, VARIANT_STOCK_LEVEL_TYPES } from '@/components/products/productTypes';
import { apiClient } from '@/services/apiClient';
import {  ProductApi } from '@/components/attributes/api';


export default function AddProductPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Information
    name: "",
    slug: "",
    shortDescription: "",
    description: "",
    extraDescription: "",

    // Categorization
    categoryId: "",
    tags: [],
    brand: "",
    hsnCode: "",
    madeIn: "India",
    indicator: "none",
    attributeValues: [],

    // Tax & Pricing
    taxId: "",
    isPricesInclusiveTax: false,

    // Inventory
    totalAllowedQuantity: 999999,
    minimumOrderQuantity: 1,
    quantityStepSize: 1,

    // Product Type & Stock
    productType: PRODUCT_TYPES.SIMPLE,
    variantStockLevelType: "",

    // Simple Product Data
    simpleProduct: {
      sp_price: 0,
      sp_specialPrice: 0,
      sp_sku: "",
      sp_totalStock: 0,
      sp_stockStatus: null,
    },

    // Variable Product Data
    variants: [],
    productLevelStock: {
      pls_sku: "",
      pls_totalStock: 0,
      pls_stockStatus: null,
    },

    // Shipping & Logistics
    deliverableType: "none",
    deliverableZipcodes: [],
    dimensions: {
      weight: 0,
      height: 0,
      breadth: 0,
      length: 0,
    },

    // Policies
    codAllowed: false,
    isReturnable: false,
    isCancelable: false,
    cancelableTill: "not_returnable",
    warrantyPeriod: "",
    guaranteePeriod: "",

    // Media
    mainImage: null,
    mainImagePreview: null,
    otherImages: [],
    otherImagesPreviews: [],
    video: {
      videoType: "" || null,
      url: "" || null,
      file: "" || null,
    },

    // Digital Product
    downloadAllowed: false,
    downloadLinkType: "",
    downloadFile: "",
    downloadLink: "",

    // SEO
    seo: {
      metaTitle: "",
      metaDescription: "",
      metaKeywords: [],
    },

    // Status
    status: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateFormData = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNext = () => {
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Create FormData
      const formDataToSend = new FormData();

      // Append all simple fields
      const simpleFields = [
        "name",
        "shortDescription",
        "description",
        "extraDescription",
        "categoryId",
        "brand",
        "hsnCode",
        "madeIn",
        "indicator",
        "taxId",
        "isPricesInclusiveTax",
        "totalAllowedQuantity",
        "minimumOrderQuantity",
        "quantityStepSize",
        "productType",
        "deliverableType",
        "pickupLocation",
        "codAllowed",
        "isReturnable",
        "isCancelable",
        "cancelableTill",
        "warrantyPeriod",
        "guaranteePeriod",
        "downloadAllowed",
        "downloadLinkType",
        "downloadFile",
        "downloadLink",
        "status",
      ];

      simpleFields.forEach((field) => {
        if (formData[field] !== undefined && formData[field] !== null) {
          formDataToSend.append(field, String(formData[field]));
        }
      });

      // Handle arrays (tags, attributeValues, deliverableZipcodes, etc.)
      if (formData.tags && Array.isArray(formData.tags)) {
        formDataToSend.append("tags", JSON.stringify(formData.tags));
      }

      if (formData.attributeValues && Array.isArray(formData.attributeValues)) {
        formDataToSend.append(
          "attributeValues",
          JSON.stringify(formData.attributeValues),
        );
      }

      // In handleSubmit, add variants handling
      if (formData.variants && Array.isArray(formData.variants)) {
        formDataToSend.append("variants", JSON.stringify(formData.variants));
      }

      // Add variantStockLevelType if needed
      // if (formData.variantStockLevelType) {
      //   formDataToSend.append('variantStockLevelType', formData.variantStockLevelType);
      // }

      // Add productLevelStock if needed
      // if (formData.productLevelStock) {
      //   formDataToSend.append('productLevelStock', formData.productLevelStock);
      // }

      if (
        formData.deliverableZipcodes &&
        Array.isArray(formData.deliverableZipcodes)
      ) {
        formDataToSend.append(
          "deliverableZipcodes",
          JSON.stringify(formData.deliverableZipcodes),
        );
      }

      // Handle nested objects
      if (formData.dimensions) {
        formDataToSend.append(
          "dimensions",
          JSON.stringify(formData.dimensions),
        );
      }

      if (formData.video) {
        formDataToSend.append("video", JSON.stringify(formData.video));
      }

      // ⭐⭐ FIX: Handle simpleProduct as a JSON string (not individual fields)
      if (formData.simpleProduct) {
        // Convert to proper object format
        const simpleProductData = {
          sp_price: formData.simpleProduct.sp_price || 0,
          sp_specialPrice: formData.simpleProduct.sp_specialPrice || 0,
          sp_sku: formData.simpleProduct.sp_sku || "",
          sp_totalStock: formData.simpleProduct.sp_totalStock || 0,
          sp_stockStatus: formData.simpleProduct.sp_stockStatus || "in_stock",
        };
        formDataToSend.append(
          "simpleProduct",
          JSON.stringify(simpleProductData),
        );
      }

      // Add after otherImages handling, before console.log
      if (formData.productType === PRODUCT_TYPES.VARIABLE) {
        // Add variantStockLevelType
        if (formData.variantStockLevelType) {
          formDataToSend.append(
            "variantStockLevelType",
            formData.variantStockLevelType,
          );
        }

        // Add productLevelStock if using product-level stock
        if (
          formData.variantStockLevelType ===
            VARIANT_STOCK_LEVEL_TYPES.PRODUCT_LEVEL &&
          formData.productLevelStock
        ) {
          formDataToSend.append(
            "productLevelStock",
            JSON.stringify(formData.productLevelStock),
          );
        }
      }

      //Handle image files separately
      if (formData.mainImage && formData.mainImage instanceof File) {
        formDataToSend.append("mainImage", formData.mainImage);
      }

      if (formData.otherImages && Array.isArray(formData.otherImages)) {
        const fileObjects = formData.otherImages.filter(
          (item) => item instanceof File,
        );
        fileObjects.forEach((file) => {
          formDataToSend.append("otherImages", file);
        });
        console.log(`Appended ${fileObjects.length} other images`);
      }

      console.log("Submitting form data:", formDataToSend);
      // Use the ProductApi
      const response = await ProductApi.create(formDataToSend);
      if (response.success === true) {
        alert("Product created successfully!");
        console.log("Created product:", response);
      }

      // Reset form or redirect
      // setFormData(initialFormState);
      // router.push('/products');
    } catch (err) {
      console.error("Error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <ProductBasicInfo
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 2:
        return (
          <ProductCategorization
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 3:
        return (
          <ProductPricing formData={formData} updateFormData={updateFormData} />
        );
      case 4:
        return (
          <ProductInventory
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 5:
        return formData.productType === PRODUCT_TYPES.VARIABLE ? (
          <ProductVariants
            formData={formData}
            updateFormData={updateFormData}
          />
        ) : (
          <ProductShipping
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 6:
        return (
          <ProductPolicies
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 7:
        return (
          <ProductMedia formData={formData} updateFormData={updateFormData} />
        );
      case 8:
        return formData.productType === PRODUCT_TYPES.DIGITAL ? (
          <ProductDigital formData={formData} updateFormData={updateFormData} />
        ) : null;
      // case 9:
      //   return <ProductSEO formData={formData} updateFormData={updateFormData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-gray-600 mt-2">
            Fill in all required fields to create a new product
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((stepNum) => (
              <div
                key={stepNum}
                className={`flex-1 h-2 mx-1 rounded-full ${step >= stepNum ? "bg-blue-600" : "bg-gray-200"}`}
              />
            ))}
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Basic Info</span>
            <span>Categorization</span>
            <span>Pricing</span>
            <span>Inventory</span>
            <span>
              {formData.productType === PRODUCT_TYPES.VARIABLE
                ? "Variants"
                : "Shipping"}
            </span>
            <span>Policies</span>
            <span>Media</span>
            <span>
              {formData.productType === PRODUCT_TYPES.DIGITAL
                ? "Digital"
                : null}
            </span>
            {/* <span>SEO/Review</span> */}
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow p-6"
        >
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
                {loading ? "Creating..." : "Create Product"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
