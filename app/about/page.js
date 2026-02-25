"use client";
import Image from "next/image";
import bg from "../../assets/images/ab-1.png";
import brand1 from "../../assets/brands/brand_1.jpg";
import brand2 from "../../assets/brands/brand-2.jpg";
import brand3 from "../../assets/brands/brand-3.jpg";
import brand4 from "../../assets/brands/brand-4.jpg";
import brand5 from "../../assets/brands/brand-5.jpg";
import brand6 from "../../assets/brands/brand-6.jpg";
import { Package, ShoppingBag, Users, Bike } from "lucide-react";

const Page = () => {
  return (
    <div className="bg-white">
      <AboutOrganicSection />
      <PopularBrands />
      <BrandCard />
      <BrandCardOld />
    </div>
  );
};

export default Page;

const AboutOrganicSection = () => {
  return (
    <section className="bg-[#eef5e9] py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* ================= ROW 1 ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center mb-20">
          {/* LEFT IMAGE */}
          <div className="relative flex justify-center">
            <div
              className="relative 
    w-[260px] h-[240px] 
    sm:w-[360px] sm:h-[320px] 
    lg:w-[440px] lg:h-[380px]"
            >
              <Image
                src={bg}
                alt="Organic Food"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div>
            {/* TAG */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm italic font-bold text-gray-700">
                100% Organic Food Provide
              </span>
              <div className="flex items-center">
                <span className="w-12 h-[3px] bg-orange-500"></span>
                <span className="w-0 h-0 border-t-6 border-b-6 border-l-12 border-t-transparent border-b-transparent border-l-orange-500"></span>
              </div>
            </div>

            {/* HEADING */}
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-snug">
              Be healthy & eat fresh organic food
            </h2>

            {/* DESCRIPTION */}
            <p className="text-gray-600 mt-5 max-w-xl leading-relaxed">
              Assertively target market lorem ipsum is simply free text
              available dolor sit amet, consectetur notted adipisicing elit sed
              do eiusmod tempor incididunt simply freeutation labore et dolore.
            </p>
          </div>
        </div>

        {/* ================= ROW 2 ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* MISSION CARD */}
          <div
            className="
    bg-[#C2E8CE]
    rounded-2xl
    p-8
    shadow-md
    transition-all
    duration-300
    ease-in-out
    text-center
    hover:bg-[#8FCEAA]
    hover:-translate-y-1
    hover:shadow-xl
  "
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Our Mission
            </h3>
            <p className="text-gray-700 leading-relaxed text-sm">
              आमच्या किराणा ई-कॉमर्स स्टोअरमध्ये आपले हार्दिक स्वागत आहे! आम्ही
              ताजे, दर्जेदार आणि विश्वासार्ह किराणा सामान थेट तुमच्या घरापर्यंत
              पोहोचवतो. दैनंदिन वापरातील तांदूळ, डाळी, पीठ, मसाले, तेल, साखर आणि
              घरगुती आवश्यक वस्तू योग्य दरात उपलब्ध करून देणे हे आमचे ध्येय आहे.
              सुरक्षित ऑनलाइन पेमेंट आणि वेळेवर होणारी होम डिलिव्हरी ही आमची
              प्रमुख वैशिष्ट्ये आहेत.
            </p>
          </div>

          {/* VISION CARD */}
          <div
            className="
    bg-[#C2E8CE]
    rounded-2xl
    p-8
    shadow-md
    transition-all
    duration-300
    ease-in-out
    text-center
    hover:bg-[#8FCEAA]
    hover:-translate-y-1
    hover:shadow-xl
  "
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Our Vision
            </h3>
            <p className="text-gray-700 leading-relaxed text-sm">
              ग्राहकांसाठी विश्वासार्ह, सोयीस्कर आणि जलद किराणा खरेदीचा
              सर्वोत्तम डिजिटल अनुभव निर्माण करणे. आधुनिक तंत्रज्ञानाच्या
              सहाय्याने दर्जेदार सेवा देत ग्राहकांचा विश्वास जिंकणे हे आमचे
              दीर्घकालीन उद्दिष्ट आहे.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const PopularBrands = () => {
  const brands = [brand1, brand2, brand3, brand4, brand5];
  return (
    <section className="w-full px-4 md:px-10 py-16 bg-white">
      {/* Heading with Dashed Line */}
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-2xl font-bold text-[#1a2b4e] whitespace-nowrap">
          The Most Popular Brands
        </h2>
        <div className="flex-1 border-t-2 border-dashed border-orange-400 mt-2" />
      </div>

      {/* Main Container */}
      <div
        className="border-2 border-dashed border-orange-400 rounded-[30px]
               p-12 mt-4 bg-gray-50"
      >
        {/* Brands Grid (NO SLIDER) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 place-items-center">
          {brands.map((src, index) => (
            <div
              key={index}
              className="group w-[180px] h-[110px] bg-white rounded-xl
                     border border-gray-200 flex items-center justify-center
                     p-4 shadow-sm transition-all duration-300
                     hover:shadow-md hover:border-orange-200 hover:-translate-y-1"
            >
              <Image
                src={src}
                alt={`Brand ${index + 1}`}
                className="object-contain grayscale
                       group-hover:grayscale-0 transition-all duration-500"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const BrandCard = ({ src, alt }) => {
  return (
    <section className="w-full bg-[#eef5e9] py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-extrabold text-[#0b1c39]">
          Our Working Ability
        </h2>

        <p className="mt-4 max-w-3xl mx-auto text-gray-600 text-lg">
          Assertively target market lorem ipsum is simply free text available
          dolor incididunt simply free ut labore et dolore.
        </p>

        {/* Stats Cards */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-8 flex flex-col items-center text-center gap-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <Package className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-4xl font-bold text-[#0b1c39]">243</h3>
            <p className="text-gray-600 font-medium">Total Products</p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-8 flex flex-col items-center text-center gap-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
              <ShoppingBag className="w-8 h-8 text-orange-500" />
            </div>
            <h3 className="text-4xl font-bold text-[#0b1c39]">41</h3>
            <p className="text-gray-600 font-medium">Total Orders</p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-8 flex flex-col items-center text-center gap-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-4xl font-bold text-[#0b1c39]">18</h3>
            <p className="text-gray-600 font-medium">Total Visitors</p>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-2xl p-8 flex flex-col items-center text-center gap-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <Bike className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-4xl font-bold text-[#0b1c39]">22</h3>
            <p className="text-gray-600 font-medium">Total Delivery</p>
          </div>
        </div>
      </div>
    </section>
  );
};

const BrandCardOld = ({ src, alt }) => {
  return (
    <section className="bg-white py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* ================= LEFT SIDE ================= */}

          <div className="relative flex justify-center">
            {/* Image Wrapper */}
            <div className="relative w-[280px] h-[360px] rounded-3xl overflow-hidden">
              <Image
                src={brand6}
                alt="Why Choose Us"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Experience Badge */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
              <div className="w-40 h-40 rounded-full bg-orange-500 flex flex-col items-center justify-center text-white shadow-xl border-8 border-white">
                <span className="text-4xl font-bold">14+</span>
                <span className="text-sm mt-1">Year’s Experience</span>
              </div>
            </div>
          </div>

          {/* ================= RIGHT SIDE ================= */}
          <div>
            {/* Tag */}
            <div className="flex items-center gap-3 mb-4">
              <span className="italic font-semibold text-gray-700">
                Why Choose Us
              </span>
              <div className="flex items-center">
                <span className="w-12 h-[3px] bg-orange-500"></span>
                <span className="w-0 h-0 border-t-6 border-b-6 border-l-12 border-t-transparent border-b-transparent border-l-orange-500"></span>
              </div>
            </div>

            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-snug">
              We do not Buy from the <br /> Open Market
            </h2>

            {/* Description */}
            <p className="text-gray-600 mt-5 max-w-xl">
              Compellingly fashion intermandated opportunities and multimedia
              based transparent e-business.
            </p>

            {/* ================= FEATURES ================= */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              {/* Card */}
              {[
                "Trusted Partner",
                "Return Policy",
                "100% Organic Fresh",
                "Secured Payment",
              ].map((title, i) => (
                <div
                  key={i}
                  className="
                bg-[#C2E8CE]
                p-6
                rounded-2xl
                shadow-md
                transition-all
                duration-300
                ease-in-out
                text-center
                hover:-translate-y-1
                hover:shadow-xl
              "
                >
                  {/* Icon */}
                  <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-white flex items-center justify-center shadow">
                    <span className="text-2xl">🌿</span>
                  </div>

                  <h4 className="font-bold text-lg mb-2 text-gray-900">
                    {title}
                  </h4>

                  <p className="text-sm text-gray-700">
                    Compellingly fashion intermandated opportunities e-business
                    fashion.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
