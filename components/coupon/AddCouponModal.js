// components/coupon/AddCouponModal.jsx
"use client";

import { useState, useRef, useEffect } from "react";
import { 
  X, 
  Upload, 
  Plus, 
  Pencil, 
  Tag, 
  Calendar,
  Percent,
  Users,
  Clock,
  Infinity,
  DollarSign
} from "lucide-react";
import { couponService } from "@/API/couponAPI";
import { 
  COUPON_TYPE_OPTIONS, 
  DISCOUNT_TYPE_OPTIONS,
  USER_TYPE_OPTIONS 
} from "@/components/coupon/couponConstants";

export default function AddCouponModal({
  onClose,
  initialData = null,
  onSuccess
}) {
  const isEdit = Boolean(initialData);

  const [formData, setFormData] = useState({
    couponCode: '',
    title: '',
    description: '',
    couponType: 'multiple time valid',
    userType: 'all',
    discountType: 'percentage',
    couponValue: '',
    minOrderAmount: '0',
    maxDiscountAmount: '',
    expiryDate: '',
    startDate: '',
    totalUsageLimit: '',
    perUserUsageLimit: '1',
    status: true,
    image: null
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        couponCode: initialData.couponCode || '',
        title: initialData.title || '',
        description: initialData.description || '',
        couponType: initialData.couponType || 'multiple time valid',
        userType: initialData.userType || 'all',
        discountType: initialData.discountType || 'percentage',
        couponValue: initialData.couponValue || '',
        minOrderAmount: initialData.minOrderAmount || '0',
        maxDiscountAmount: initialData.maxDiscountAmount || '',
        expiryDate: initialData.expiryDate ? new Date(initialData.expiryDate).toISOString().split('T')[0] : '',
        startDate: initialData.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : '',
        totalUsageLimit: initialData.totalUsageLimit || '',
        perUserUsageLimit: initialData.perUserUsageLimit || '1',
        status: initialData.status ?? true,
        image: initialData.image || null
      });
      setImagePreview(initialData.image || null);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }

      setFormData(prev => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const validateForm = () => {
    if (!formData.couponCode.trim()) {
      setError('Coupon code is required');
      return false;
    }
    if (!formData.title.trim()) {
      setError('Coupon title is required');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Coupon description is required');
      return false;
    }
    if (!formData.couponValue) {
      setError('Coupon value is required');
      return false;
    }
    if (formData.discountType === 'percentage' && formData.couponValue > 100) {
      setError('Percentage discount cannot exceed 100%');
      return false;
    }
    if (!formData.expiryDate) {
      setError('Expiry date is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError('');

      const submitData = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'image') {
          if (formData.image instanceof File) {
            submitData.append('image', formData.image);
          }
        } else if (formData[key] !== null && formData[key] !== '') {
          submitData.append(key, formData[key]);
        }
      });

      let response;
      if (isEdit) {
        response = await couponService.updateCoupon(initialData._id, submitData);
      } else {
        response = await couponService.createCoupon(submitData);
      }

      onSuccess?.(response.data);
      onClose();
    } catch (err) {
      console.error('Error saving coupon:', err);
      setError(err.message || 'Failed to save coupon');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-[650px] rounded-2xl shadow-2xl relative overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-black flex items-center gap-2">
            {isEdit ? (
              <>
                <Pencil size={18} className="text-blue-600" />
                Edit Coupon
              </>
            ) : (
              <>
                <Plus size={18} className="text-blue-600" />
                Create New Coupon
              </>
            )}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-full transition-colors text-black"
          >
            <X size={20} />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Image Upload */}
          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-wider text-black/40">
              Coupon Image <span className="text-xs font-normal">(Optional)</span>
            </label>
            <div className="flex items-center gap-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
                id="coupon-image"
              />
              <label
                htmlFor="coupon-image"
                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 cursor-pointer transition-colors inline-flex items-center gap-2"
              >
                <Upload size={16} />
                Choose Image
              </label>
              {imagePreview && (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-12 w-12 object-cover rounded-lg border border-slate-200"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute -top-2 -right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Coupon Code */}
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-black/40">
                  Coupon Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="couponCode"
                  value={formData.couponCode}
                  onChange={handleChange}
                  placeholder="e.g. SUMMER20"
                  className="w-full border border-slate-200 px-4 py-3 rounded-xl text-black font-medium placeholder:text-black/20 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 uppercase"
                  maxLength={20}
                />
              </div>

              {/* Title */}
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-black/40">
                  Coupon Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Summer Sale 2024"
                  className="w-full border border-slate-200 px-4 py-3 rounded-xl text-black font-medium placeholder:text-black/20 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              {/* Coupon Type */}
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-black/40">
                  Coupon Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="couponType"
                  value={formData.couponType}
                  onChange={handleChange}
                  className="w-full border border-slate-200 px-4 py-3 rounded-xl text-black font-medium outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                >
                  {COUPON_TYPE_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              {/* User Type */}
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-black/40">
                  User Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="userType"
                  value={formData.userType}
                  onChange={handleChange}
                  className="w-full border border-slate-200 px-4 py-3 rounded-xl text-black font-medium outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                >
                  {USER_TYPE_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Discount Type */}
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-black/40">
                  Discount Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="discountType"
                  value={formData.discountType}
                  onChange={handleChange}
                  className="w-full border border-slate-200 px-4 py-3 rounded-xl text-black font-medium outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                >
                  {DISCOUNT_TYPE_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              {/* Coupon Value */}
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-black/40">
                  Coupon Value <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40">
                    {formData.discountType === 'percentage' ? '%' : '₹'}
                  </span>
                  <input
                    type="number"
                    name="couponValue"
                    value={formData.couponValue}
                    onChange={handleChange}
                    min="0"
                    max={formData.discountType === 'percentage' ? 100 : undefined}
                    className="w-full border border-slate-200 pl-8 pr-4 py-3 rounded-xl text-black font-medium outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />
                </div>
              </div>

              {/* Max Discount Amount (for percentage) */}
              {formData.discountType === 'percentage' && (
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-wider text-black/40">
                    Max Discount Amount <span className="text-xs font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40">₹</span>
                    <input
                      type="number"
                      name="maxDiscountAmount"
                      value={formData.maxDiscountAmount}
                      onChange={handleChange}
                      min="0"
                      className="w-full border border-slate-200 pl-8 pr-4 py-3 rounded-xl text-black font-medium outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Min Order Amount */}
          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-wider text-black/40">
              Minimum Order Amount <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40">₹</span>
              <input
                type="number"
                name="minOrderAmount"
                value={formData.minOrderAmount}
                onChange={handleChange}
                min="0"
                className="w-full border border-slate-200 pl-8 pr-4 py-3 rounded-xl text-black font-medium outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-wider text-black/40">
              Coupon Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Describe the coupon terms and conditions..."
              className="w-full border border-slate-200 px-4 py-3 rounded-xl text-black font-medium placeholder:text-black/20 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
          </div>

          {/* Dates Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-black/40">
                Start Date <span className="text-xs font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40" />
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full border border-slate-200 pl-10 pr-4 py-3 rounded-xl text-black font-medium outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-black/40">
                Expiry Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Clock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40" />
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  className="w-full border border-slate-200 pl-10 pr-4 py-3 rounded-xl text-black font-medium outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
            </div>
          </div>

          {/* Usage Limits Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-black/40">
                Total Usage Limit <span className="text-xs font-normal">(Leave empty for unlimited)</span>
              </label>
              <div className="relative">
                <Infinity size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40" />
                <input
                  type="number"
                  name="totalUsageLimit"
                  value={formData.totalUsageLimit}
                  onChange={handleChange}
                  min="1"
                  placeholder="e.g. 1000"
                  className="w-full border border-slate-200 pl-10 pr-4 py-3 rounded-xl text-black font-medium placeholder:text-black/20 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-black/40">
                Per User Limit <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Users size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40" />
                <input
                  type="number"
                  name="perUserUsageLimit"
                  value={formData.perUserUsageLimit}
                  onChange={handleChange}
                  min="1"
                  className="w-full border border-slate-200 pl-10 pr-4 py-3 rounded-xl text-black font-medium outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
            </div>
          </div>

          {/* Status Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${formData.status ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-600'}`}>
                {formData.status ? <Tag size={18} /> : <X size={18} />}
              </div>
              <div>
                <p className="font-bold text-black text-sm">
                  {formData.status ? 'Active Coupon' : 'Inactive Coupon'}
                </p>
                <p className="text-xs text-black/40">
                  {formData.status ? 'Coupon is available for users' : 'Coupon is hidden from users'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, status: !prev.status }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                formData.status ? 'bg-green-600' : 'bg-slate-300'
              }`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                formData.status ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-lg font-bold text-black hover:bg-slate-100 transition-all"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-2.5 rounded-lg font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Tag size={16} />
                  {isEdit ? 'Update Coupon' : 'Save Coupon'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}