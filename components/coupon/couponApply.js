// components/checkout/CouponApply.jsx
import { useState, useEffect } from 'react';
import { checkoutService } from '@/API/couponAPI';

export default function CouponApply({ cartTotal, onCouponApplied }) {
    const [couponCode, setCouponCode] = useState('');
    const [applying, setApplying] = useState(false);
    const [error, setError] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);

    // ✅ FIX: cart total बदलल्यावर applied coupon reset करा — stale discount टाळतो
    useEffect(() => {
        if (appliedCoupon) {
            handleRemoveCoupon();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cartTotal]);

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) {
            setError('Please enter a coupon code');
            return;
        }

        setApplying(true);
        setError('');

        try {
            const response = await checkoutService.validateCoupon(couponCode.trim(), cartTotal);

            setAppliedCoupon({
                code: response.data.couponCode,
                discount: response.data.discountAmount,
                finalAmount: response.data.finalAmount,
                discountType: response.data.discountType,
                couponValue: response.data.couponValue,
            });

            onCouponApplied({
                code: response.data.couponCode,
                discount: response.data.discountAmount,
            });

        } catch (err) {
            // ✅ FIX: proper axios error message
            const msg = err?.response?.data?.message || err.message || 'Invalid coupon code';
            setError(msg);
            setAppliedCoupon(null);
            onCouponApplied(null);
        } finally {
            setApplying(false);
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode('');
        setError('');
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
                        onChange={(e) => {
                            setCouponCode(e.target.value.toUpperCase());
                            setError(''); // ✅ FIX: typing करताना error clear होतो
                        }}
                        // ✅ FIX: Enter key ने apply होतो
                        onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                        placeholder="Enter coupon code"
                        className="flex-1 border border-slate-200 px-3 py-2 rounded-lg text-black outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
                        disabled={applying}
                    />
                    <button
                        onClick={handleApplyCoupon}
                        disabled={applying || !couponCode.trim()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                                You save: ₹{appliedCoupon.discount}
                            </p>
                            <p className="text-xs text-green-500 mt-0.5">
                                Final amount: ₹{appliedCoupon.finalAmount}
                            </p>
                        </div>
                        <button
                            onClick={handleRemoveCoupon}
                            className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
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