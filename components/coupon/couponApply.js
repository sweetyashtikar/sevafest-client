// components/checkout/CouponApply.jsx
import { useState } from 'react';
import { checkoutService } from '@/API/couponAPI';

export default function CouponApply({ cartTotal, onCouponApplied }) {
    const [couponCode, setCouponCode] = useState('');
    const [applying, setApplying] = useState(false);
    const [error, setError] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) {
            setError('Please enter a coupon code');
            return;
        }

        setApplying(true);
        setError('');

        try {
            const response = await checkoutService.validateCoupon(couponCode, cartTotal);
            
            setAppliedCoupon({
                code: response.data.couponCode,
                discount: response.data.discountAmount,
                finalAmount: response.data.finalAmount
            });

            onCouponApplied({
                code: response.data.couponCode,
                discount: response.data.discountAmount
            });

        } catch (err) {
            console.log("error apply coupon", err)
            setError(err.message || 'Invalid coupon code');
            setAppliedCoupon(null);
            onCouponApplied(null);
        } finally {
            setApplying(false);
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode('');
        onCouponApplied(null);
    };

    return (
        <div className="bg-white rounded-xl p-4 border border-slate-200">
            <h3 className="font-bold text-black mb-3">Apply Coupon</h3>
            
            {!appliedCoupon ? (
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Enter coupon code"
                        className="flex-1 border border-slate-200 px-3 py-2 rounded-lg text-black"
                    />
                    <button
                        onClick={handleApplyCoupon}
                        disabled={applying}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        {applying ? 'Applying...' : 'Apply'}
                    </button>
                </div>
            ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="font-bold text-green-700">{appliedCoupon.code}</span>
                            <p className="text-sm text-green-600 mt-1">
                                Discount: ₹{appliedCoupon.discount}
                            </p>
                        </div>
                        <button
                            onClick={handleRemoveCoupon}
                            className="text-red-600 hover:text-red-700 text-sm"
                        >
                            Remove
                        </button>
                    </div>
                </div>
            )}

            {error && (
                <p className="text-red-600 text-sm mt-2">{error}</p>
            )}
        </div>
    );
}