"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  ShoppingCart,
  Star,
  Heart,
  Share2,
  MapPin,
  Truck,
  RotateCcw,
  Shield,
  ChevronRight,
  Minus,
  Plus,
} from "lucide-react";
import { apiClient } from "@/services/apiClient";

export default function Page() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await apiClient(`/product/${id}`);
      if (res?.success) {
        setProduct(res.data.product);
        setSelectedImage(res.data.product.mainImage);
      }
    } catch (err) {
      console.error("Product fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  const addToCart = async (qty = 1) => {
    try {
      const res = await apiClient("/viewCart/addtoCart", {
        method: "POST",
        body: {
          productId: product._id,
          qty: quantity,
        },
      });

      if (res?.success) {
        console.log("Added to cart");
        return true;
      }
    } catch (err) {
      console.error("Add to cart failed", err);
    }
    return false;
  };

  const handleBuyNow = async () => {
    const ok = await addToCart(quantity);
    if (ok) {
      window.location.href = "/checkout";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-white">
        <div className="animate-spin h-12 w-12 border-4 border-gray-200 border-t-orange-500 rounded-full"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-white">
        {/* Icon */}
        <div className="mb-4">
          <svg
            className="w-16 h-16 text-black"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m0 3h.008M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Text */}
        <p className="text-xl font-semibold text-black">Product not found</p>
        <p className="text-sm text-black/70 mt-1">
          The product you are looking for does not exist or was removed.
        </p>
      </div>
    );
  }

  const allImages = [product.mainImage, ...(product.otherImages || [])];
  const savingsPercent = product.discountPercentage;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="px-4 py-3 text-sm flex items-center gap-2 text-gray-600 border-b">
          <span className="hover:text-orange-600 cursor-pointer">Home</span>
          <ChevronRight size={14} />
          <span className="hover:text-orange-600 cursor-pointer">
            {product.categoryId?.name}
          </span>
          <ChevronRight size={14} />
          <span className="text-gray-900">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6">
          {/* LEFT: Image Gallery - 5 columns */}
          <div className="lg:col-span-5">
            <div className="sticky top-4">
              {/* Main Image */}
              <div className="border rounded-lg p-4 mb-4 bg-white relative">
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="w-full h-[500px] object-contain"
                />
                {savingsPercent > 0 && (
                  <div className="absolute top-6 left-6 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                    -{savingsPercent}%
                  </div>
                )}
                <div className="absolute top-6 right-6 flex gap-2">
                  <button className="p-2 bg-white border rounded-full hover:bg-gray-50 shadow">
                    <Share2 size={18} className="text-gray-700" />
                  </button>
                  <button className="p-2 bg-white border rounded-full hover:bg-gray-50 shadow">
                    <Heart size={18} className="text-gray-700" />
                  </button>
                </div>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-2 overflow-x-auto">
                {allImages.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-16 object-cover border rounded cursor-pointer flex-shrink-0 ${
                      selectedImage === img
                        ? "border-orange-500 border-2"
                        : "border-gray-300"
                    }`}
                  />
                ))}
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-4 mt-8">
                <span className="text-sm font-medium text-black">Quantity</span>

                <div className="flex items-center border border-gray-300 rounded-full overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-black disabled:opacity-50"
                    disabled={quantity === 1}
                  >
                    <Minus size={16} />
                  </button>

                  <span className="w-12 text-center font-semibold text-black">
                    {quantity}
                  </span>

                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-black"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                <button
                  onClick={() => addToCart(quantity)}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 py-3 rounded-full 
                  font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => addToCart(quantity)}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-full font-medium
                   disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: Product Details - 7 columns */}
          <div className="lg:col-span-7">
            {/* Brand */}
            <div className="mb-2">
              <span className="text-sm text-blue-600 hover:text-orange-600 hover:underline cursor-pointer">
                Visit the {product.brand} Store
              </span>
            </div>

            {/* Product Title */}
            <h1 className="text-2xl font-normal text-gray-900 mb-3">
              {product.name}
            </h1>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                <span className="text-orange-500 font-medium">
                  {product.rating?.average || 0}
                </span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={`${
                        i < Math.floor(product.rating?.average || 0)
                          ? "fill-orange-400 text-orange-400"
                          : "fill-gray-300 text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <span className="text-sm text-blue-600 hover:text-orange-600 cursor-pointer">
                {product.rating?.count || 0} ratings
              </span>
              <span className="text-gray-300">|</span>
              <span className="text-sm text-gray-600">
                {product.views} views
              </span>
            </div>

            <div className="border-t border-b py-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-red-600 text-sm font-medium">
                  Limited time deal
                </span>
              </div>
            </div>

            {/* Price Section */}
            <div className="mb-4">
              <div className="flex items-baseline gap-3">
                <span className="text-sm text-gray-700">
                  -{product.discountPercentage}%
                </span>
                <span className="text-3xl text-gray-900">
                  ₹{product.effectivePrice}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-900">M.R.P.:</span>
                <span className="text-sm text-gray-900 line-through">
                  ₹{product.simpleProduct?.sp_price}
                </span>
              </div>
              {!product.isPricesInclusiveTax && (
                <p className="text-xs text-gray-900 mt-1">
                  Inclusive of all taxes
                </p>
              )}
            </div>

            {/* EMI Option */}
            <div className="bg-gray-50 border border-gray-200 rounded p-3 mb-4">
              <div className="text-sm">
                <span className="font-medium">EMI</span> starts at ₹
                {Math.round(product.effectivePrice / 12)}. No Cost EMI available{" "}
                <a
                  href="#"
                  className="text-blue-600 hover:text-orange-600 hover:underline"
                >
                  EMI options
                </a>
              </div>
            </div>

            <hr className="my-4" />

            {/* Product Details Table */}
            <div className="space-y-2 mb-6">
              <DetailRow label="Brand" value={product.brand} />
              <DetailRow
                label="Item Weight"
                value={`${product.dimensions?.weight} kg`}
              />
              <DetailRow label="HSN Code" value={product.hsnCode} />
              <DetailRow label="Made In" value={product.madeIn} />
            </div>

            <hr className="my-4" />

            {/* About this item */}
            <div className="mb-6">
              <h2 className="font-bold text-lg mb-3 text-black">
                About this item
              </h2>
              <ul className="space-y-2 text-black">
                <li>{product.shortDescription}</li>

                {product.extraDescription && (
                  <li>{product.extraDescription}</li>
                )}

                {product.codAllowed && <li>Cash on Delivery available</li>}

                {product.warrantyPeriod && (
                  <li>Warranty: {product.warrantyPeriod}</li>
                )}
              </ul>
            </div>

            <hr className="my-4" />

            <div className="space-y-4">
              <div className="flex gap-3">
                <MapPin className="text-gray-600 flex-shrink-0" size={20} />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-black">
                      Deliver to
                    </span>
                    <span className="text-sm text-gray-600 text-black">
                      Chennai 600001
                    </span>
                    <button className="text-xs text-blue-600 hover:text-orange-600 hover:underline text-black">
                      Change
                    </button>
                  </div>
                  {product.inStock ? (
                    <p className="text-green-700 font-medium">In stock</p>
                  ) : (
                    <p className="text-red-700 font-medium">
                      Currently unavailable
                    </p>
                  )}
                </div>
              </div>

              {product.inStock && (
                <div className="flex gap-3 items-start">
                  <Truck className="text-blue-600 flex-shrink-0" size={20} />
                  <div>
                    <p className="text-sm">
                      <span className="text-blue-600 font-medium">
                        FREE delivery
                      </span>{" "}
                      <span className="font-medium text-black">
                        Tomorrow, 8 AM - 12 PM
                      </span>
                    </p>
                    <p className="text-xs text-gray-900 mt-0.5">
                      Order within 4 hrs 23 mins.{" "}
                      <a
                        href="#"
                        className="text-blue-600 hover:text-orange-600 hover:underline"
                      >
                        Details
                      </a>
                    </p>
                  </div>
                </div>
              )}

              {product.isReturnable && (
                <div className="flex gap-3 items-start">
                  <RotateCcw
                    className="text-gray-600 flex-shrink-0"
                    size={20}
                  />
                  <div>
                    <p className="text-sm">
                      <span className="font-medium text-black">
                        Free Returns
                      </span>
                    </p>
                    <p className="text-xs text-gray-900">
                      Return this item for free within 30 days of delivery
                    </p>
                  </div>
                </div>
              )}

              {product.warrantyPeriod && (
                <div className="flex gap-3 items-start">
                  <Shield className="text-gray-900 flex-shrink-0" size={20} />
                  <div>
                    <p className="text-sm">
                      <span className="font-medium text-black">Warranty:</span>{" "}
                      {product.warrantyPeriod}
                    </p>
                  </div>
                </div>
              )}

              {/* Secure Transaction */}
              <div className="flex gap-3 items-start">
                <Shield className="text-gray-900 flex-shrink-0" size={20} />
                <div>
                  <p className="text-sm text-blue-600 hover:text-orange-600 cursor-pointer hover:underline">
                    Secure transaction
                  </p>
                </div>
              </div>
            </div>

            <hr className="my-4" />

            {product.attributeValues?.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-medium mb-2">
                  Colour:{" "}
                  <span className="font-normal">
                    {product.attributeValues[0].value}
                  </span>
                </p>
                <div className="flex gap-2">
                  {product.attributeValues.map((attr) => (
                    <button
                      key={attr._id}
                      className="border-2 border-gray-300 hover:border-orange-500 rounded p-1 w-12 h-12"
                    >
                      <div
                        className="w-full h-full rounded"
                        style={{ backgroundColor: attr.swatche_value }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-gray-50 border rounded p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm mt-1">
                    <span className="text-gray-600">Sold by</span>{" "}
                    <span className="text-blue-600 hover:text-orange-600 cursor-pointer hover:underline">
                      {product.vendorId?.username}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {product.description && (
          <div className="px-6 pb-8">
            <div className="border-t pt-6">
              <h2 className="text-2xl font-bold mb-4 text-black">
                Product Description
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>
        )}

        <div className="px-6 pb-8">
          <div className="border-t pt-6">
            <h2 className="text-2xl font-bold mb-4 text-black">
              Product details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3">
              <DetailRow
                label="Product Dimensions"
                value={`${product.dimensions?.length} x ${product.dimensions?.breadth} x ${product.dimensions?.height} cm; ${product.dimensions?.weight} Kilograms`}
              />
              <DetailRow
                label="Item Weight"
                value={`${product.dimensions?.weight} kg`}
              />
              <DetailRow label="Manufacturer" value={product.brand} />
              <DetailRow
                label="Item model number"
                value={product.simpleProduct?.sp_sku}
              />
              <DetailRow label="Country of Origin" value={product.madeIn} />
              <DetailRow label="HSN Code" value={product.hsnCode} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex py-2">
      <span className="text-sm font-medium text-gray-700 w-40 flex-shrink-0">
        {label}
      </span>
      <span className="text-sm text-gray-900">{value || "-"}</span>
    </div>
  );
}
