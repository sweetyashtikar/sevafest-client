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
  Minus,
  Plus,
  Package,
  Award,
  Clock,
  AlertCircle,
  Zap,
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

  const handleAddToCart = () => {
    console.log("Adding to cart:", { product, quantity });
  };

  const handleBuyNow = () => {
    console.log("Buy now:", { product, quantity });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!product) {
    return <ProductNotFound />;
  }

  const allImages = [product.mainImage, ...(product.otherImages || [])];
  const breadcrumbItems = [
    "Home",
    product.categoryId?.name || "Category",
    product.name,
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: Image Gallery - 5 columns */}
          <div className="lg:col-span-5 space-y-6">
            <ImageGallery
              images={allImages}
              selectedImage={selectedImage}
              onSelectImage={setSelectedImage}
              discount={product.discountPercentage}
            />

            {/* Action Buttons - Desktop */}
            <div className="space-y-4 lg:block hidden">
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
            <PriceSection product={product} />

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

            {/* Product Highlights */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-xl">
              <h2 className="font-black text-2xl text-gray-900 mb-5 flex items-center gap-2">
                <Package className="text-blue-600" size={28} />
                Product Highlights
              </h2>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <DetailRow label="Brand" value={product.brand} />
                  <DetailRow label="Color" value={product.attributeValues?.[0]?.value} />
                  <DetailRow label="Material" value="100% Cotton" />
                  <DetailRow label="Weight" value={`${product.dimensions?.weight || 0} kg`} />
                  <DetailRow label="HSN Code" value={product.hsnCode} />
                  <DetailRow label="Made In" value={product.madeIn} />
                </div>
              </div>
            </div>

            <hr className="my-8 border-2 border-gray-200" />

            {/* About This Item */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-xl">
              <h2 className="font-black text-2xl text-gray-900 mb-5 flex items-center gap-2">
                <Info className="text-blue-600" size={28} />
                About This Item
              </h2>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6">
                <ul className="space-y-4">
                  <li className="flex gap-3 text-sm text-gray-900 font-medium">
                    <span className="text-blue-600 mt-1 flex-shrink-0">
                      <Check size={18} className="font-bold" />
                    </span>
                    <span>{product.shortDescription}</span>
                  </li>
                  {product.extraDescription && (
                    <li className="flex gap-3 text-sm text-gray-900 font-medium">
                      <span className="text-blue-600 mt-1 flex-shrink-0">
                        <Check size={18} />
                      </span>
                      <span>{product.extraDescription}</span>
                    </li>
                  )}
                  {product.codAllowed && (
                    <li className="flex gap-3 text-sm text-gray-900 font-medium">
                      <span className="text-green-600 mt-1 flex-shrink-0">
                        <Check size={18} />
                      </span>
                      <span>Cash on Delivery available</span>
                    </li>
                  )}
                  {product.warrantyPeriod && (
                    <li className="flex gap-3 text-sm text-gray-900 font-medium">
                      <span className="text-purple-600 mt-1 flex-shrink-0">
                        <Shield size={18} />
                      </span>
                      <span className="font-bold">Warranty: {product.warrantyPeriod}</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>

            <hr className="my-8 border-2 border-gray-200" />

            {/* Delivery & Services */}
            <div>
              <h2 className="font-black text-2xl text-gray-900 mb-5 flex items-center gap-2">
                <Truck className="text-blue-600" size={28} />
                Delivery & Services
              </h2>
              <div className="space-y-4">
                <InfoCard
                  icon={MapPin}
                  title={`Deliver to ${DELIVERY_CITY} ${DELIVERY_PINCODE}`}
                  description="Change your delivery location for accurate estimates"
                  color="blue"
                />

                {product.inStock && (
                  <InfoCard
                    icon={Truck}
                    title="FREE Delivery Tomorrow, 8 AM - 12 PM"
                    description="Order within 4 hrs 23 mins for delivery by tomorrow"
                    color="green"
                  />
                )}

                {product.isReturnable && (
                  <InfoCard
                    icon={RotateCcw}
                    title="Free Returns within 30 Days"
                    description="Return this item for free within 30 days of delivery"
                    color="orange"
                  />
                )}

                {product.warrantyPeriod && (
                  <InfoCard
                    icon={Shield}
                    title={`Warranty: ${product.warrantyPeriod}`}
                    description="Manufacturer warranty included with purchase"
                    color="purple"
                  />
                )}
              </div>
            </div>

            <hr className="my-8 border-2 border-gray-200" />

            {/* Color Selection */}
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

            <hr className="my-8 border-2 border-gray-200" />

            {/* Sold By */}
            <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-6 shadow-xl">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-700 font-bold">Ships from:</span>
                  <span className="text-sm font-black text-gray-900 bg-white px-3 py-1 rounded-lg">
                    Amazon
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-700 font-bold">Sold by:</span>
                  <a
                    href="#"
                    className="text-sm font-black text-blue-600 hover:text-orange-600 hover:underline transition-colors bg-white px-3 py-1 rounded-lg"
                  >
                    {product.vendorId?.username || "Official Store"}
                  </a>
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

        {/* Product Description */}
        {product.description && (
          <div className="mt-12 animate-fadeIn">
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-2xl">
              <h2 className="text-3xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <Package className="text-blue-600" size={32} />
                Product Description
              </h2>
              <div className="prose prose-gray max-w-none bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-gray-200 rounded-xl p-6">
                <p className="text-base text-gray-800 leading-relaxed whitespace-pre-wrap font-medium">
                  {product.description}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Technical Specifications */}
        <div className="mt-8 animate-fadeIn">
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-3xl font-black text-gray-900 mb-6 flex items-center gap-3">
              <Award className="text-blue-600" size={32} />
              Technical Specifications
            </h2>
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-gray-200 rounded-xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
                <div className="space-y-2">
                  <DetailRow
                    label="Product Dimensions"
                    value={`${product.dimensions?.length || 0} × ${product.dimensions?.breadth || 0} × ${product.dimensions?.height || 0} cm`}
                  />
                  <DetailRow
                    label="Item Weight"
                    value={`${product.dimensions?.weight || 0} kg`}
                  />
                  <DetailRow label="Manufacturer" value={product.brand} />
                </div>
                <div className="space-y-2">
                  <DetailRow
                    label="Model Number"
                    value={product.simpleProduct?.sp_sku}
                  />
                  <DetailRow label="Country of Origin" value={product.madeIn} />
                  <DetailRow label="HSN Code" value={product.hsnCode} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}