"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const HomeBannerSlider = ({ banners = [] }) => {
  const activeBanners = banners.filter((b) => b.status);

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (activeBanners.length === 0) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev === activeBanners.length - 1 ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(interval);
  }, [activeBanners.length]);

  if (activeBanners.length === 0) return null;

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? activeBanners.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev === activeBanners.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full max-w-[1400px] mx-auto px-6">
      <div className="relative h-[360px] md:h-[450px] py-10 rounded-3xl overflow-hidden shadow-xl">
        <Image
          src={activeBanners[current].image}
          alt={activeBanners[current].title}
          fill
          priority
          className="object-cover transition-all duration-700"
        />

        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-md hover:bg-white p-3 rounded-full shadow-md transition"
        >
          <ChevronLeft size={22} className="text-black" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-md hover:bg-white p-3 rounded-full shadow-md transition"
        >
          <ChevronRight size={22} className="text-black" />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {activeBanners.map((_, index) => (
            <div
              key={index}
              onClick={() => setCurrent(index)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                current === index ? "w-6 bg-white" : "w-2 bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(HomeBannerSlider);
