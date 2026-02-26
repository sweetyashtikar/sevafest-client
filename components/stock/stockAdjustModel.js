// components/StockAdjustmentModal.jsx
import React, { useState } from 'react';

const StockAdjustmentModal = ({ isOpen, onClose, product, onUpdate }) => {
  const [adjustmentType, setAdjustmentType] = useState('set');
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen || !product) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    await onUpdate({
      productId: product.id,
      variantId: product.variationId,
      adjustmentType,
      quantity: parseInt(quantity),
      reason,
      notes
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Adjust Stock</h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Product Info */}
          <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <p className="text-sm font-medium text-gray-900">{product.name}</p>
            {product.variation && (
              <p className="text-xs text-gray-500 mt-1">Variation: {product.variation}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">SKU: {product.sku || 'N/A'}</p>
            <p className="text-sm font-medium text-gray-900 mt-2">
              Current Stock: <span className="text-blue-600">{product.stock}</span>
            </p>
          </div>

          {/* Adjustment Type */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adjustment Type
            </label>
            <select
              value={adjustmentType}
              onChange={(e) => setAdjustmentType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="set">Set to exact quantity</option>
              <option value="increase">Increase by</option>
              <option value="decrease">Decrease by</option>
            </select>
          </div>

          {/* Quantity */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <input
              type="number"
              min="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter quantity"
              required
            />
          </div>

          {/* Reason */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select reason</option>
              <option value="restock">Restock / New shipment</option>
              <option value="sale">Sale / Order fulfillment</option>
              <option value="return">Customer return</option>
              <option value="damage">Damage / Loss</option>
              <option value="manual_count">Manual count adjustment</option>
              <option value="correction">Correction of error</option>
            </select>
          </div>

          {/* Notes */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add any additional notes..."
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Update Stock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockAdjustmentModal;