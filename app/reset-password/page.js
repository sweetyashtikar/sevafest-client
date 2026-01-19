"use client";

import Image from "next/image";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { apiClient } from "@/services/apiClient";
import { useRouter } from "next/navigation";

import Login from "@/assets/images/login.jpg";

export default function Page() {

  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");

  const validaterForm = ({ otp, newPassword, confirmPassword }) => {
    const errors = {};

    // OTP validation
    if (!otp || !otp.trim()) {
      errors.otp = "OTP is required";
    } else if (!/^\d{4,6}$/.test(otp)) {
      errors.otp = "Enter a valid OTP";
    }

    // New Password validation
    if (!newPassword) {
      errors.newPassword = "New password is required";
    } else if (newPassword.length < 6) {
      errors.newPassword = "Password must be at least 6 characters";
    }
    return errors;
  };

  const handleRestePass = async (e) => {
    e.preventDefault();
    setErrors("");

    const validationErrors = validaterForm({
      otp,
      newPassword,
    });

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);

    try {
      const payload = {
        resetToken: otp,
        newPassword,
      };

      const res = await apiClient("/resetpassword", {
        method: "POST",
        body: payload,
      });

      if (res.success === true) {
        alert("Password Reset successfully");
        router.push("/login");
      }
    } catch (err) {
      console.log("ERR FULL:", err);
      alert(err?.message || "Password Reset failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* LEFT IMAGE */}
        <div className="relative hidden md:flex items-center justify-center ">
          <Image
            src={Login}
            alt="Auth Illustration"
            fill
            className="object-contain p-10"
            priority
          />
        </div>

        <div className="p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Reset your password
          </h2>

          <p className="text-sm text-gray-500 mb-6">
            Enter the OTP sent to your email and set a new password.
          </p>

          <form className="space-y-4">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg outline-none
                 text-black placeholder-gray-400
                 focus:ring-2 focus:ring-orange-400
                 focus:border-orange-400 transition"
            />
            {errors.otp && (
              <p className="text-sm text-red-500 mt-1">{errors.otp}</p>
            )}

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg outline-none
                           text-black placeholder-gray-400
                           focus:ring-2 focus:ring-orange-400
                           focus:border-orange-400 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password}</p>
            )}

            <button
              type="submit"
              onClick={handleRestePass}
              disabled={loading}
              className={`w-full mt-4 flex items-center justify-center gap-2
      font-semibold py-3 rounded-lg transition
      ${
        loading
          ? "bg-green-400 cursor-not-allowed"
          : "bg-green-600 hover:bg-green-700"
      }
      text-white`}
            >
              {loading && (
                <span
                  className="w-5 h-5 border-2 border-white border-t-transparent
          rounded-full animate-spin"
                />
              )}

              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>

          <p className="text-xs text-gray-500 mt-6 text-center">
            <span className="underline cursor-pointer">Terms of Use</span> and{" "}
            <span className="underline cursor-pointer">Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
}
