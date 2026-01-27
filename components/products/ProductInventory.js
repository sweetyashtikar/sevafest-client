'use client';

import { PRODUCT_TYPES, VARIANT_STOCK_LEVEL_TYPES ,STOCK_STATUS} from '@/components/products/productTypes';

export default function ProductInventory({ formData, updateFormData }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData(name, value);
  };

  const handleSimpleProductChange = (e) => {
    const { name, value } = e.target;
    const field = name.replace('simpleProduct.', '');
    updateFormData('simpleProduct', {
      ...formData.simpleProduct,
      [field]: value
    });
  };

  const handleProductLevelStockChange = (e) => {
    const { name, value } = e.target;
    const field = name.replace('productLevelStock.', '');
    updateFormData('productLevelStock', {
      ...formData.productLevelStock,
      [field]: value
    });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Inventory Management</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Total Allowed Quantity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Total Allowed Quantity
          </label>
          <input
            type="number"
            name="totalAllowedQuantity"
            value={formData.totalAllowedQuantity}
            onChange={handleChange}
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-sm text-gray-500 mt-1">Maximum quantity a customer can purchase</p>
        </div>

        {/* Minimum Order Quantity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Minimum Order Quantity
          </label>
          <input
            type="number"
            name="minimumOrderQuantity"
            value={formData.minimumOrderQuantity}
            onChange={handleChange}
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Quantity Step Size */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quantity Step Size
          </label>
          <input
            type="number"
            name="quantityStepSize"
            value={formData.quantityStepSize}
            onChange={handleChange}
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-sm text-gray-500 mt-1">Increment amount for quantity selector</p>
        </div>

        {/* Variable Product - Stock Level Type */}
        {formData.productType === PRODUCT_TYPES.VARIABLE && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock Level Type *
            </label>
            <select
              name="variantStockLevelType"
              value={formData.variantStockLevelType}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Stock Level Type</option>
              <option value={VARIANT_STOCK_LEVEL_TYPES.VARIABLE_LEVEL}>Variable Level (Per Variant)</option>
              <option value={VARIANT_STOCK_LEVEL_TYPES.PRODUCT_LEVEL}>Product Level (Shared)</option>
            </select>
          </div>
        )}

        {/* Simple/Digital Product Stock */}
        {(formData.productType === PRODUCT_TYPES.SIMPLE || formData.productType === PRODUCT_TYPES.DIGITAL) && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Stock
              </label>
              <input
                type="number"
                name="simpleProduct.sp_totalStock"
                value={formData.simpleProduct.sp_totalStock}
                onChange={handleSimpleProductChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Status
              </label>
              <select
                name="simpleProduct.sp_stockStatus"
                value={formData.simpleProduct.sp_stockStatus}
                onChange={handleSimpleProductChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Status</option>
                <option value={STOCK_STATUS.IN_STOCK}>In Stock</option>
                <option value={STOCK_STATUS.OUT_OF_STOCK}>Out of Stock</option>
              </select>
            </div>
          </>
        )}

        {/* Variable Product - Product Level Stock */}
        {formData.productType === PRODUCT_TYPES.VARIABLE && formData.variantStockLevelType === VARIANT_STOCK_LEVEL_TYPES.PRODUCT_LEVEL && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Level SKU
              </label>
              <input
                type="text"
                name="productLevelStock.pls_sku"
                value={formData.productLevelStock.pls_sku}
                onChange={handleProductLevelStockChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                placeholder="Master SKU"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Stock (Product Level)
              </label>
              <input
                type="number"
                name="productLevelStock.pls_totalStock"
                value={formData.productLevelStock.pls_totalStock}
                onChange={handleProductLevelStockChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Status (Product Level)
              </label>
              <select
                name="productLevelStock.pls_stockStatus"
                value={formData.productLevelStock.pls_stockStatus}
                onChange={handleProductLevelStockChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Status</option>
                <option value={STOCK_STATUS.IN_STOCK}>In Stock</option>
                <option value={STOCK_STATUS.OUT_OF_STOCK}>Out of Stock</option>
              </select>
            </div>
          </>
        )}
      </div>
    </div>
  );
}