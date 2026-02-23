"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
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

/* ---------------- HERO SECTION ---------------- */
const HeroSection = () => {
  return (
    <section className="relative min-h-screen overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center min-h-screen">
        
        {/* Left */}
        <div className="space-y-8">
          <span className="text-orange-500 font-semibold text-lg italic">
            Genuine 100% Organic Products
          </span>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900">
            Grocery Online <br />
            <span className="text-gray-800">Fresh Products</span>
          </h1>

          <p className="text-gray-600 text-lg max-w-xl">
            Assertively target market-driven intellectual capital with
            worldwide human capital holistic.
          </p>

          <div className="flex gap-4">
            <button className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg flex items-center gap-2 transition">
              Shop Now <ArrowRight size={18} />
            </button>

            <button className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg flex items-center gap-2 transition">
              About Us <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Right */}
        <div className="relative h-[450px] md:h-[550px] lg:h-[650px]">
          <Image
            src={Grocery}
            alt="Fresh Organic Grocery"
            fill
            priority
            className="object-contain"
          />
          <div className="absolute -z-10 top-10 right-10 w-96 h-96 bg-green-200 rounded-full blur-3xl opacity-60" />
        </div>
      </div>
    </section>
  );
};

/* ---------------- OFFER BANNER ---------------- */
const OfferBanner = () => {
  return (
    <section className="px-6 py-10">
      <div className="relative h-[240px] rounded-xl overflow-hidden">
        <Image
          src="https://res.cloudinary.com/dw29tjghu/image/upload/v1765622091/undefined/sugar.jpg"
          alt="Offer"
          fill
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/10" />

        <div className="absolute inset-0 flex items-center pl-10">
          <div>
            <span className="text-orange-500 italic font-semibold text-4xl">
              Weekend Offer
            </span>

            <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-4">
              Organic Foods <span className="font-extrabold">Up to 40% off</span>
            </h2>

            <button className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-md flex items-center gap-2">
              Shop Now <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ---------------- OFFER BANNER 2 ---------------- */
const OfferBannerSecond = () => {
  return (
    <section className="px-6 py-16">
      <div className="relative h-[240px] rounded-xl overflow-hidden">
        <Image
          src="https://res.cloudinary.com/dmadhbgty/image/upload/v1733216697/grostore/cta-banner.jpg"
          alt="Winter Offer"
          fill
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/10" />

        <div className="absolute inset-0 flex items-center justify-center text-center">
          <div>
            <span className="text-orange-500 italic font-semibold text-4xl">
              Winter Offer
            </span>

            <h2 className="text-3xl font-bold text-gray-900 mt-3 mb-4">
              Biggest offer this winter up to 70%
            </h2>

            <button className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-md flex items-center gap-2 mx-auto">
              Shop Now <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ---------------- TOP CATEGORY ---------------- */
const categories = [
  { name: "Flour (Atta)", count: 0, img: "/assets/41-s1q17edL_grande.jpg" },
  { name: "Combo Offers", count: 3, img: "/assets/combo-offer-sale-word-mega-phone-concept-vector-illustration-3d-style-landing-page-template_774430-896.avif" },
  { name: "Chinese Cooking", count: 1, img: "/assets/b79aefa8-97c4-4b24-8984-56f59edf728a.jpg" },
  { name: "Matches Box", count: 1, img: "/assets/212dd522-9901-4476-805f-542d047450d5.jpg" },
  { name: "Pickles", count: 5, img: "/assets/61q7h-mZ1AL.jpg" },
  { name: "Chocolate Candy", count: 2, img: "/assets/istockphoto-458250835-612x612.jpg" },
];

const TopCategory = () => {
  return (
    <section className="bg-[#eef5e9] py-20">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-14">
          Our Top Category
        </h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {categories.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 text-center shadow-sm
                         hover:shadow-xl transition hover:-translate-y-2"
            >
              <div className="relative w-28 h-28 mx-auto rounded-full ring-2 ring-green-400 ring-offset-4">
                <Image
                  src={item.img}
                  alt={item.name}
                  fill
                  className="object-contain p-3"
                />
              </div>

              <h3 className="mt-6 text-lg font-semibold text-gray-800 hover:text-green-600">
                {item.name}
              </h3>

              <div className="mt-2 flex justify-center items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-sm text-gray-600">{item.count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
