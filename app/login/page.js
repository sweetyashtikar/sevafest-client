"use client";

import Image from "next/image";
import { toast } from "react-toastify";
import { useState } from "react";
import { Eye, EyeOff, Mail, Phone, Lock } from "lucide-react";
import { apiClient } from "@/services/apiClient";
import { useRouter } from "next/navigation";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "@/redux/slices/authSlice";
import { motion, AnimatePresence } from "framer-motion";
import Login from "@/assets/images/Login.png";
import { useDispatch } from "react-redux";

export default function Page() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [loginType, setLoginType] = useState("email"); // "email" or "mobile

  const validateLoginForm = ({ email, password, mobile, loginType }) => {
    const errors = {};

    if (loginType === "email") {
      if (!email.trim()) {
        errors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = "Enter a valid email address";
      }
    } else {
      if (!mobile.trim()) {
        errors.mobile = "Mobile is required";
      } else if (!/^[0-9]{10}$/.test(mobile)) {
        errors.mobile = "Enter a valid 10-digit mobile number";
      }
    }

    if (!password.trim()) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    // show first error as toast
    const firstError = Object.values(errors)[0];
    if (firstError) toast.error(firstError);

    return errors;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({});

    const validationErrors = validateLoginForm({
      email,
      password,
      mobile,
      loginType,
    });

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);

    try {
      const payload = {
        password,
        ...(loginType === "email" ? { email } : { mobile }),
      };

      const res = await apiClient("/login", {
        method: "POST",
        body: payload,
      });

      if (res.success === true) {
        console.log("res", res);

        dispatch(
          loginSuccess({
            user: res.user,
            token: res.token,
          }),
        );

        console.log("res", res);

        document.cookie = `token=${res.token}; path=/`;
        document.cookie = `role=${res.user.role.role}; path=/`;

        const minimalUser = {
          id: res.user.id || res.user._id,
          username: res.user.username,
          email: res.user.email,
          mobile: res.user.mobile,
          role: res.user.role?.role,
          balance: res.user.balance,
          status: res.user.status,
          zipcodes: res.user.zipcodes,
          createdAt: res.user.createdAt,
          last_login: res.user.last_login,
          active: res.user.active,
        };

        console.log("res", minimalUser);

        document.cookie = `user=${encodeURIComponent(
          JSON.stringify(minimalUser),
        )}; path=/; SameSite=Lax`;

        toast.success("Login successfully");

        const role = res.user.role.role;

        switch (role) {
          case "admin":
            router.push("/admin");
            break;
          case "vendor":
            router.push("/vendor");
            break;
          case "delivery_boy":
            router.push("/delivery");
            break;
          case "manager":
            router.push("/manager");
            break;
          case "distributor":
            router.push("/distributor");
            break;
          case "sub_distributor":
            router.push("/sub_distributor");
            break;
          case "web designer":
          case "webdesigner":
            router.push("/designer");
            break;
          case "worker":
            router.push("/worker");
            break;
          case "courier":
            router.push("/courier");
            break;
          default:
            router.push("/");
        }
      }
    } catch (err) {
      console.log("ERR FULL:", err);
      dispatch(loginFailure());
      toast.error(err?.message || "Login failed. Try again.");
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
        <div className="relative hidden md:flex items-center justify-center p-12 overflow-hidden">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="relative w-full h-[400px]"
          >
            <div className="relative hidden md:flex items-center justify-center p-12">
              <Image
                src={Login}
                alt="Auth Illustration"
                width={450}
                height={450}
                className="object-contain"
                priority
              />
            </div>
          </motion.div>
          <div className="absolute top-[-25%] left-[-25%] w-80 h-80 bg-[#fcc221]  rounded-full"></div>
          <div className="absolute bottom-[-30%] right-[-50%] w-96 h-96 bg-[#fdd835] rounded-full"></div>
        </div>

        {/* RIGHT SIDE: FORM */}
        <div className="p-8 md:p-14 flex flex-col justify-center bg-white">
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-3xl font-bold text-[#1a1c24] mb-2">
              Get started <span className="text-[#fcc221]">free</span>
            </h2>
            <p className="text-sm text-gray-500 mb-8">
              Already have an account?{" "}
              <span
                className="text-[#fcc221] font-bold cursor-pointer hover:text-[#fdd835] transition"
                onClick={() => router.push("/register")}
              >
                Sign Up
              </span>
            </p>

            <div className="flex mb-8 bg-[#f3f4f7] p-1 rounded-xl relative">
              <button
                type="button"
                className={`flex-1 py-3 text-center font-bold z-10 transition-colors duration-300 ${
                  loginType === "email" ? "text-[#1a1c24]" : "text-gray-400"
                }`}
                onClick={() => setLoginType("email")}
              >
                Email
              </button>
              <button
                type="button"
                className={`flex-1 py-3 text-center font-bold z-10 transition-colors duration-300 ${
                  loginType === "mobile" ? "text-[#1a1c24]" : "text-gray-400"
                }`}
                onClick={() => setLoginType("mobile")}
              >
                Mobile
              </button>

              <motion.div
                className="absolute top-1 bottom-1 left-1 bg-[#fcc221] rounded-lg shadow-sm"
                animate={{ x: loginType === "email" ? "0%" : "98%" }}
                style={{ width: "49%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            </div>

            <form className="space-y-5" onSubmit={handleLogin}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={loginType}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  {loginType === "email" ? (
                    <div className="relative">
                      <Mail
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        size={20}
                      />
                      <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 border-2 border-[#f3f4f7] rounded-xl focus:border-[#fcc221] outline-none 
                        transition-all bg-[#f3f4f7]/30 focus:bg-white"
                      />
                    </div>
                  ) : (
                    <div className="relative">
                      <Phone
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        size={20}
                      />
                      <input
                        type="tel"
                        placeholder="Mobile Number"
                        value={mobile}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          if (val.length <= 10) setMobile(val);
                        }}
                        className="w-full pl-12 pr-4 py-4 border-2 border-[#f3f4f7] rounded-xl focus:border-[#fcc221] outline-none
                         transition-all bg-[#f3f4f7]/30 focus:bg-white"
                      />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Password */}
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 border-2 border-[#f3f4f7] rounded-xl focus:border-[#fcc221] outline-none 
                  transition-all bg-[#f3f4f7]/30 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#fcc221]"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <div className="flex justify-end">
                <span
                  onClick={() => router.push("/forgot-password")}
                  className="text-sm font-semibold text-[#1a1c24] cursor-pointer hover:text-[#fcc221] transition"
                >
                  Forgot password?
                </span>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                onClick={handleLogin}
                disabled={loading}
                className="w-full bg-[#1a1c24] text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-[#fcc221]/20 transition-all 
                flex items-center justify-center gap-3 mt-6"
              >
                {loading ? (
                  <span className="w-5 h-5 border-3 border-[#fcc221] border-t-transparent text-white rounded-full animate-spin" />
                ) : (
                  "Login Now"
                )}
              </motion.button>
            </form>

            <p className="text-xs text-gray-400 mt-8 text-center px-4">
              By signing up, I agree to{" "}
              <span className="underline text-gray-600">Terms of Use</span> and{" "}
              <span className="underline text-gray-600">Privacy Policy</span>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

// <div className="min-h-screen flex items-center justify-center bg-[#f3f4f7] px-4 font-sans text-[#1a1c24]">
//     <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
//       {/* LEFT IMAGE */}
//       <div className="relative hidden md:flex items-center justify-center ">
//         <Image
//           src={Login}
//           alt="Auth Illustration"
//           fill
//           className="object-contain p-10"
//           priority
//         />
//       </div>

//       {/* RIGHT FORM */}
//       <div className="p-8 md:p-12 flex flex-col justify-center">
//         <h2 className="text-2xl font-bold text-gray-900 mb-1">
//           Get started absolutely free
//         </h2>
//         <p className="text-sm text-gray-500 mb-6">
//           Already have an account?{" "}
//           <span
//             className="text-orange-500 font-medium cursor-pointer"
//             onClick={() => router.push("/register")}
//           >
//             Sign Up
//           </span>
//         </p>

//         {/* TAB SWITCHER */}
//         <div className="flex mb-6 border-b">
//           <button
//             type="button"
//             className={`flex-1 py-2 text-center font-medium transition ${
//               loginType === "email"
//                 ? "border-b-2 border-orange-500 text-orange-500"
//                 : "text-gray-400"
//             }`}
//             onClick={() => {
//               setLoginType("email");
//               setErrors({});
//             }}
//           >
//             Email
//           </button>
//           <button
//             type="button"
//             className={`flex-1 py-2 text-center font-medium transition ${
//               loginType === "mobile"
//                 ? "border-b-2 border-orange-500 text-orange-500"
//                 : "text-gray-400"
//             }`}
//             onClick={() => setLoginType("mobile")}
//           >
//             Mobile
//           </button>
//         </div>

//         {/* FORM */}
//         <form className="space-y-4" onSubmit={handleLogin}>
//           {loginType === "email" ? (
//             <div>
//               <input
//                 type="email"
//                 placeholder="Email address"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="w-full px-4 py-3 border rounded-lg outline-none
//                        text-black placeholder-gray-400
//                        focus:ring-2 focus:ring-orange-400
//                        focus:border-orange-400 transition"
//               />
//               {errors.email && (
//                 <p className="text-sm text-red-500 mt-1">{errors.email}</p>
//               )}
//             </div>
//           ) : (
//             <div>
//               <input
//                 type="tel"
//                 placeholder="Mobile Number"
//                 value={mobile}
//                 onChange={(e) => {
//                   const val = e.target.value.replace(/\D/g, "");
//                   if (val.length <= 10) setMobile(val);
//                 }}
//                 className="w-full px-4 py-3 border rounded-lg outline-none
//                        text-black placeholder-gray-400
//                        focus:ring-2 focus:ring-orange-400
//                        focus:border-orange-400 transition"
//               />
//               {errors.mobile && (
//                 <p className="text-sm text-red-500 mt-1">{errors.mobile}</p>
//               )}
//             </div>
//           )}
//           {/* Password */}
//           <div className="relative">
//             <input
//               type={showPassword ? "text" : "password"}
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full px-4 py-3 border rounded-lg outline-none
//                          text-black placeholder-gray-400
//                          focus:ring-2 focus:ring-orange-400
//                          focus:border-orange-400 transition"
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
//             >
//               {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//             </button>
//           </div>
//           {errors.password && (
//             <p className="text-sm text-red-500 mt-1">{errors.password}</p>
//           )}

//           <div className="flex justify-end mt-2">
//             <span
//               className="text-sm text-orange-500 cursor-pointer hover:underline"
//               onClick={() => router.push("/forgot-password")}
//             >
//               Forgot password?
//             </span>
//           </div>

//           <button
//             type="submit"
//             onClick={handleLogin}
//             disabled={loading}
//             className={`w-full mt-4 flex items-center justify-center gap-2
//             font-semibold py-3 rounded-lg transition
//             ${
//               loading
//                 ? "bg-green-400 cursor-not-allowed"
//                 : "bg-green-600 hover:bg-green-700"
//             }
//             text-white`}
//           >
//             {loading && (
//               <span
//                 className="w-5 h-5 border-2 border-white border-t-transparent
//                rounded-full animate-spin"
//               />
//             )}

//             {loading ? "Wait..." : "Login"}
//           </button>
//         </form>

//         <p className="text-xs text-gray-500 mt-6 text-center">
//           By signing up, I agree to{" "}
//           <span className="underline cursor-pointer">Terms of Use</span> and{" "}
//           <span className="underline cursor-pointer">Privacy Policy</span>
//         </p>
//       </div>
//     </div>
//   </div>
