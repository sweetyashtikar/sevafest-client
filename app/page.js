"use client";
import Image from "next/image";
import { ArrowRight, Facebook, Twitter, Linkedin, Youtube } from "lucide-react";
import Grocery from "@/assets/images/SEVAFASTSLIDING1.jpg";
import TopTrendingProducts from "@/ui/TopTrendingProducts";
import { apiClient } from "@/services/apiClient";
import { useEffect, useState } from "react";

export default function Page() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await apiClient(`product?page=1&limit=1000`);
      if (res?.success) {
        setProducts(res.data.products || []);
      }
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      <main className="min-h-screen bg-white">
        <HeroSection />
        <OfferBanner />
        <OfferBannerSecond />
        <TopTrendingProducts products={products} loading={loading} />
      </main>
    </>
  );
}

const HeroSection = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen">
          <div className="space-y-8">
            <div className="inline-block">
              <span className="text-orange-500 font-semibold text-lg italic">
                Genuine 100% Organic Products
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
              Grocery Online
              <br />
              <span className="text-gray-800">Fresh Products</span>
            </h1>

            <p className="text-gray-600 text-lg max-w-xl leading-relaxed">
              Assertively target market-driven intellectual capital with
              worldwide human capital holistic.
            </p>

            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg flex items-center gap-2">
                Shop Now
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all transform hover:scale-105 shadow-lg flex items-center gap-2">
                About Us
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="relative w-full h-[450px] md:h-[550px] lg:h-[650px]">
            <Image
              src={Grocery}
              alt="Fresh Organic Grocery"
              fill
              priority
              className="object-contain"
            />

            <div className="absolute -z-10 top-10 right-10 w-96 h-96 bg-green-200 rounded-full blur-3xl opacity-60"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const OfferBanner = () => {
  return (
    <div className="w-full px-6 py-2">
      <div className="relative w-full h-[220px] md:h-[260px] rounded-xl overflow-hidden">
        <Image
          src="https://res.cloudinary.com/dw29tjghu/image/upload/v1765622091/undefined/sugar.jpg"
          alt="Organic Offer"
          fill
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/10" />

        <div className="absolute inset-0 flex items-center  text-center">
          <div className="pl-8 md:pl-14">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-orange-500 italic font-semibold text-4xl">
                Weekend Offer
              </span>
              <ArrowRight className="w-4 h-4 text-orange-500" />
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Organic Foods{" "}
              <span className="font-extrabold">Up to 40% off</span>
            </h2>

            <button className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-md flex items-center gap-2">
              Shop Now
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const OfferBannerSecond = () => {
  return (
    <div className="w-full px-6 py-20">
      <div className="relative w-full h-[220px] md:h-[260px] rounded-xl overflow-hidden">
        <Image
          src="https://res.cloudinary.com/dmadhbgty/image/upload/v1733216697/grostore/cta-banner.jpg"
          alt="Organic Offer"
          fill
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/10" />

        <div className="absolute inset-0 flex items-center justify-center text-center">
          <div className="pl-8 md:pl-14">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-orange-500 italic font-semibold text-4xl">
                Winnter Offer
              </span>
              <ArrowRight className="w-4 h-4 text-orange-500" />
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Bigest offer this winter up to 70%
            </h2>
            <button className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-md flex items-center gap-2">
              Shop Now
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
