"use client";

export const StatCard = ({ title, value, icon: Icon, color }) => {
  return (
    <div className="bg-white rounded-xl shadow-md border p-6 text-center hover:shadow-lg transition">

      {/* Center Icon */}
      <div className={`w-14 h-14 mx-auto flex items-center justify-center rounded-full ${color}`}>
        <Icon className="w-6 h-6" />
      </div>

      {/* Number */}
      <h2 className="text-3xl font-bold text-black mt-4">
        {value}
      </h2>

      {/* Title */}
      <p className="text-gray-700 font-semibold mt-1">
        {title}
      </p>

     

    </div>
  );
};