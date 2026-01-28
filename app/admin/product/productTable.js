// app/products/page.jsx
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FiEye,
  FiEdit,
  FiTrash2,
  FiChevronDown,
  FiChevronUp,
  FiFilter
} from 'react-icons/fi';
import { ProductApi } from '@/components/attributes/api';
import { PRODUCT_TYPES } from '@/components/products/productTypes';





const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [expandedRows, setExpandedRows] = useState([]);
const [error, setError] = useState('');
  // Add these states to your component
const [isEditModalOpen, setIsEditModalOpen] = useState(false);
const [editingProduct, setEditingProduct] = useState(null);
const [editFormData, setEditFormData] = useState(null);
const [updateLoading, setUpdateLoading] = useState(false);
const [updateError, setUpdateError] = useState('');

useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await ProductApi.getAllProducts();
      
      let productsData = [];
      if (Array.isArray(response.data)) {
        productsData = response.data;
      } else if (response.data && Array.isArray(response.data.products)) {
        productsData = response.data.products;
      } else if (response.data && response.data.data && Array.isArray(response.data.data.products)) {
        productsData = response.data.data.products;
      } else if (response.data && response.data.success && Array.isArray(response.data.data)) {
        productsData = response.data.data;
      }
      
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };


  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

// Safe sorting function
  const sortedProducts = [...products].sort((a, b) => {
    let aValue = a;
    let bValue = b;
    
    // Handle nested keys (e.g., 'categoryId.name')
    if (sortConfig.key.includes('.')) {
      const keys = sortConfig.key.split('.');
      aValue = keys.reduce((obj, key) => obj?.[key], a);
      bValue = keys.reduce((obj, key) => obj?.[key], b);
    } else {
      aValue = a[sortConfig.key];
      bValue = b[sortConfig.key];
    }
    
    // Handle undefined or null values
    if (aValue == null) return 1;
    if (bValue == null) return -1;
    
    // Handle string comparison (case insensitive)
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortConfig.direction === 'asc' 
        ? aValue.toLowerCase().localeCompare(bValue.toLowerCase())
        : bValue.toLowerCase().localeCompare(aValue.toLowerCase());
    }
    
    // Handle number comparison
    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const handleView = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

const handleEdit = (product) => {
  setEditingProduct(product);
  
  // Initialize form data with product data
  // ✅ ONLY set fields that have actual values, don't set empty strings
  const formData = {
    // Basic fields - only if they exist
    ...(product.name && { name: product.name }),
    ...(product.shortDescription && { shortDescription: product.shortDescription }),
    ...(product.description && { description: product.description }),
    ...(product.brand && { brand: product.brand }),
    ...(product.hsnCode && { hsnCode: product.hsnCode }),
    ...(product.warrantyPeriod && { warrantyPeriod: product.warrantyPeriod }),
    ...(product.guaranteePeriod && { guaranteePeriod: product.guaranteePeriod }),
    
    // Required fields with defaults
    productType: product.productType || 'simple',
    status: product.status !== undefined ? product.status : true,
    madeIn: product.madeIn || 'India',
    indicator: product.indicator || 'none',
    deliverableType: product.deliverableType || 'all',
    
    // IDs
    ...(product.categoryId && { 
      categoryId: product.categoryId._id || product.categoryId 
    }),
    ...(product.taxId && { 
      taxId: product.taxId._id || product.taxId 
    }),
    
    // Boolean fields
    isPricesInclusiveTax: product.isPricesInclusiveTax || false,
    codAllowed: product.codAllowed || false,
    isReturnable: product.isReturnable || false,
    isCancelable: product.isCancelable || false,
    
    // Number fields
    totalAllowedQuantity: product.totalAllowedQuantity || 0,
    minimumOrderQuantity: product.minimumOrderQuantity || 1,
    quantityStepSize: product.quantityStepSize || 1,
    
    // Conditional fields
    ...(product.cancelableTill && { cancelableTill: product.cancelableTill }),
    ...(product.variantStockLevelType && { variantStockLevelType: product.variantStockLevelType }),
    
    // Arrays - only if they have values
    ...(product.tags && product.tags.length > 0 && { tags: product.tags }),
    ...(product.attributeValues && product.attributeValues.length > 0 && { 
      attributeValues: product.attributeValues 
    }),
    ...(product.variants && product.variants.length > 0 && { 
      variants: product.variants 
    }),
    ...(product.deliverableZipcodes && product.deliverableZipcodes.length > 0 && { 
      deliverableZipcodes: product.deliverableZipcodes 
    }),
    
    // Objects - only if they have properties
    ...(product.dimensions && Object.keys(product.dimensions).length > 0 && { 
      dimensions: product.dimensions 
    }),
    ...(product.video && Object.keys(product.video).length > 0 && { 
      video: product.video 
    }),
    ...(product.productLevelStock && Object.keys(product.productLevelStock).length > 0 && { 
      productLevelStock: product.productLevelStock 
    }),
    ...(product.simpleProduct && Object.keys(product.simpleProduct).length > 0 && { 
      simpleProduct: product.simpleProduct 
    }),
    
    // Handle existing images
    ...(product.mainImage && { 
      mainImage: { url: product.mainImage, type: 'existing' } 
    }),
    ...(product.otherImages && product.otherImages.length > 0 && { 
      otherImages: product.otherImages.map(url => ({ url, type: 'existing' })) 
    }),
  };
  
  setEditFormData(formData);
  setIsEditModalOpen(true);
};

const handleUpdateProduct = async (e) => {
  e.preventDefault();
  setUpdateLoading(true);
  setUpdateError('');

  try {
    // Create FormData
    const formDataToSend = new FormData();
    
    // Append all simple fields (SAME AS handleSubmit)
    const simpleFields = [
      'name', 'shortDescription', 'description', 'extraDescription',
      'categoryId', 'brand', 'hsnCode', 'madeIn', 'indicator',
      'taxId', 'isPricesInclusiveTax', 'totalAllowedQuantity',
      'minimumOrderQuantity', 'quantityStepSize', 'productType',
      'deliverableType', 'pickupLocation', 'codAllowed',
      'isReturnable', 'isCancelable', 'cancelableTill',
      'warrantyPeriod', 'guaranteePeriod', 'downloadAllowed',
      'downloadLinkType', 'downloadFile', 'downloadLink', 'status'
    ];
    
    // ✅ SAME LOGIC AS handleSubmit - only append if NOT undefined/null
    simpleFields.forEach(field => {
      if (editFormData[field] !== undefined && editFormData[field] !== null) {
        formDataToSend.append(field, String(editFormData[field]));
      }
    });
    
    // Handle arrays (SAME AS handleSubmit)
    if (editFormData.tags && Array.isArray(editFormData.tags)) {
      formDataToSend.append('tags', JSON.stringify(editFormData.tags));
    }
    
    if (editFormData.attributeValues && Array.isArray(editFormData.attributeValues)) {
      formDataToSend.append('attributeValues', JSON.stringify(editFormData.attributeValues));
    }

    // Variants handling (SAME AS handleSubmit)
    if (editFormData.variants && Array.isArray(editFormData.variants)) {
      formDataToSend.append('variants', JSON.stringify(editFormData.variants));
    }

    // Add variantStockLevelType if needed (SAME AS handleSubmit)
    if (editFormData.variantStockLevelType) {
      formDataToSend.append('variantStockLevelType', editFormData.variantStockLevelType);
    }

    // Add productLevelStock if needed (SAME AS handleSubmit)
    if (editFormData.productLevelStock) {
      formDataToSend.append('productLevelStock', JSON.stringify(editFormData.productLevelStock));
    }
    
    if (editFormData.deliverableZipcodes && Array.isArray(editFormData.deliverableZipcodes)) {
      formDataToSend.append('deliverableZipcodes', JSON.stringify(editFormData.deliverableZipcodes));
    }
    
    // Handle nested objects (SAME AS handleSubmit)
    if (editFormData.dimensions) {
      formDataToSend.append('dimensions', JSON.stringify(editFormData.dimensions));
    }
    
    if (editFormData.video) {
      formDataToSend.append('video', JSON.stringify(editFormData.video));
    }
    
    // ⭐⭐ Handle simpleProduct as a JSON string (SAME AS handleSubmit)
    if (editFormData.simpleProduct) {
      const simpleProductData = {
        sp_price: editFormData.simpleProduct.sp_price || 0,
        sp_specialPrice: editFormData.simpleProduct.sp_specialPrice || 0,
        sp_sku: editFormData.simpleProduct.sp_sku || '',
        sp_totalStock: editFormData.simpleProduct.sp_totalStock || 0,
        sp_stockStatus: editFormData.simpleProduct.sp_stockStatus || 'in_stock'
      };
      formDataToSend.append('simpleProduct', JSON.stringify(simpleProductData));
    }

    // Variable product handling (SAME AS handleSubmit)
    if (editFormData.productType === PRODUCT_TYPES.VARIABLE) {
      // Add variantStockLevelType
      if (editFormData.variantStockLevelType) {
        formDataToSend.append('variantStockLevelType', editFormData.variantStockLevelType);
      }
      
      // Add variants
      if (editFormData.variants && Array.isArray(editFormData.variants)) {
        formDataToSend.append('variants', JSON.stringify(editFormData.variants));
      }
      
      // Add productLevelStock if using product-level stock
      if (editFormData.variantStockLevelType === VARIANT_STOCK_LEVEL_TYPES.PRODUCT_LEVEL && editFormData.productLevelStock) {
        formDataToSend.append('productLevelStock', 
          JSON.stringify(editFormData.productLevelStock));
      }
    }

    // Handle image files separately (MODIFIED FOR UPDATE)
    if (editFormData.mainImage) {
      // If it's a new file, append it
      if (editFormData.mainImage instanceof File) {
        formDataToSend.append('mainImage', editFormData.mainImage);
      }
      // If it's existing image (with url), don't append anything - backend will keep existing
    }
    
    if (editFormData.otherImages && Array.isArray(editFormData.otherImages)) {
      // Filter only File objects (new uploads)
      const fileObjects = editFormData.otherImages.filter(item => item instanceof File);
      fileObjects.forEach((file) => {
        formDataToSend.append('otherImages', file);
      });
      
      // Handle existing images
      const existingImages = editFormData.otherImages.filter(item => item.type === 'existing');
      if (existingImages.length > 0) {
        formDataToSend.append('existingOtherImages', JSON.stringify(existingImages));
      }
      
      console.log(`Appended ${fileObjects.length} new images, ${existingImages.length} existing images`);
    }

    console.log('Submitting update data:', formDataToSend);
    
    // Use the ProductApi
    const response = await ProductApi.update(editingProduct._id, formDataToSend);
    
    if (response.success === true) {
      alert('Product updated successfully!');
      console.log('Updated product:', response);
      setIsEditModalOpen(false);
      setEditingProduct(null);
      setEditFormData(null);
      fetchProducts(); // Refresh the list
    }
    
  } catch (err) {
    console.error('Error:', err);
    setUpdateError(err.message || 'Failed to update product');
  } finally {
    setUpdateLoading(false);
  }
};

// Handle form input changes
  const handleEditInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle nested object changes (for simpleProduct, dimensions, etc.)
  const handleNestedChange = (parentKey, childKey, value) => {
    setEditFormData(prev => ({
      ...prev,
      [parentKey]: {
        ...(prev[parentKey] || {}),
        [childKey]: value
      }
    }));
  };



  const handleDelete = async (product) => {
    if (!window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      return;
    }

    try {
      setLoading(true);
      const response = await ProductApi.delete(product._id);
      
      if (response.success) {
        alert('Product deleted successfully!');
        fetchProducts(); // Refresh the list
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const toggleRowExpansion = (id) => {
    setExpandedRows(prev =>
      prev.includes(id)
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }


   if (!Array.isArray(products) || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No products found</p>
        <p className="text-gray-400 text-sm mt-2">Products data is not in expected format</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Serial No
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('categoryId.name')}
              >
                <div className="flex items-center">
                  Category
                  {sortConfig.key === 'categoryId.name' && (
                    sortConfig.direction === 'asc' ? 
                      <FiChevronUp className="ml-1" /> : 
                      <FiChevronDown className="ml-1" />
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('productName')}
              >
                <div className="flex items-center">
                  Product Name
                  {sortConfig.key === 'productName' && (
                    sortConfig.direction === 'asc' ? 
                      <FiChevronUp className="ml-1" /> : 
                      <FiChevronDown className="ml-1" />
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('price')}
              >
                <div className="flex items-center">
                  Price
                  {sortConfig.key === 'price' && (
                    sortConfig.direction === 'asc' ? 
                      <FiChevronUp className="ml-1" /> : 
                      <FiChevronDown className="ml-1" />
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('productType')}
              >
                <div className="flex items-center">
                  Product Type
                  {sortConfig.key === 'productType' && (
                    sortConfig.direction === 'asc' ? 
                      <FiChevronUp className="ml-1" /> : 
                      <FiChevronDown className="ml-1" />
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center">
                  Status
                  {sortConfig.key === 'status' && (
                    sortConfig.direction === 'asc' ? 
                      <FiChevronUp className="ml-1" /> : 
                      <FiChevronDown className="ml-1" />
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedProducts.map((product) => (
              <>
                <tr 
                  key={product._id || product.id} 
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-mono text-sm font-medium text-gray-900">
                      {product.serialNo || `P${(product._id || '').slice(-6).toUpperCase()}`}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {product.categoryId?.name || product.category || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {product.name || 'Unnamed Product'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {product.brand || 'No brand'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      ₹{(product.effectivePrice || 0).toFixed(2)}
                    </div>
                    {product.taxId && (
                      <div className="text-xs text-gray-500">
                        +{product.taxId.percentage || 0}% tax
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      product.productType === 'Physical' 
                        ? 'bg-green-100 text-green-800' 
                        : product.productType === 'Digital'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {product.productType || 'Unknown'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      product.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : product.status === 'Out of Stock'
                        ? 'bg-red-100 text-red-800'
                        : product.status === 'Draft'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {product.status || 'Unknown'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleView(product)}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        title="View Details"
                      >
                        <FiEye size={18} />
                      </button>
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-yellow-600 hover:text-yellow-900 transition-colors"
                        title="Edit"
                      >
                        <FiEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(product)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                        title="Delete"
                      >
                        <FiTrash2 size={18} />
                      </button>
                      <button
                        onClick={() => toggleRowExpansion(product._id || product.id)}
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                        title="Expand/Collapse"
                      >
                        {expandedRows.includes(product._id || product.id) ? 
                          <FiChevronUp size={18} /> : 
                          <FiChevronDown size={18} />
                        }
                      </button>
                    </div>
                  </td>
                </tr>
                
                {/* Expanded Row - Additional Details */}
                {expandedRows.includes(product._id || product.id) && (
                  <tr className="bg-gray-50">
                    <td colSpan="7" className="px-6 py-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-gray-500">Description</p>
                          <p className="text-gray-900">{product.description || 'No description'}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-500">Vendor</p>
                          <p className="text-gray-900">{product.vendorId?.username || product.vendorId?.company || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-500">Stock</p>
                          <p className={`font-semibold ${
                            (product.stock || 0) > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {product.stock || 0} units
                          </p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-500">Created</p>
                          <p className="text-gray-900">
                            {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                        {product.attributeValues && product.attributeValues.length > 0 && (
                          <div className="md:col-span-2">
                            <p className="font-medium text-gray-500 mb-1">Attributes</p>
                            <div className="flex flex-wrap gap-2">
                              {product.attributeValues.map((attr, index) => (
                                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                  {attr.attribute_id?.name || 'Attribute'}: {attr.value || 'N/A'}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Product Details
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      Basic Information
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Product Name:</span>
                        <span className="font-medium">{selectedProduct.productName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Category:</span>
                        <span className="font-medium">{selectedProduct.categoryId?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Brand:</span>
                        <span className="font-medium">{selectedProduct.brand || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">SKU:</span>
                        <span className="font-mono">{selectedProduct.sku || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      Pricing & Status
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Price:</span>
                        <span className="font-bold text-blue-600">
                          ${(selectedProduct.price || 0).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          selectedProduct.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : selectedProduct.status === 'Out of Stock'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {selectedProduct.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Stock:</span>
                        <span className={`font-semibold ${
                          (selectedProduct.stock || 0) > 0 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                          {selectedProduct.stock || 0} units
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      Additional Details
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Product Type:</span>
                        <span className="font-medium">{selectedProduct.productType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Vendor:</span>
                        <span className="font-medium">{selectedProduct.vendorId?.username || selectedProduct.vendorId?.company || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Created Date:</span>
                        <span className="font-medium">
                          {selectedProduct.createdAt ? new Date(selectedProduct.createdAt).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                      {selectedProduct.taxId && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tax:</span>
                          <span className="font-medium">{selectedProduct.taxId.title} ({selectedProduct.taxId.percentage}%)</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      Description
                    </h3>
                    <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                      {selectedProduct.description || 'No description available'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => handleUpdateProduct(selectedProduct)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Edit Product
                  </button>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

{isEditModalOpen && editingProduct && editFormData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleUpdateProduct}>
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Edit Product: {editingProduct.name}
                  </h2>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditModalOpen(false);
                      setEditingProduct(null);
                      setEditFormData(null);
                      setUpdateError('');
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                {updateError && (
                  <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                    {updateError}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={editFormData.name}
                        onChange={handleEditInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Short Description
                      </label>
                      <textarea
                        name="shortDescription"
                        value={editFormData.shortDescription}
                        onChange={handleEditInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="3"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Brand
                      </label>
                      <input
                        type="text"
                        name="brand"
                        value={editFormData.brand}
                        onChange={handleEditInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Add Simple Product Price if productType is simple */}
                    {editFormData.productType === PRODUCT_TYPES.SIMPLE && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Price *
                          </label>
                          <input
                            type="number"
                            value={editFormData.simpleProduct?.sp_price || 0}
                            onChange={(e) => handleNestedChange('simpleProduct', 'sp_price', parseFloat(e.target.value))}
                            step="0.01"
                            min="0"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Special Price
                          </label>
                          <input
                            type="number"
                            value={editFormData.simpleProduct?.sp_specialPrice || 0}
                            onChange={(e) => handleNestedChange('simpleProduct', 'sp_specialPrice', parseFloat(e.target.value))}
                            step="0.01"
                            min="0"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Stock
                          </label>
                          <input
                            type="number"
                            value={editFormData.simpleProduct?.sp_totalStock || 0}
                            onChange={(e) => handleNestedChange('simpleProduct', 'sp_totalStock', parseInt(e.target.value))}
                            min="0"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product Type *
                      </label>
                      <select
                        name="productType"
                        value={editFormData.productType}
                        onChange={handleEditInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Select Type</option>
                        <option value={PRODUCT_TYPES.SIMPLE}>Simple</option>
                        <option value={PRODUCT_TYPES.VARIABLE}>Variable</option>
                        <option value={PRODUCT_TYPES.DIGITAL}>Digital</option>
                        <option value={PRODUCT_TYPES.SERVICE}>Service</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="status"
                          checked={editFormData.status}
                          onChange={handleEditInputChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-900">
                          Active
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        COD Allowed
                      </label>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="codAllowed"
                          checked={editFormData.codAllowed}
                          onChange={handleEditInputChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-900">
                          Allow Cash on Delivery
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Returnable
                      </label>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="isReturnable"
                          checked={editFormData.isReturnable}
                          onChange={handleEditInputChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-900">
                          Product can be returned
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cancelable
                      </label>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="isCancelable"
                          checked={editFormData.isCancelable}
                          onChange={handleEditInputChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-900">
                          Order can be canceled
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={editFormData.description}
                      onChange={handleEditInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="5"
                    />
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditModalOpen(false);
                        setEditingProduct(null);
                        setEditFormData(null);
                        setUpdateError('');
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                      disabled={updateLoading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                      disabled={updateLoading}
                    >
                      {updateLoading ? 'Updating...' : 'Update Product'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductTable;