"use client";
import React from "react";
import Image from "next/image";
import { useEffect, useState, useMemo, useCallback } from "react";
import { apiClient } from "@/services/apiClient";
import { User, Mail, Phone, MapPin, Edit3 } from "lucide-react";
import SimpleTezPaymentButton from "@/components/tez/tezPaymentButton";
import { useSelector } from "react-redux";
import AddressModal from "@/components/address/addressModal";

const CheckoutPage = () => {
  const [cartData, setCartData] = useState(null);
  const [profile, setProfile] = useState(null);
  const [address, setAddress] = useState(null);
   const [selectedAddress, setSelectedAddress] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [orderId, setOrderId] = useState(null);
    const { user } = useSelector((a) => a.auth);
    console.log("user", user?.id)
  


  // ================= API CALLS =================
  const fetchCheckoutData = useCallback(async () => {
    if (!user?.id) return;
    try {
      setLoading(true);

      const [cartRes, profileRes, addressRes] = await Promise.all([
        apiClient("/viewCart"),
        apiClient("/users/profile/me"),
        apiClient(`/address/user/${user.id}`),
      ]);

      if (cartRes?.success) {
        setCartData(cartRes.data);

        // Generate order ID based on cart
        const timestamp = Date.now();
        const randomNum = Math.floor(Math.random() * 10000);
        setOrderId(`ORD_${timestamp}_${randomNum}`);
      }

      

      if (profileRes?.success) {
        setProfile(profileRes.data);
      }
       if (addressRes?.success) {
        setAddress(addressRes.data);
      }
    } catch (err) {
      console.error("Checkout fetch failed", err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchCheckoutData();
  }, [fetchCheckoutData]);

  // Handle address change
  const handleAddressChange = (address) => {
    setSelectedAddress(address);
    console.log("Selected address:", address);
    // You can update delivery charges, etc. here
  };

  // ================= MEMOIZED DATA =================
  const items = useMemo(() => cartData?.items || [], [cartData]);
  const summary = useMemo(() => cartData?.summary || {}, [cartData]);

   // Function to generate payment URL via backend
     const getPaymentUrl = async () => {
        console.log("orderId", orderId)
      console.log("summary?.finalTotal", summary?.finalTotal)
        console.log("profile?.mobile", profile?.mobile)
    try {
      if (!orderId || !summary?.finalTotal || !profile?.mobile) {
        console.error("Missing required data for payment");
        return null;
      }

      const response = await apiClient("/payments/generate-payment-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_id: orderId,
          amount: summary.finalTotal,
          customer_mobile: profile.mobile,
          customer_email: profile.email,
          customer_name: profile.username,
          return_url: `${window.location.origin}/payment/success`,
          cancel_url: `${window.location.origin}/payment/cancel`,
        }),
      });

      const data = await response.json();
      
      if (data.success && data.data?.payment_url) {
        return data.data.payment_url;
      } else {
        console.error("Failed to generate payment URL:", data.message);
        return null;
      }
    } catch (error) {
      console.error("Error generating payment URL:", error);
      return null;
    }
  };
  // ================= LOADING =================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin h-10 w-10 border-4 border-gray-300 border-t-black rounded-full" />
      </div>
    );
  }

  // ================= UI =================
  return (
    <div className="min-h-screen py-8 bg-white text-black">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 px-4">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
            <Delivery 
            profile={profile} 
            address={address} 
            onAddressChange={handleAddressChange}
          />
             {/* <Payment 
            summary={summary}
            profile={profile}
            orderId={orderId}
               selectedAddress={selectedAddress}
            getPaymentUrl={getPaymentUrl}
          /> */}
          <ReviewItems items={items} />
        </div>
      <OrderPlace summary={summary} orderId={orderId} selectedAddress={selectedAddress}  />
      </div>
    </div>
  );
};

export default CheckoutPage;

// const Delivery = React.memo(({ profile , address}) => {
//   console.log("address", address)
//   const defaultAddress = useMemo(() => {
//     if (!Array.isArray(address)) return null;
//     return address.find((addr) => addr.is_default) || address[0];
//   }, [address]);
//   return (
//     <section className="bg-white rounded-lg p-5 shadow">
//       <h2 className="text-lg font-semibold mb-4">1. Delivery Address</h2>

//       <div className="border rounded p-4 space-y-2">
//         {/* Username */}
//         <div className="flex items-center gap-2">
//           <User size={16} className="text-blue-600" />
//           <p className="font-medium text-black">
//             {profile?.username || "User"}
//           </p>
//         </div>

//         {/* Email */}
//         <div className="flex items-center gap-2">
//           <Mail size={16} className="text-gray-600" />
//           <p className="text-sm text-black">{profile?.email}</p>
//         </div>

//         {/* Phone */}
//         <div className="flex items-center gap-2">
//           <Phone size={16} className="text-green-600" />
//           <p className="text-sm text-black">{profile?.mobile || "N/A"}</p>
//         </div>

//         {/* Zipcodes / Address */}
//         {/* <div className="flex items-start gap-2">
//           <MapPin size={16} className="text-red-600 mt-0.5" />
//           {profile?.zipcodes?.length > 0 ? (
//             <p className="text-sm text-black">
//               Serviceable Areas: {profile.zipcodes.join(", ")}
//             </p>
//           ) : (
//             <p className="text-sm text-gray-500">Address not added yet</p>
//           )}
//         </div> */}

//           {/* Serviceable status */}
//         {address.addresses[0].serviceable? (
//           <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
//             <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
//             Delivery available at this address
//           </p>
//         ) : (
//           <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
//             <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
//             Delivery not available at this address
//           </p>
//         )}


// {/* Other saved addresses (if any) */}
//    {address?.addresses.length > 1 && (
//         <div className="mt-3 px-1">
//           <p className="text-xs text-gray-500">
//             +{address.length - 1} more saved addresses
//           </p>
//         </div>
//       )}

//         {/* Change button */}
//        <button className="mt-3 inline-flex items-center gap-2 text-blue-600 text-sm font-medium hover:underline">
//           <Edit3 size={14} />
//           {address ? "Change Address" : "Add Address"}
//         </button>
//       </div>

//     </section>
//   );
// });


const Delivery = React.memo(({ profile, address, onAddressChange }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  
  // Get addresses array
  const addressesArray = address?.addresses || [];
  
  // Initialize selected address
  useEffect(() => {
    if (!selectedAddress && addressesArray.length > 0) {
      const defaultAddr = addressesArray.find(addr => addr.is_default === true) || addressesArray[0];
      setSelectedAddress(defaultAddr);
      
      // Notify parent component
      if (onAddressChange) {
        onAddressChange(defaultAddr);
      }
    }
  }, [addressesArray, selectedAddress, onAddressChange]);

  const handleAddressSelect = (addr) => {
    setSelectedAddress(addr);
    if (onAddressChange) {
      onAddressChange(addr);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  if (!selectedAddress) {
    return (
      <section className="bg-white rounded-lg p-5 shadow">
        <h2 className="text-lg font-semibold mb-4 text-black border-b pb-2">
          1. Delivery Address
        </h2>
        <div className="text-center py-6 border-2 border-dashed rounded-lg">
          <MapPin size={24} className="mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-500 mb-2">No delivery address found</p>
          <button 
            onClick={openModal}
            className="text-blue-600 text-sm font-semibold hover:underline"
          >
            + Add New Address
          </button>
        </div>

        {/* Address Modal */}
        <AddressModal 
          isOpen={isModalOpen}
          onClose={closeModal}
          addresses={addressesArray}
          onSelectAddress={handleAddressSelect}
          selectedAddressId={selectedAddress?._id}
        />
      </section>
    );
  }

  return (
    <section className="bg-white rounded-lg p-5 shadow">
      <div className="flex items-center justify-between mb-4 border-b pb-2">
        <h2 className="text-lg font-semibold text-black">
          1. Delivery Address
        </h2>
        <button 
          onClick={openModal}
          className="flex items-center gap-1 text-blue-600 text-sm font-semibold hover:text-blue-800 transition-colors"
        >
          <Edit3 size={14} />
          Change
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex items-start gap-3">
          {/* Map Icon */}
          <MapPin size={20} className="text-red-500 mt-1 flex-shrink-0" />
          
          <div className="flex-1">
            {/* Header: Name and Type Badge */}
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <p className="font-bold text-black">{selectedAddress.name}</p>
              <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-bold uppercase">
                {selectedAddress.type || 'Home'}
              </span>
              {selectedAddress.is_default && (
                <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-medium">
                  DEFAULT
                </span>
              )}
            </div>

            {/* Address Body */}
            <div className="text-sm text-gray-800 leading-relaxed">
              <p className="font-medium">{selectedAddress.address}</p>
              
              {selectedAddress.landmark && (
                <p className="text-gray-600">Landmark: {selectedAddress.landmark}</p>
              )}
              
              <p>
                {selectedAddress.area_id?.name && `${selectedAddress.area_id.name}, `}
                {selectedAddress.city_id?.name && `${selectedAddress.city_id.name}, `}
                {selectedAddress.state} - <span className="font-semibold">{selectedAddress.pincode}</span>
              </p>

              <p className="text-gray-500">{selectedAddress.country}</p>

              {/* Contact Info */}
              <div className="mt-2 flex items-center gap-4 text-xs text-gray-600">
                <span className="flex items-center gap-1">
                  <Phone size={12} /> {selectedAddress.mobile}
                </span>
                {selectedAddress.alternate_mobile && (
                  <span className="flex items-center gap-1">
                    <Phone size={12} /> Alt: {selectedAddress.alternate_mobile}
                  </span>
                )}
              </div>
            </div>

            {/* Serviceability Badge */}
            <div className="mt-3">
              {selectedAddress.serviceable ? (
                <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-green-50 rounded text-green-700 text-xs font-medium">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  Delivery available at this address
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-red-50 rounded text-red-700 text-xs font-medium">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                  Delivery not available here
                </div>
              )}
            </div>

            {/* Delivery Charges Info */}
            {selectedAddress.delivery_info && (
              <div className="mt-2 text-xs text-gray-500">
                Delivery charges: ₹{selectedAddress.delivery_info.charges} • 
                Free delivery on orders above ₹{selectedAddress.delivery_info.minimum_free_delivery}
              </div>
            )}
          </div>
        </div>

        {/* Other addresses quick link */}
        {addressesArray.length > 1 && (
          <div className="pt-2 ml-8">
            <button 
              onClick={openModal}
              className="text-gray-500 text-xs hover:text-gray-700 flex items-center gap-1"
            >
              <span>+ {addressesArray.length - 1} other address{addressesArray.length - 1 > 1 ? 'es' : ''}</span>
            </button>
          </div>
        )}
      </div>

      {/* Address Modal */}
      <AddressModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        addresses={addressesArray}
        onSelectAddress={handleAddressSelect}
        selectedAddressId={selectedAddress?._id}
      />
    </section>
  );
});
const Payment = React.memo(({summary, profile, orderId ,getPaymentUrl}) => {
  console.log("summary", summary)
    const [selectedPayment, setSelectedPayment] = useState("tez");
    const [paymentUrl, setPaymentUrl] = useState(null);
  const [isGeneratingUrl, setIsGeneratingUrl] = useState(false);


 
  // Generate payment URL when Tez is selected
  useEffect(() => {
    const generateUrl = async () => {
      if (selectedPayment === "tez" && !paymentUrl && !isGeneratingUrl) {
        setIsGeneratingUrl(true);
        try {
          const url = await getPaymentUrl();
          setPaymentUrl(url);
        } catch (error) {
          console.error("Failed to generate payment URL:", error);
          setPaymentUrl(null);
        } finally {
          setIsGeneratingUrl(false);
        }
      }
    };
    
    generateUrl();
  }, [selectedPayment]); // Only depend on selectedPayment

  const handlePaymentChange = (value) => {
    setSelectedPayment(value);
    // Reset payment URL if switching away from Tez
    if (value !== "tez") {
      setPaymentUrl(null);
    }
  };

  return (
    <section className="bg-white rounded-lg p-5 shadow">
      <h2 className="text-lg font-semibold mb-4">2. Payment Method</h2>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
        <label className="flex items-center gap-3 cursor-pointer">
        <input
              type="radio"
              name="payment"
              value="tez"
              checked={selectedPayment === "tez"}
         onChange={(e) => handlePaymentChange(e.target.value)}
              className="h-4 w-4"
            />      
                <span>QR code (Tez)
          </span>
          </label>
           {selectedPayment === "tez" && (
            <div className="text-sm text-gray-600">
              {isGeneratingUrl ? (
                <span className="animate-pulse">Generating payment...</span>
              ) : paymentUrl ? (
                <span className="text-green-600">Ready to pay</span>
              ) : (
                <span className="text-red-600">Payment not available</span>
              )}
            </div>
          )}
          </div>
                {selectedPayment === "tez" && paymentUrl && (
          <div className="ml-7 mt-2 p-3 bg-blue-50 rounded">
            <p className="text-sm text-gray-600 mb-2">
              Order ID: <span className="font-medium">{orderId}</span>
            </p>
            <SimpleTezPaymentButton 
              paymentUrl={paymentUrl}
              disabled={isGeneratingUrl}
            />
          </div>
        )}

    

    <label className="flex items-center gap-3 cursor-pointer">
          <input 
            type="radio" 
            name="payment" 
            value="cod" 
            checked={selectedPayment === "cod"}
            onChange={(e) => handlePaymentChange(e.target.value)}
            className="h-4 w-4"
          />
          <span>Cash on Delivery</span>
        </label>

    <label className="flex items-center gap-3 cursor-pointer">
          <input 
            type="radio" 
            name="payment" 
            value="upi" 
            checked={selectedPayment === "upi"}
            onChange={(e) => handlePaymentChange(e.target.value)}
            className="h-4 w-4"
          />
          <span>UPI (Google Pay, PhonePe, Paytm)</span>
        </label>


         <label className="flex items-center gap-3 cursor-pointer">
          <input 
            type="radio" 
            name="payment" 
            value="card" 
            checked={selectedPayment === "card"}
            onChange={(e) => handlePaymentChange(e.target.value)}
            className="h-4 w-4"
          />
          <span>Credit / Debit Card</span>
        </label>

  <label className="flex items-center gap-3 cursor-pointer">
          <input 
            type="radio" 
            name="payment" 
            value="netbanking" 
            checked={selectedPayment === "netbanking"}
            onChange={(e) => handlePaymentChange(e.target.value)}
            className="h-4 w-4"
          />
          <span>Net Banking</span>
        </label>
      </div>
    </section>
  );
});

const ReviewItems = React.memo(({ items }) => {
  console.log('items', items)
  return (
    <section className="bg-white rounded-lg p-5 shadow">
      <h2 className="text-lg font-semibold mb-4">3. Review Items</h2>

      {items.map((item) => (
        <div key={item._id} className="flex gap-4 border-b pb-4 mb-4">
          <Image
            src={item.product.mainImages}
            alt={item.product.name}
            width={120}
            height={120}
            className="rounded"
          />

          <div className="flex-1">
            <p className="font-medium">{item.product.name}</p>

            <p className="text-sm">Qty: {item.qty}</p>

            {item.inStock ? (
              <p className="text-green-600 text-sm">In Stock</p>
            ) : (
              <p className="text-red-600 text-sm">Out of Stock</p>
            )}
          </div>

          <div className="text-right">
            <p className="font-semibold">₹{item.itemTotal}</p>
          </div>
        </div>
      ))}
    </section>
  );
});

const OrderPlace = React.memo(({ summary, orderId  }) => {
    const handlePlaceOrder = () => {
    // Here you would implement the actual order placement logic
    // This should create an order in your backend
    console.log("Placing order with ID:", orderId);
    alert(`Order ${orderId} placed successfully!`);
    // Redirect to order confirmation page
    // window.location.href = `/order-confirmation/${orderId}`;
  };
  return (
    <div className="bg-white rounded-lg p-5 shadow h-fit">
      <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Items ({summary.itemsCount})</span>
          <span>₹{summary.totalPrice}</span>
        </div>

        <div className="flex justify-between">
          <span>Discount</span>
          <span>- ₹{summary.totalDiscount}</span>
        </div>

        <div className="flex justify-between">
          <span>Delivery</span>
          <span>₹{summary.deliveryCharge}</span>
        </div>

        <hr />

        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>₹{summary.finalTotal}</span>
        </div>
      </div>

      <button className="w-full mt-4 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 rounded">
        Place Order
      </button>
    </div>
  );
});
