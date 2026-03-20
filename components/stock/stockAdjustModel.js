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
    onClose(); // Form submit jhalyavar modal close karnyasathi
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop with Blur */}
      <div 
        className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Modal Container: 90% width on mobile, max-md on desktop */}
      <div className="relative bg-white rounded-xl shadow-2xl w-[90%] sm:max-w-md overflow-hidden transform transition-all">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="text-xl font-semibold text-gray-800">Adjust Stock</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Product Info Card */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-bold text-blue-900 uppercase tracking-wider">{product.name}</p>
                {product.variation && (
                  <p className="text-xs text-blue-700 font-medium">Var: {product.variation}</p>
                )}
                <p className="text-[10px] text-blue-500 mt-1 uppercase font-bold">SKU: {product.sku || 'N/A'}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-blue-600 uppercase font-bold">Current Stock</p>
                <p className="text-2xl font-black text-blue-700">{product.stock}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Adjustment Type */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">
                Adjustment Type
              </label>
              <select
                value={adjustmentType}
                onChange={(e) => setAdjustmentType(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                required
              >
                <option value="set">Set to exact quantity</option>
                <option value="increase">Increase by (+)</option>
                <option value="decrease">Decrease by (-)</option>
              </select>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">
                Quantity
              </label>
              <input
                type="number"
                min="0"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                placeholder="Enter amount"
                required
              />
            </div>

            {/* Reason */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">
                Reason for Change
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
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
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">
                Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows="2"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all resize-none"
                placeholder="Add details..."
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors order-2 sm:order-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-blue-600 border border-transparent rounded-lg text-sm font-semibold text-white hover:bg-blue-700 shadow-md shadow-blue-200 active:transform active:scale-[0.98] transition-all order-1 sm:order-2"
            >
              Update Inventory
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockAdjustmentModal;