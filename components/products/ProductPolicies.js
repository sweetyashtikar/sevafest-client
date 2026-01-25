'use client';

import { CANCELABLE_STAGES } from '@/components/products/productTypes';

export default function ProductPolicies({ formData, updateFormData }) {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    updateFormData(name, type === 'checkbox' ? checked : value);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Product Policies</h2>
      
      <div className="space-y-8">
        {/* Payment Methods */}
        <div className="p-6 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Payment Methods</h3>
          
          <div className="space-y-4">
            {/* COD Allowed */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="codAllowed"
                  name="codAllowed"
                  checked={formData.codAllowed}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="codAllowed" className="ml-3 block text-sm font-medium text-gray-700">
                  Cash on Delivery (COD)
                </label>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${
                formData.codAllowed 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {formData.codAllowed ? 'Enabled' : 'Disabled'}
              </span>
            </div>

            {/* Other Payment Methods */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-3">Online Payment Methods</h4>
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="payOnline"
                    checked
                    disabled
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="payOnline" className="ml-3 block text-sm font-medium text-gray-700">
                    Credit/Debit Cards
                  </label>
                  <span className="ml-auto text-sm text-green-600">Always enabled</span>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="upiEnabled"
                    checked
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="upiEnabled" className="ml-3 block text-sm font-medium text-gray-700">
                    UPI Payments
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="walletEnabled"
                    checked
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="walletEnabled" className="ml-3 block text-sm font-medium text-gray-700">
                    Digital Wallets (Paytm, PhonePe, etc.)
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="netBankingEnabled"
                    checked
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="netBankingEnabled" className="ml-3 block text-sm font-medium text-gray-700">
                    Net Banking
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Return Policy */}
        <div className="p-6 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Return & Refund Policy</h3>
          
          <div className="space-y-6">
            {/* Is Returnable */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isReturnable"
                  name="isReturnable"
                  checked={formData.isReturnable}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isReturnable" className="ml-3 block text-sm font-medium text-gray-700">
                  Allow Returns
                </label>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${
                formData.isReturnable 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {formData.isReturnable ? 'Returns Allowed' : 'No Returns'}
              </span>
            </div>

            {/* Return Policy Details (if enabled) */}
            {formData.isReturnable && (
              <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-800 mb-4">Return Policy Settings</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-green-700 mb-2">
                      Return Window (Days)
                    </label>
                    <select
                      name="returnWindow"
                      className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="7">7 days</option>
                      <option value="10">10 days</option>
                      <option value="15">15 days</option>
                      <option value="30" selected>30 days</option>
                      <option value="45">45 days</option>
                      <option value="60">60 days</option>
                    </select>
                    <p className="text-xs text-green-600 mt-1">
                      Number of days customer can return after delivery
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-green-700 mb-2">
                      Return Shipping
                    </label>
                    <select
                      name="returnShipping"
                      className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="free">Free Returns</option>
                      <option value="customer_pays">Customer Pays Return Shipping</option>
                      <option value="restocking_fee">Restocking Fee Applies</option>
                      <option value="exchange_only">Exchange Only (No Refund)</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-green-700 mb-2">
                      Return Conditions
                    </label>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="originalPackaging"
                          checked
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <label htmlFor="originalPackaging" className="ml-2 text-sm text-green-700">
                          Must be in original packaging
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="unused"
                          checked
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <label htmlFor="unused" className="ml-2 text-sm text-green-700">
                          Must be unused and unworn
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="tagsAttached"
                          checked
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <label htmlFor="tagsAttached" className="ml-2 text-sm text-green-700">
                          All tags must be attached
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="noDamage"
                          checked
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <label htmlFor="noDamage" className="ml-2 text-sm text-green-700">
                          No signs of damage or wear
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-green-700 mb-2">
                      Return Reasons Allowed
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center">
                        <input type="checkbox" id="defective" checked className="h-4 w-4 text-green-600" />
                        <label htmlFor="defective" className="ml-2 text-sm text-green-700">Defective/Damaged</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="wrongItem" checked className="h-4 w-4 text-green-600" />
                        <label htmlFor="wrongItem" className="ml-2 text-sm text-green-700">Wrong Item Received</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="sizeIssue" checked className="h-4 w-4 text-green-600" />
                        <label htmlFor="sizeIssue" className="ml-2 text-sm text-green-700">Size Doesn&quot;t Fit</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="colorIssue" className="h-4 w-4 text-green-600" />
                        <label htmlFor="colorIssue" className="ml-2 text-sm text-green-700">Color Different</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="notAsDescribed" checked className="h-4 w-4 text-green-600" />
                        <label htmlFor="notAsDescribed" className="ml-2 text-sm text-green-700">Not as Described</label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="changedMind" className="h-4 w-4 text-green-600" />
                        <label htmlFor="changedMind" className="ml-2 text-sm text-green-700">Changed Mind</label>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-green-700 mb-2">
                      Return Instructions for Customers
                    </label>
                    <textarea
                      rows="3"
                      className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Instructions for customers on how to return this product..."
                      defaultValue="Please ensure the product is in its original condition with all tags and packaging intact. Contact customer support within 30 days of delivery to initiate a return."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Non-returnable notice */}
            {!formData.isReturnable && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">No Returns Policy</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>This product cannot be returned. Consider if this is appropriate for your product type:</p>
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Perishable goods (food, flowers)</li>
                        <li>Personalized/custom items</li>
                        <li>Digital products (once downloaded)</li>
                        <li>Intimate apparel or hygiene products</li>
                        <li>Items on clearance or final sale</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Cancellation Policy */}
        <div className="p-6 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Cancellation Policy</h3>
          
          <div className="space-y-6">
            {/* Is Cancelable */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isCancelable"
                  name="isCancelable"
                  checked={formData.isCancelable}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isCancelable" className="ml-3 block text-sm font-medium text-gray-700">
                  Allow Order Cancellation
                </label>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${
                formData.isCancelable 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {formData.isCancelable ? 'Cancellation Allowed' : 'No Cancellation'}
              </span>
            </div>

            {/* Cancellation Settings */}
            {formData.isCancelable && (
              <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-blue-700 mb-3">
                    Cancellation Deadline
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Object.entries(CANCELABLE_STAGES).map(([key, value]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => updateFormData('cancelableTill', value)}
                        className={`p-4 border rounded-lg text-center transition-colors ${
                          formData.cancelableTill === value
                            ? 'border-blue-500 bg-blue-100'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full border mx-auto mb-2 ${
                          formData.cancelableTill === value
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-400'
                        }`} />
                        <p className="font-medium text-gray-900 capitalize">
                          {value.replace('_', ' ')}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {getCancellationDescription(value)}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-2">
                      Cancellation Fee (%)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="cancellationFee"
                        min="0"
                        max="100"
                        step="0.5"
                        className="w-full pr-10 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0"
                      />
                      <span className="absolute right-3 top-2 text-gray-500">%</span>
                    </div>
                    <p className="text-xs text-blue-600 mt-1">
                      Percentage of order total charged for cancellation
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-2">
                      Refund Processing Time
                    </label>
                    <select
                      name="refundProcessingTime"
                      className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="3">3 business days</option>
                      <option value="5">5 business days</option>
                      <option value="7">7 business days</option>
                      <option value="10">10 business days</option>
                      <option value="14">14 business days</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-blue-700 mb-2">
                      Cancellation Instructions
                    </label>
                    <textarea
                      rows="3"
                      className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Instructions for customers on how to cancel their order..."
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Warranty & Guarantee */}
        <div className="p-6 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Warranty & Guarantee</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Warranty Period
              </label>
              <input
                type="text"
                name="warrantyPeriod"
                value={formData.warrantyPeriod}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 1 year, 6 months, Lifetime"
              />
              <p className="text-xs text-gray-500 mt-1">
                Manufacturer&quot;s warranty period
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Guarantee Period
              </label>
              <input
                type="text"
                name="guaranteePeriod"
                value={formData.guaranteePeriod}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 30 days, 100% satisfaction"
              />
              <p className="text-xs text-gray-500 mt-1">
                Seller/satisfaction guarantee
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Warranty Terms & Conditions
              </label>
              <textarea
                rows="4"
                name="warrantyTerms"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Detailed warranty terms and conditions..."
                defaultValue="This warranty covers manufacturing defects and does not cover damage from misuse, accidents, or normal wear and tear. Warranty claims must be accompanied by proof of purchase. For warranty service, contact our customer support team."
              />
            </div>
          </div>

          {/* Warranty Type */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Warranty Type
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center p-3 border border-gray-300 rounded-lg">
                <input
                  type="radio"
                  id="manufacturerWarranty"
                  name="warrantyType"
                  value="manufacturer"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="manufacturerWarranty" className="ml-3 block text-sm text-gray-700">
                  Manufacturer Warranty
                </label>
              </div>
              
              <div className="flex items-center p-3 border border-gray-300 rounded-lg">
                <input
                  type="radio"
                  id="sellerWarranty"
                  name="warrantyType"
                  value="seller"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="sellerWarranty" className="ml-3 block text-sm text-gray-700">
                  Seller Warranty
                </label>
              </div>
              
              <div className="flex items-center p-3 border border-gray-300 rounded-lg">
                <input
                  type="radio"
                  id="extendedWarranty"
                  name="warrantyType"
                  value="extended"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="extendedWarranty" className="ml-3 block text-sm text-gray-700">
                  Extended Warranty (Optional)
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Policy Summary */}
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-medium text-gray-700 mb-4">Policy Summary</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-white border border-gray-300 rounded-md">
              <span className="text-sm font-medium text-gray-700">Cash on Delivery (COD)</span>
              <span className={`px-3 py-1 rounded-full text-sm ${
                formData.codAllowed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {formData.codAllowed ? 'Available' : 'Not Available'}
              </span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-white border border-gray-300 rounded-md">
              <span className="text-sm font-medium text-gray-700">Returns</span>
              <span className={`px-3 py-1 rounded-full text-sm ${
                formData.isReturnable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {formData.isReturnable ? 'Allowed' : 'Not Allowed'}
              </span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-white border border-gray-300 rounded-md">
              <span className="text-sm font-medium text-gray-700">Cancellations</span>
              <span className={`px-3 py-1 rounded-full text-sm ${
                formData.isCancelable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {formData.isCancelable ? 'Allowed' : 'Not Allowed'}
              </span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-white border border-gray-300 rounded-md">
              <span className="text-sm font-medium text-gray-700">Warranty</span>
              <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                {formData.warrantyPeriod || 'Not specified'}
              </span>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Policy Compliance</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>Ensure your policies comply with:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Consumer Protection Laws in your region</li>
                    <li>E-commerce regulations</li>
                    <li>Platform-specific policy requirements</li>
                    <li>Industry standards and best practices</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function for cancellation descriptions
function getCancellationDescription(stage) {
  const descriptions = {
    [CANCELABLE_STAGES.NOT_RETURNABLE]: 'Cannot be cancelled',
    [CANCELABLE_STAGES.RECEIVED]: 'Until order is received',
    [CANCELABLE_STAGES.PROCESSED]: 'Until order is processed',
    [CANCELABLE_STAGES.SHIPPED]: 'Until order is shipped'
  };
  return descriptions[stage] || 'Cannot be cancelled';
}