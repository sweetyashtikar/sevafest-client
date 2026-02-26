"use client";

export const Loader = ({ fullScreen = true, text = "LOADING..." }) => {
  return (
    <div
      className={`flex flex-col items-center justify-center transition-all duration-500 ${
        fullScreen ? "fixed inset-0 z-[100] bg-white" : "w-full py-10 bg-white"
      }`}
    >
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-white/5 rounded-full"></div>

        <div className="absolute inset-0 border-4 border-yellow-400 rounded-full border-t-transparent animate-spin shadow-[0_0_15px_rgba(250,204,21,0.2)]"></div>

        <div className="absolute inset-[18px] bg-white/5 rounded-full flex items-center justify-center animate-pulse">
          <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center gap-3">
        <h2 className="text-yellow-400 font-black italic tracking-[0.5em] text-xs sm:text-sm animate-pulse">
          {text}
        </h2>

        <div className="w-20 h-[2px] bg-white/10 overflow-hidden relative rounded-full">
          <div className="absolute inset-0 bg-yellow-400 animate-loading-bar"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes loading-bar {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-loading-bar {
          animation: loading-bar 1.5s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};
