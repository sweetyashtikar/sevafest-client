"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowLeft } from "lucide-react";
import { apiClient } from "@/services/apiClient";
import { useRouter } from "next/navigation";

import Login from "@/assets/images/Login.png";

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
    <div className="min-h-screen flex items-center justify-center bg-[#f3f4f7] px-4 font-sans text-[#1a1c24]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2"
      >
        <div className="relative hidden md:flex items-center justify-center p-12 overflow-hidden bg-white">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="relative z-10 w-full h-[400px] flex items-center justify-center"
          >
            <Image
              src={Login}
              alt="Forgot Password Illustration"
              width={400}
              height={400}
              className="object-contain"
              priority
            />
          </motion.div>

          <div className="absolute top-[-35%] left-[-30%] w-80 h-80 bg-[#fcc221]  rounded-full"></div>
          <div className="absolute bottom-[-55%] right-[-35%] w-96 h-96 bg-[#fdd835] rounded-full"></div>
        </div>

        <div className="p-8 md:p-14 flex flex-col justify-center bg-white border-l border-gray-50">
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
  
            <Link
              href="/login"
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-[#fcc221] transition mb-6 group"
            >
              <ArrowLeft
                size={18}
                className="group-hover:-translate-x-1 transition-transform"
              />
              Back to login
            </Link>

            <h2 className="text-3xl font-bold text-[#1a1c24] mb-2">
              Forgot your <span className="text-[#fcc221]">password?</span>
            </h2>
            <p className="text-sm text-gray-500 mb-8">
              No worries! Enter your email and we’ll send you a reset link.
            </p>

            {/* FORM */}
            <form className="space-y-6" onSubmit={handleSendEmail}>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-[#f3f4f7] rounded-xl focus:border-[#fcc221] outline-none transition-all bg-[#f3f4f7]/30 focus:bg-white text-black"
                />
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-red-500 mt-2 ml-1"
                  >
                    {errors.email}
                  </motion.p>
                )}
              </div>

              {/* Action Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className={`w-full bg-[#1a1c24] text-white font-bold py-4 rounded-xl shadow-lg transition-all
                 flex items-center justify-center gap-3 ${
                   loading
                     ? "opacity-70 cursor-not-allowed"
                     : "hover:shadow-[#fcc221]/20"
                 }`}
              >
                {loading && (
                  <span className="w-5 h-5 border-3 border-[#fcc221] border-t-transparent rounded-full animate-spin" />
                )}
                {loading ? "Sending..." : "Send Reset Link"}
              </motion.button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">
                Or secure with
              </p>
              <p className="text-xs text-gray-400 px-8 leading-relaxed">
                By continuing, you agree to our{" "}
                <span className="underline cursor-pointer hover:text-gray-600">
                  Terms of Use
                </span>{" "}
                and{" "}
                <span className="underline cursor-pointer hover:text-gray-600">
                  Privacy Policy
                </span>
                .
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

// <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
//   <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
//     {/* LEFT IMAGE */}
//     <div className="relative hidden md:flex items-center justify-center ">
//       <Image
//         src={Login}
//         alt="Auth Illustration"
//         fill
//         className="object-contain p-10"
//         priority
//       />
//     </div>

//     {/* RIGHT FORM */}
//     <div className="p-8 md:p-12 flex flex-col justify-center">
//       <h2 className="text-2xl font-bold text-gray-900 mb-1">
//         Forgot your password?
//       </h2>

//       <p className="text-sm text-gray-500 mb-6">
//         No worries! Enter your email and we’ll send you a reset link.
//       </p>

//       <form className="space-y-4">
//         <input
//           type="email"
//           placeholder="Enter your email address"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="w-full px-4 py-3 border rounded-lg outline-none
//                      text-black placeholder-gray-400
//                      focus:ring-2 focus:ring-orange-400
//                      focus:border-orange-400 transition"
//         />
//         {errors.email && (
//           <p className="text-sm text-red-500 mt-1">{errors.email}</p>
//         )}

//         <button
//           type="submit"
//           onClick={handleSendEmail}
//           disabled={loading}
//           className={`w-full mt-4 flex items-center justify-center gap-2
//           font-semibold py-3 rounded-lg transition
//           ${
//             loading
//               ? "bg-green-400 cursor-not-allowed"
//               : "bg-green-600 hover:bg-green-700"
//           }
//           text-white`}
//         >
//           {loading && (
//             <span
//               className="w-5 h-5 border-2 border-white border-t-transparent
//              rounded-full animate-spin"
//             />
//           )}

//           {loading ? "Sending..." : "Send Reset Link"}
//         </button>
//       </form>

//       <p className="text-xs text-gray-500 mt-6 text-center">
//         <span className="underline cursor-pointer">Terms of Use</span> and{" "}
//         <span className="underline cursor-pointer">Privacy Policy</span>
//       </p>
//     </div>
//   </div>
// </div>
