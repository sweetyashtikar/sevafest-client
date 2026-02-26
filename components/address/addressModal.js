// components/AddressModal.js
"use client";
import React, { useState } from "react";
import { X, MapPin, Phone, Check, Edit, Trash2, Plus } from "lucide-react";

const AddressModal = ({ isOpen, onClose, addresses = [], onSelectAddress, selectedAddressId }) => {
  const [selectedId, setSelectedId] = useState(selectedAddressId);

  if (!isOpen) return null;

  const handleSelect = (address) => {
    setSelectedId(address._id);
  };

  const handleConfirm = () => {
    const selected = addresses.find(addr => addr._id === selectedId);
    if (selected) {
      onSelectAddress(selected);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h3 className="text-xl font-bold text-gray-900">Your Addresses</h3>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Address List - Scrollable */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <div className="space-y-4">
              {addresses.map((address) => (
                <div 
                  key={address._id}
                  className={`border rounded-lg p-5 cursor-pointer transition-all ${
                    selectedId === address._id 
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                  }`}
                  onClick={() => handleSelect(address)}
                >
                  <div className="flex items-start gap-4">
                    {/* Radio Button */}
                    <div className="pt-1">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedId === address._id 
                          ? 'border-blue-500 bg-blue-500' 
                          : 'border-gray-300'
                      }`}>
                        {selectedId === address._id && (
                          <Check size={12} className="text-white" />
                        )}
                      </div>
                    </div>

                    {/* Address Content */}
                    <div className="flex-1">
                      {/* Header with Name and Badges */}
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="font-semibold text-gray-900">{address.name}</span>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                          {address.type || 'Home'}
                        </span>
                        {address.is_default && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            DEFAULT
                          </span>
                        )}
                        {!address.serviceable && (
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                            Not Serviceable
                          </span>
                        )}
                      </div>

                      {/* Full Address */}
                      <div className="text-sm text-gray-700 space-y-1">
                        <p className="font-medium">{address.address}</p>
                        {address.landmark && (
                          <p className="text-gray-500">Landmark: {address.landmark}</p>
                        )}
                        <p>
                          {address.area_id?.name && `${address.area_id.name}, `}
                          {address.city_id?.name && `${address.city_id.name}, `}
                          {address.state} - {address.pincode}
                        </p>
                        <p className="text-gray-500">{address.country}</p>
                        <div className="flex items-center gap-2 mt-2 text-gray-600">
                          <Phone size={14} />
                          <span>{address.mobile}</span>
                          {address.alternate_mobile && (
                            <span className="text-gray-400">Alt: {address.alternate_mobile}</span>
                          )}
                        </div>
                      </div>

                      {/* Delivery Charges Info */}
                      {address.delivery_info && (
                        <div className="mt-3 text-xs">
                          <span className="text-gray-500">
                            Delivery: ₹{address.delivery_info.charges} • 
                            Free above ₹{address.delivery_info.minimum_free_delivery}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      <button 
                        className="p-2 hover:bg-white rounded-full transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle edit address
                          console.log("Edit address:", address._id);
                        }}
                      >
                        <Edit size={16} className="text-gray-600" />
                      </button>
                      <button 
                        className="p-2 hover:bg-white rounded-full transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle delete address
                          console.log("Delete address:", address._id);
                        }}
                      >
                        <Trash2 size={16} className="text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Address Button */}
            <button className="mt-6 w-full py-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group">
              <div className="flex items-center justify-center gap-2">
                <Plus size={20} className="text-gray-400 group-hover:text-blue-500" />
                <span className="text-gray-600 group-hover:text-blue-600 font-medium">
                  Add New Address
                </span>
              </div>
            </button>
          </div>

          {/* Footer */}
          <div className="border-t p-6 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedId}
              className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
                selectedId 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              Deliver Here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;