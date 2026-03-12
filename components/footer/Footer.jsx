"use client";
export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-[#1a1d2e] text-gray-300 overflow-hidden">
      {/* Decorative Food Icons - Hidden on mobile, visible on md+ */}
      <div className="hidden md:block absolute top-20 left-10 w-12 h-12 lg:w-16 lg:h-16 opacity-60 animate-pulse">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="45" fill="#ff6b35" />
          <circle cx="50" cy="50" r="35" fill="#ff8c42" />
          <path d="M50 20 L55 50 L50 50 L45 50 Z" fill="#fff" opacity="0.8" />
          <path d="M50 80 L55 50 L50 50 L45 50 Z" fill="#fff" opacity="0.8" />
          <path d="M20 50 L50 55 L50 50 L50 45 Z" fill="#fff" opacity="0.8" />
          <path d="M80 50 L50 55 L50 50 L50 45 Z" fill="#fff" opacity="0.8" />
        </svg>
      </div>

      <div className="hidden md:block absolute top-56 left-4 w-10 h-10 lg:w-12 lg:h-12 opacity-50">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <ellipse
            cx="50"
            cy="50"
            rx="40"
            ry="20"
            fill="#7cb342"
            transform="rotate(-30 50 50)"
          />
        </svg>
      </div>

      <div className="hidden lg:block absolute top-72 left-6 opacity-60">
        <svg viewBox="0 0 120 120" className="w-16 h-16 lg:w-20 lg:h-20">
          <path
            d="M40 60 Q40 30 60 30 Q80 30 80 60 Q80 80 60 90 Q40 80 40 60"
            fill="#ff5252"
          />
          <path
            d="M50 60 Q50 40 60 40 Q70 40 70 60 Q70 75 60 80 Q50 75 50 60"
            fill="#ff7979"
          />
          <circle cx="55" cy="50" r="3" fill="#ffeb3b" />
        </svg>
      </div>

      <div className="hidden md:block absolute top-16 right-10 lg:right-16 w-12 h-12 lg:w-14 lg:h-14 opacity-60 animate-pulse">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <ellipse
            cx="50"
            cy="50"
            rx="35"
            ry="15"
            fill="#7cb342"
            transform="rotate(-20 50 50)"
          />
        </svg>
      </div>

      <div className="hidden md:block absolute top-60 right-8 lg:right-10 w-14 h-14 lg:w-16 lg:h-16 opacity-60">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path
            d="M50 70 L70 50 Q75 45 70 40 L50 20 L30 40 Q25 45 30 50 Z"
            fill="#ff6b35"
          />
        </svg>
      </div>

      <div className="hidden lg:block absolute bottom-32 right-20 xl:right-32 opacity-70 animate-pulse">
        <svg viewBox="0 0 100 100" className="w-20 h-20 lg:w-24 lg:h-24">
          <circle cx="50" cy="50" r="40" fill="#d84315" />
          <circle cx="50" cy="50" r="32" fill="#ff6b35" />
          <circle cx="35" cy="40" r="6" fill="#ffa726" />
          <circle cx="50" cy="35" r="5" fill="#ffa726" />
          <circle cx="65" cy="42" r="7" fill="#ffa726" />
          <circle cx="42" cy="58" r="5" fill="#ffa726" />
          <circle cx="60" cy="60" r="6" fill="#ffa726" />
        </svg>
      </div>

      <div className="hidden md:block absolute top-36 right-4 opacity-50">
        <svg viewBox="0 0 80 80" className="w-10 h-10 lg:w-12 lg:h-12">
          <path d="M20 40 Q40 20 60 40 L60 60 Q40 70 20 60 Z" fill="#4caf50" />
        </svg>
      </div>

      <div className="hidden lg:block absolute bottom-40 left-12 w-10 h-10 opacity-40">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <ellipse
            cx="50"
            cy="50"
            rx="30"
            ry="15"
            fill="#8bc34a"
            transform="rotate(45 50 50)"
          />
        </svg>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed md:absolute bottom-4 right-4 md:bottom-6 md:right-6 bg-orange-500 hover:bg-orange-600 text-white p-2.5 md:p-3 rounded-md shadow-lg transition-all hover:scale-110 z-50"
        aria-label="Scroll to top"
      >
        <svg
          className="w-4 h-4 md:w-5 md:h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </button>

      <div className="relative z-10 w-full px-4 sm:px-6 py-12 ">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 place-items-center text-center">
          <div className="w-full max-w-lg mx-auto ml-50">
            <h3 className="mb-6 text-lg font-semibold text-white text-left">
              Category
            </h3>

            <div className="grid grid-cols-2 gap-8 text-sm justify-center">
              <ul className="space-y-3 text-left">
                <li className="hover:text-orange-500 cursor-pointer transition-colors">
                  COMBO OFFERS
                </li>
                <li className="hover:text-orange-500 cursor-pointer transition-colors">
                  Chinese Cooking Products
                </li>
                <li className="hover:text-orange-500 cursor-pointer transition-colors">
                  Matches Box
                </li>
                <li className="hover:text-orange-500 cursor-pointer transition-colors">
                  Pickles
                </li>
                <li className="hover:text-orange-500 cursor-pointer transition-colors">
                  Chocolate Candy
                </li>
                <li className="hover:text-orange-500 cursor-pointer transition-colors">
                  Grains
                </li>
              </ul>

              <ul className="space-y-3 text-left">
                <li className="hover:text-orange-500 cursor-pointer transition-colors">
                  Home Care and Cleaning
                </li>
                <li className="hover:text-orange-500 cursor-pointer transition-colors">
                  EDIBLE OILS
                </li>
                <li className="hover:text-orange-500 cursor-pointer transition-colors">
                  ORAL CARE
                </li>
                <li className="hover:text-orange-500 cursor-pointer transition-colors">
                  Baking Syrups, Sugars & Sweeteners
                </li>
                <li className="hover:text-orange-500 cursor-pointer transition-colors">
                  DRY FRUITS AND NUTS
                </li>
                <li className="hover:text-orange-500 cursor-pointer transition-colors">
                  Floor Cleaners
                </li>
              </ul>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="w-full max-w-lg mx-auto">
            <h3 className="mb-6 text-lg font-semibold text-white text-left">
              Quick Links
            </h3>

            <div className="grid grid-cols-2 gap-8 text-sm justify-center">
              <ul className="space-y-3 text-left">
                <li className="hover:text-orange-500 cursor-pointer transition-colors">
                  About Us
                </li>
                <li className="hover:text-orange-500 cursor-pointer transition-colors">
                  Blog
                </li>
                <li className="hover:text-orange-500 cursor-pointer transition-colors">
                  Terms & Condition
                </li>
                <li className="hover:text-orange-500 cursor-pointer transition-colors">
                  Contact
                </li>
              </ul>

              <ul className="space-y-3 text-left">
                <li className="hover:text-orange-500 cursor-pointer transition-colors">
                  Products
                </li>
                <li className="hover:text-orange-500 cursor-pointer transition-colors">
                  Coupons
                </li>
                <li className="hover:text-orange-500 cursor-pointer transition-colors">
                  Log In
                </li>
                <li className="hover:text-orange-500 cursor-pointer transition-colors">
                  Sign Up
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 border-t border-gray-700">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:gap-6 px-4 sm:px-6 py-5 md:py-6 md:flex-row">
          <p className="text-xs sm:text-sm text-center md:text-left">
            © All rights reserved Made by{" "}
            <span className="text-white font-semibold">SevaFast</span>
          </p>

          {/* Payment Icons */}
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4">
            <div className="bg-gray-700 px-3 py-1.5 md:px-4 md:py-2 rounded flex items-center gap-2">
              <span className="text-[10px] md:text-xs font-semibold text-white">
                PAYONEER
              </span>
            </div>
            <div className="bg-gradient-to-r from-red-600 to-orange-500 px-3 py-1.5 md:px-4 md:py-2 rounded flex items-center gap-1">
              <div className="w-4 h-4 md:w-6 md:h-6 bg-red-500 rounded-full"></div>
              <div className="w-4 h-4 md:w-6 md:h-6 bg-orange-400 rounded-full -ml-2 md:-ml-3"></div>
            </div>
            <div className="bg-blue-900 px-3 py-1.5 md:px-4 md:py-2 rounded">
              <span className="text-[10px] md:text-xs font-bold text-white">
                VISA
              </span>
            </div>
            <div className="bg-blue-600 px-3 py-1.5 md:px-4 md:py-2 rounded">
              <span className="text-[10px] md:text-xs font-bold text-white">
                PayPal
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
