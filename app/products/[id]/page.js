"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
  Check,
  Info,
} from "lucide-react";
import { apiClient } from "@/services/apiClient";

// Constants
const DELIVERY_PINCODE = "600001";
const DELIVERY_CITY = "Chennai";

// Reusable Components
const LoadingSpinner = () => (
  <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
    <div className="text-center">
      <div className="relative">
        <div className="animate-spin h-20 w-20 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-6"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Package className="w-8 h-8 text-blue-600 animate-pulse" />
        </div>
      </div>
      <p className="text-gray-700 font-semibold text-lg">Loading product details...</p>
      <p className="text-gray-500 text-sm mt-1">Please wait a moment</p>
    </div>
  </div>
);

const ProductNotFound = () => {
  const router = useRouter();
  
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-red-50 via-white to-orange-50 px-4">
      <div className="text-center max-w-md bg-white rounded-2xl shadow-2xl p-10 border border-gray-100">
        <div className="mb-6">
          <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center mx-auto shadow-lg">
            <AlertCircle className="w-12 h-12 text-red-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Product Not Found
        </h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          The product you are looking for does not exist or has been removed from our catalog.
        </p>
        <button
          onClick={() => router.push("/products")}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 inline-flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <ChevronRight className="rotate-180" size={20} />
          Back to Products
        </button>
      </div>
    </div>
  );
};

const Breadcrumb = ({ items }) => (
  <div className="bg-white border-b border-gray-200 shadow-sm">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center gap-2 text-sm flex-wrap">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2 animate-fadeIn">
            {index > 0 && <ChevronRight size={14} className="text-gray-400" />}
            <span
              className={`${
                index === items.length - 1
                  ? "text-gray-900 font-bold"
                  : "text-blue-600 hover:text-orange-600 cursor-pointer transition-all duration-200 hover:underline font-medium"
              }`}
            >
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const RatingStars = ({ rating, size = 16, showCount = false, count = 0 }) => (
  <div className="flex items-center gap-2">
    <div className="flex items-center gap-1">
      <span className="text-gray-900 font-bold text-base">
        {rating?.toFixed(1) || "0.0"}
      </span>
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={size}
            className={`transition-all duration-300 ${
              i < Math.floor(rating || 0)
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
      </div>
    </div>
    {showCount && (
      <span className="text-sm text-blue-600 hover:text-orange-600 cursor-pointer hover:underline font-medium transition-colors">
        {count} ratings
      </span>
    )}
  </div>
);

const ImageGallery = ({ images, selectedImage, onSelectImage, discount }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Main Image */}
      <div className="relative bg-white border-2 border-gray-200 rounded-2xl p-6 overflow-hidden group shadow-md hover:shadow-2xl transition-all duration-500">
        {!imageError ? (
          <img
            src={selectedImage}
            alt="Product"
            onError={() => setImageError(true)}
            className="w-full h-[500px] object-contain transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-[500px] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center rounded-xl">
            <Package className="w-20 h-20 text-gray-400" />
          </div>
        )}

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-6 left-6 bg-gradient-to-r from-red-600 to-red-700 text-white text-sm font-bold px-4 py-2 rounded-lg shadow-xl animate-pulse">
            <Zap className="inline w-4 h-4 mr-1" />
            {discount}% OFF
          </div>
        )}

        {/* Action Buttons */}
        <div className="absolute top-6 right-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <button
            className="p-3 bg-white border-2 border-gray-200 rounded-full hover:bg-blue-50 hover:border-blue-300 shadow-lg transition-all duration-300 transform hover:scale-110"
            aria-label="Share product"
          >
            <Share2 size={18} className="text-gray-700 hover:text-blue-600 transition-colors" />
          </button>
          <button
            className="p-3 bg-white border-2 border-gray-200 rounded-full hover:bg-red-50 hover:border-red-300 shadow-lg transition-all duration-300 transform hover:scale-110"
            aria-label="Add to wishlist"
          >
            <Heart size={18} className="text-gray-700 hover:fill-red-500 hover:text-red-500 transition-colors" />
          </button>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => {
              onSelectImage(img);
              setImageError(false);
            }}
            className={`flex-shrink-0 w-20 h-20 border-3 rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-110 ${
              selectedImage === img
                ? "border-blue-600 ring-4 ring-blue-200 shadow-lg"
                : "border-gray-300 hover:border-blue-400 shadow-md"
            }`}
          >
            <img
              src={img}
              alt={`Thumbnail ${i + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

const QuantitySelector = ({ quantity, setQuantity, maxQuantity = 10 }) => (
  <div className="flex items-center gap-4 bg-white border-2 border-gray-200 rounded-xl p-4 shadow-sm">
    <span className="text-sm font-bold text-gray-900">Quantity:</span>
    <div className="flex items-center border-2 border-blue-300 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md">
      <button
        onClick={() => setQuantity(Math.max(1, quantity - 1))}
        disabled={quantity <= 1}
        className="px-4 py-2 hover:bg-blue-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 rounded-l-lg"
        aria-label="Decrease quantity"
      >
        <Minus size={18} className="text-blue-700 font-bold" />
      </button>
      <span className="px-6 py-2 text-gray-900 font-bold text-lg min-w-[4rem] text-center border-x-2 border-blue-300 bg-white">
        {quantity}
      </span>
      <button
        onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
        disabled={quantity >= maxQuantity}
        className="px-4 py-2 hover:bg-blue-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 rounded-r-lg"
        aria-label="Increase quantity"
      >
        <Plus size={18} className="text-blue-700 font-bold" />
      </button>
    </div>
    <span className="text-xs text-gray-600 font-semibold bg-gray-100 px-3 py-1 rounded-full">
      Max: {maxQuantity}
    </span>
  </div>
);

const PriceSection = ({ product }) => {
  const originalPrice = product.simpleProduct?.sp_price || 0;
  const effectivePrice = product.effectivePrice || 0;
  const discount = product.discountPercentage || 0;
  const savings = originalPrice - effectivePrice;

  return (
    <div className="bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 border-2 border-blue-300 rounded-2xl p-6 mb-6 shadow-xl animate-fadeIn">
      <div className="flex items-baseline gap-4 mb-3">
        {discount > 0 && (
          <span className="text-sm font-bold text-white bg-gradient-to-r from-red-600 to-red-700 px-3 py-2 rounded-lg shadow-lg">
            -{discount}%
          </span>
        )}
        <span className="text-5xl font-black text-gray-900">
          ₹{effectivePrice.toLocaleString()}
        </span>
      </div>
      
      {discount > 0 && (
        <div className="flex items-center gap-4 mb-3">
          <span className="text-sm text-gray-700 font-semibold">M.R.P.:</span>
          <span className="text-xl text-gray-600 line-through font-medium">
            ₹{originalPrice.toLocaleString()}
          </span>
          <span className="text-base font-bold text-green-700 bg-green-100 px-3 py-1 rounded-lg">
            Save ₹{savings.toLocaleString()}
          </span>
        </div>
      )}
      
      <p className="text-xs text-gray-700 font-semibold bg-white px-3 py-1 rounded-full inline-block">
        Inclusive of all taxes
      </p>
    </div>
  );
};

const InfoCard = ({ icon: Icon, title, description, color = "blue" }) => {
  const colorClasses = {
    blue: "from-blue-50 to-blue-100 border-blue-200 text-blue-700",
    green: "from-green-50 to-green-100 border-green-200 text-green-700",
    orange: "from-orange-50 to-orange-100 border-orange-200 text-orange-700",
    purple: "from-purple-50 to-purple-100 border-purple-200 text-purple-700",
  };

  return (
    <div className={`flex gap-4 items-start p-5 bg-gradient-to-br ${colorClasses[color]} rounded-xl border-2 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
      <div className="p-3 rounded-xl bg-white shadow-md">
        <Icon size={24} className="flex-shrink-0" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold text-gray-900 mb-1">{title}</p>
        <p className="text-xs text-gray-700 leading-relaxed font-medium">{description}</p>
      </div>
    </div>
  );
};

const DetailRow = ({ label, value }) => (
  <div className="flex py-3 border-b-2 border-gray-100 last:border-0 hover:bg-gray-50 transition-colors px-2 rounded">
    <span className="text-sm font-bold text-gray-800 w-48 flex-shrink-0">
      {label}
    </span>
    <span className="text-sm text-gray-900 font-medium">{value || "—"}</span>
  </div>
);

const Badge = ({ children, variant = "default" }) => {
  const variants = {
    default: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 border-gray-300",
    success: "bg-gradient-to-r from-green-100 to-green-200 text-green-900 border-green-300",
    danger: "bg-gradient-to-r from-red-100 to-red-200 text-red-900 border-red-300",
    warning: "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-900 border-yellow-300",
    info: "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-900 border-blue-300",
  };

  return (
    <span
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border-2 ${variants[variant]} shadow-md`}
    >
      {children}
    </span>
  );
};

// Main Component
export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await apiClient(`/product/${id}`);
      
      if (res?.success) {
        setProduct(res.data.product);
        setSelectedImage(res.data.product.mainImage);
        if (res.data.product.attributeValues?.length > 0) {
          setSelectedColor(res.data.product.attributeValues[0]);
        }
      }
    } catch (err) {
      console.error("Product fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!product) {
    return <ProductNotFound />;
  }

  const allImages = [product.mainImage, ...(product.otherImages || [])];
  const discount = product.simpleProduct?.sp_price - product.effectivePrice;
  const savingsPercent = product.discountPercentage;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
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

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                <button
                  disabled={!product.inStock}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 py-3 rounded-full font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Add to Cart
                </button>
                <button
                  disabled={!product.inStock}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-full font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: Product Details - 7 columns */}
          <div className="lg:col-span-7 space-y-6">
            {/* Brand Link */}
            <div className="animate-fadeIn">
              <a
                href="#"
                className="text-base text-blue-600 hover:text-orange-600 hover:underline font-bold inline-flex items-center gap-2 transition-all duration-200"
              >
                Visit the {product.brand} Store
                <ChevronRight size={16} />
              </a>
            </div>

            {/* Product Title */}
            <h1 className="text-4xl font-black text-gray-900 leading-tight animate-fadeIn">
              {product.name}
            </h1>

            {/* Rating & Views */}
            <div className="flex items-center gap-6 flex-wrap animate-fadeIn">
              <RatingStars
                rating={product.rating?.average}
                showCount
                count={product.rating?.count}
              />
              <span className="text-gray-300 text-2xl font-thin">|</span>
              <div className="flex items-center gap-2 text-base text-gray-700 font-semibold bg-gray-100 px-4 py-2 rounded-full">
                <Clock size={16} />
                <span>{product.views || 0} views</span>
              </div>
            </div>

            {/* Limited Time Deal */}
            {product.discountPercentage > 0 && (
              <div className="animate-fadeIn">
                <Badge variant="danger">
                  <Zap size={14} className="animate-pulse" />
                  Limited time deal
                </Badge>
              </div>
            )}

            {/* Price Section */}
            <div className="mb-4">
              <div className="flex items-baseline gap-3">
                <span className="text-sm text-gray-700">
                  -{savingsPercent}%
                </span>
                <span className="text-3xl text-gray-900">
                  ₹{product.effectivePrice}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-600">M.R.P.:</span>
                <span className="text-sm text-gray-600 line-through">
                  ₹{product.simpleProduct?.sp_price}
                </span>
              </div>
              {!product.isPricesInclusiveTax && (
                <p className="text-xs text-gray-600 mt-1">
                  Inclusive of all taxes
                </p>
              )}
            </div>

            {/* EMI Option */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-5 shadow-lg">
              <div className="flex items-start gap-4">
                <Award className="text-purple-700 flex-shrink-0 mt-1" size={24} />
                <div className="text-sm text-gray-900">
                  <span className="font-bold">EMI</span> starts at <span className="font-bold text-purple-700">₹{Math.round(product.effectivePrice / 12)}/month</span>.{" "}
                  <a
                    href="#"
                    className="text-blue-600 hover:text-orange-600 hover:underline font-bold transition-colors"
                  >
                    View EMI options →
                  </a>
                </div>
              </div>
            </div>

            {/* Stock Status */}
            <div>
              {product.inStock ? (
                <Badge variant="success">
                  <Check size={16} />
                  In Stock - Ready to Ship
                </Badge>
              ) : (
                <Badge variant="danger">
                  <AlertCircle size={16} />
                  Currently Unavailable
                </Badge>
              )}
            </div>

            {/* Quantity Selector */}
            {product.inStock && (
              <QuantitySelector
                quantity={quantity}
                setQuantity={setQuantity}
                maxQuantity={product.stock || 10}
              />
            )}

            <hr className="my-8 border-2 border-gray-200" />

            {/* Product Details Table */}
            <div className="space-y-2 mb-6">
              <DetailRow label="Brand" value={product.brand} />
              <DetailRow
                label="Colour"
                value={product.attributeValues?.[0]?.value}
              />
              <DetailRow label="Material" value="100% Cotton" />
              <DetailRow
                label="Item Weight"
                value={`${product.dimensions?.weight} kg`}
              />
              <DetailRow label="HSN Code" value={product.hsnCode} />
              <DetailRow label="Made In" value={product.madeIn} />
            </div>

            <hr className="my-8 border-2 border-gray-200" />

            {/* About this item */}
            <div className="mb-6">
              <h2 className="font-bold text-lg mb-3">About this item</h2>
              <ul className="space-y-2">
                <li className="flex gap-2 text-sm">
                  <span className="text-gray-400 mt-1">•</span>
                  <span>{product.shortDescription}</span>
                </li>
                {product.extraDescription && (
                  <li className="flex gap-2 text-sm">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>{product.extraDescription}</span>
                  </li>
                )}
                {product.codAllowed && (
                  <li className="flex gap-2 text-sm">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>Cash on Delivery available</span>
                  </li>
                )}
                {product.warrantyPeriod && (
                  <li className="flex gap-2 text-sm">
                    <span className="text-gray-400 mt-1">•</span>
                    <span>Warranty: {product.warrantyPeriod}</span>
                  </li>
                )}
              </ul>
            </div>

            <hr className="my-4" />

            {/* Delivery & Returns */}
            <div className="space-y-4">
              {/* Delivery */}
              <div className="flex gap-3">
                <MapPin className="text-gray-600 flex-shrink-0" size={20} />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">Deliver to</span>
                    <span className="text-sm text-gray-600">
                      Chennai 600001
                    </span>
                    <button className="text-xs text-blue-600 hover:text-orange-600 hover:underline">
                      Change
                    </button>
                  </div>
                  {product.inStock ? (
                    <p className="text-green-700 font-medium text-sm">
                      In stock
                    </p>
                  ) : (
                    <p className="text-red-700 font-medium text-sm">
                      Currently unavailable
                    </p>
                  )}
                </div>
              </div>

              {/* Free Delivery */}
              {product.inStock && (
                <div className="flex gap-3 items-start">
                  <Truck className="text-blue-600 flex-shrink-0" size={20} />
                  <div>
                    <p className="text-sm">
                      <span className="text-blue-600 font-medium">
                        FREE delivery
                      </span>{" "}
                      <span className="font-medium">
                        Tomorrow, 8 AM - 12 PM
                      </span>
                    </p>
                    <p className="text-xs text-gray-600 mt-0.5">
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

              {/* Returns */}
              {product.isReturnable && (
                <div className="flex gap-3 items-start">
                  <RotateCcw
                    className="text-gray-600 flex-shrink-0"
                    size={20}
                  />
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">Free Returns</span>
                    </p>
                    <p className="text-xs text-gray-600">
                      Return this item for free within 30 days of delivery
                    </p>
                  </div>
                </div>
              )}

              {/* Warranty */}
              {product.warrantyPeriod && (
                <div className="flex gap-3 items-start">
                  <Shield className="text-gray-600 flex-shrink-0" size={20} />
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">Warranty:</span>{" "}
                      {product.warrantyPeriod}
                    </p>
                  </div>
                </div>
              )}

              {/* Secure Transaction */}
              <div className="flex gap-3 items-start">
                <Shield className="text-gray-600 flex-shrink-0" size={20} />
                <div>
                  <p className="text-sm text-blue-600 hover:text-orange-600 cursor-pointer hover:underline">
                    Secure transaction
                  </p>
                </div>
              </div>
            </div>

            <hr className="my-8 border-2 border-gray-200" />

            {product.attributeValues?.length > 0 && (
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-xl">
                <h3 className="text-lg font-black text-gray-900 mb-4">
                  Available Colors
                </h3>
                <div className="flex gap-4 flex-wrap">
                  {product.attributeValues.map((attr) => (
                    <button
                      key={attr._id}
                      onClick={() => setSelectedColor(attr)}
                      className={`relative group border-3 rounded-xl p-2 w-16 h-16 transition-all duration-300 transform hover:scale-110 ${
                        selectedColor?._id === attr._id
                          ? "border-blue-600 ring-4 ring-blue-200 shadow-xl"
                          : "border-gray-300 hover:border-blue-400 shadow-md"
                      }`}
                    >
                      <div
                        className="w-full h-full rounded-lg"
                        style={{ backgroundColor: attr.swatche_value }}
                      />
                      {selectedColor?._id === attr._id && (
                        <div className="absolute -top-2 -right-2 bg-blue-600 rounded-full p-1 shadow-lg">
                          <Check size={14} className="text-white font-bold" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                {selectedColor && (
                  <p className="text-sm text-gray-700 mt-4 font-bold bg-gray-100 px-4 py-2 rounded-lg inline-block">
                    Selected: <span className="text-blue-600">{selectedColor.value}</span>
                  </p>
                )}
              </div>
            )}

            {/* Sold by */}
            <div className="bg-gray-50 border rounded p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm">
                    <span className="text-gray-600">Ships from</span>{" "}
                    <span className="font-medium">Amazon</span>
                  </p>
                  <p className="text-sm mt-1">
                    <span className="text-gray-600">Sold by</span>{" "}
                    <span className="text-blue-600 hover:text-orange-600 cursor-pointer hover:underline">
                      {product.vendorId?.username}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile Action Buttons */}
            <div className="space-y-4 lg:hidden">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 py-4 rounded-xl font-bold text-lg disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center justify-center gap-3"
              >
                <ShoppingCart size={24} />
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                disabled={!product.inStock}
                className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white py-4 rounded-xl font-bold text-lg disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* Product Description Section */}
        {product.description && (
          <div className="px-6 pb-8">
            <div className="border-t pt-6">
              <h2 className="text-2xl font-bold mb-4">Product Description</h2>
              <p className="text-sm text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>
        )}

        {/* Product Details Section */}
        <div className="px-6 pb-8">
          <div className="border-t pt-6">
            <h2 className="text-2xl font-bold mb-4">Product details</h2>
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

/* ================= HELPER COMPONENT ================= */
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