"use client";

import Image from "next/image";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { apiClient } from "@/services/apiClient";
import { useRouter } from "next/navigation";

import Login from "@/assets/images/login.jpg";

export default function Page() {
  const router = useRouter();

  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");

  const validaterForm = ({ email, password }) => {
    const errors = {};

    if (!email.trim()) {
      errors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.email = "Enter a valid email address";
      }
    }

    return errors;
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    setErrors("");

    const validationErrors = validaterForm({
      email,
    });

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);

    try {
      const payload = {
        email,
      };

      const res = await apiClient("/forgotpassword", {
        method: "POST",
        body: payload,
      });

      if (res.success === true) {
        alert("Send Reset Link successfully");
        router.push("/reset-password");
      }
    } catch (err) {
      console.log("ERR FULL:", err);
      alert(err?.message || "Send Reset Link failed. Try again.");
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

        {/* RIGHT FORM */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Forgot your password?
          </h2>

          <p className="text-sm text-gray-500 mb-6">
            No worries! Enter your email and we’ll send you a reset link.
          </p>

          <form className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg outline-none
                         text-black placeholder-gray-400
                         focus:ring-2 focus:ring-orange-400
                         focus:border-orange-400 transition"
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email}</p>
            )}

            <button
              type="submit"
              onClick={handleSendEmail}
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

              {loading ? "Sending..." : "Send Reset Link"}
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
