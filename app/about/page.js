"use client";
import Image from "next/image";
import bg from "@/assets/images/ab-1.png";

const brands = [
  
];


const Page = () => {
  return (
    <div className="bg-white">
      <AboutOrganicSection />
      <PopularBrands />
    </div>
  );
};

export default Page;

const AboutOrganicSection = () => {
  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative flex justify-center">
            <div className="relative w-[300px] h-[280px] sm:w-[400px] sm:h-[380px] lg:w-[500px] lg:h-[450px] overflow-hidden">
              <Image
                src={bg}
                alt="Organic Farmers"
                fill
                className="object-cover"
              />
            </div>

            <div
              className="absolute right-10 -bottom-6 bg-green-600 text-white p-4 
                rounded-br-2xl shadow-lg max-w-xs  border-t-8 border-l-8 
             border-white"
            >
              <p className="text-lg italic ">
                “ Assertively target market lorem ipsum is simply free
                consectetur notted elit sed do eiusmod ”
              </p>
              <p className="mt-2 text-xs font-semibold">— George Scholl</p>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3">
              <span className="text-sm italic font-bold text-gray-700">
                100% Organic Food Provide
              </span>

              {/* Line + Arrow */}
              <div className="flex items-center">
                <span className="w-12 h-[3px] bg-orange-500"></span>
                <span
                  className="w-0 h-0 
             border-t-6 border-b-6 border-l-12
             border-t-transparent border-b-transparent
             border-l-orange-500"
                ></span>
              </div>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3">
              Be healthy & eat fresh organic food
            </h2>

            <p className="text-gray-600 mt-4">
              Assertively target market lorem ipsum is simply free text
              available dolor sit amet, consectetur notted adipisicing elit sed
              do eiusmod tempor incididunt simply freeutation labore et dolore.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
              <div className="border rounded-xl p-5 hover:shadow-md transition">
                <h4 className="font-semibold text-xl mb-2 text-black">
                  Our Mission
                </h4>
                <p className="text-sm text-gray-600">
                  आमच्या किराणा ई-कॉमर्स स्टोअरमध्ये आपले हार्दिक स्वागत आहे!
                  आम्ही ताजे, दर्जेदार आणि विश्वासार्ह किराणा सामान थेट तुमच्या
                  घरापर्यंत पोहोचवण्याचा प्रयत्न करतो. आमच्याकडे दैनंदिन
                  वापरातील सर्व किराणा वस्तू जसे की तांदूळ, डाळी, पीठ, मसाले,
                  तेल, साखर, तसेच घरगुती आवश्यक वस्तू उपलब्ध आहेत. सर्व उत्पादने
                  विश्वसनीय पुरवठादारांकडून काळजीपूर्वक निवडली जातात. योग्य दर,
                  सुरक्षित ऑनलाइन पेमेंट, आणि वेळेवर होणारी होम डिलिव्हरी ही
                  आमच्या सेवेची प्रमुख वैशिष्ट्ये आहेत. ग्राहकांचा विश्वास आणि
                  समाधान हेच आमचे मुख्य उद्दिष्ट आहे. आजच्या धावपळीच्या जीवनात
                  तुमचा वेळ वाचवणे आणि किराणा खरेदी सोपी, जलद व सुरक्षित करणे
                  हेच आमचे ध्येय आहे. आमच्यावर विश्वास ठेवा आणि सोयीस्कर किराणा
                  खरेदीचा अनुभव घ्या!
                </p>
              </div>

              <div className="border rounded-xl p-5 hover:shadow-md transition">
                <h4 className="font-semibold text-xl mb-2 text-black">
                  Our Vision
                </h4>
                <p className="text-sm text-gray-600">
                  Continually transform virtual meta- methodologies. leverage
                  existing alignments
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const PopularBrands = () => {
  return (
   <section className="w-full px-4 md:px-10 py-10 bg-white">
      {/* Heading with Dashed Line */}
      <div className="flex items-center gap-4 mb-2">
        <h2 className="text-2xl font-bold text-[#1a2b4e] whitespace-nowrap">
          The Most Popular Brands
        </h2>
        <div className="flex-1 border-t-2 border-dashed border-orange-400 mt-2" />
      </div>

      {/* Main Container with Dashed Border */}
      <div className="border-2 border-dashed border-orange-400 rounded-[30px] p-8 mt-4 relative overflow-hidden">
        
        {/* Brands Flexbox / Slider */}
        <div className="flex items-center justify-between gap-6 overflow-x-auto no-scrollbar">
          {brands.map((src, index) => (
            <div
              key={index}
              className="group min-w-[180px] h-[100px] bg-white rounded-xl border border-gray-100 
                         flex items-center justify-center p-4 shadow-sm transition-all 
                         duration-300 hover:shadow-md hover:border-orange-200 hover:-translate-y-1"
            >
              <img
                src={src}
                alt={`Brand ${index + 1}`}
                className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500"
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};