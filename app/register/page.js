"use client";

import Image from "next/image";
import Login from "@/assets/images/Login.png";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { apiClient } from "@/services/apiClient";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, User, Mail, Phone, Briefcase } from "lucide-react";

export default function Page() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [rolesOptions, setRolesOptions] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");

  const getRoles = async () => {
    try {
      const response = await apiClient("/role", {
        method: "GET",
      });
      console.log("response", response);
      if (response?.success === true) {
        const rolesList = response.data.map((item) => item.role);
        console.log("Roles fetched successfully:", rolesList);

        setRolesOptions(rolesList);
        return rolesList;
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  useEffect(() => {
    getRoles();
  }, []);

  const validateRegisterForm = ({ firstName, email, password, mobile }) => {
    const errors = {};

    if (!firstName.trim()) {
      errors.firstName = "First name is required";
    }

    if (!email.trim()) {
      errors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.email = "Enter a valid email address";
      }
    }

    if (!mobile.trim()) {
      errors.mobile = "Mobile is required";
    } else if (!/^[0-9]{10}$/.test(mobile)) {
      errors.mobile = "Enter a valid mobile number";
    }

    if (!password.trim()) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    const firstError = Object.values(errors)[0];
    if (firstError) toast.error(firstError);

    return errors;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrors({});

    const validationErrors = validateRegisterForm({
      firstName,
      email,
      mobile,
      password,
      selectedRole,
    });

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);

    try {
      const payload = {
        username: firstName,
        email,
        password,
        mobile,
        role: selectedRole,
      };

      const res = await apiClient("/users/", {
        method: "POST",
        body: payload,
      });

      if (res.success === true) {
        toast.success("Account created successfully");

        if (selectedRole !== "customer") {
          toast.info(
            "You shall receive a mail when the admin activates your account",
          );
        }

        router.push("/login");
      }
    } catch (err) {
      console.log("ERR FULL:", err);

      toast.error(err?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f4f7] px-4 py-8 font-sans text-[#1a1c24]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2"
      >
        {/* LEFT SIDE: ILLUSTRATION */}
        <div className="relative hidden md:flex items-center justify-center p-12 overflow-hidden">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="relative z-10 w-full h-[400px] flex items-center justify-center"
          >
            <Image
              src={Login}
              alt="Register Illustration"
              width={450}
              height={450}
              className="object-contain"
              priority
            />
          </motion.div>

          <div className="absolute top-[-25%] left-[-25%] w-80 h-80 bg-[#fcc221]  rounded-full"></div>
          <div className="absolute bottom-[-30%] right-[-50%] w-96 h-96 bg-[#fdd835] rounded-full"></div>
        </div>

        {/* RIGHT SIDE: FORM */}
        <div className="p-8 md:p-14 flex flex-col justify-center bg-white border-l border-gray-50">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h2
              variants={itemVariants}
              className="text-3xl font-bold text-[#1a1c24] mb-2"
            >
              Get started{" "}
              <span className="text-[#fcc221]">absolutely free</span>
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="text-sm text-gray-500 mb-8"
            >
              Already have an account?{" "}
              <span
                className="text-[#fcc221] font-bold cursor-pointer hover:underline transition"
                onClick={() => router.push("/login")}
              >
                Sign in
              </span>
            </motion.p>

            {/* FORM */}
            <form className="space-y-4" onSubmit={handleRegister}>
              {/* First Name */}
              <motion.div variants={itemVariants} className="relative">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-[#f3f4f7] rounded-xl focus:border-[#fcc221] outline-none transition-all bg-[#f3f4f7]/30 focus:bg-white text-black"
                />
              </motion.div>

              {/* Email */}
              <motion.div variants={itemVariants} className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-[#f3f4f7] rounded-xl focus:border-[#fcc221] outline-none transition-all bg-[#f3f4f7]/30 focus:bg-white text-black"
                />
              </motion.div>

              <motion.div variants={itemVariants} className="relative">
                <Phone
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="tel"
                  placeholder="Mobile Number"
                  value={mobile}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 10) setMobile(value);
                  }}
                  className="w-full pl-12 pr-4 py-3 border-2 border-[#f3f4f7] rounded-xl focus:border-[#fcc221] outline-none transition-all bg-[#f3f4f7]/30 focus:bg-white text-black"
                />
              </motion.div>

              <motion.div variants={itemVariants} className="relative">
                <Briefcase
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-[#f3f4f7] rounded-xl focus:border-[#fcc221] outline-none bg-[#f3f4f7]/30 focus:bg-white text-black transition appearance-none cursor-pointer"
                >
                  <option value="" disabled>
                    Select a role
                  </option>
                  {rolesOptions.map((roleName, index) => (
                    <option key={index} value={roleName}>
                      {roleName}
                    </option>
                  ))}
                </select>
              </motion.div>

              {/* Password */}
              <motion.div variants={itemVariants} className="relative">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-[#f3f4f7] rounded-xl focus:border-[#fcc221] outline-none transition-all bg-[#f3f4f7]/30 focus:bg-white text-black"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#fcc221]"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className={`w-full mt-4 flex items-center justify-center gap-2 font-bold py-4 rounded-xl shadow-lg transition-all ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#1a1c24] text-white"
                }`}
              >
                {loading && (
                  <span className="w-5 h-5 border-2 border-[#fcc221] border-t-transparent rounded-full animate-spin" />
                )}
                {loading ? "Creating..." : "Create account"}
              </motion.button>
            </form>

            <motion.p
              variants={itemVariants}
              className="text-xs text-gray-400 mt-6 text-center"
            >
              By signing up, I agree to{" "}
              <span className="underline cursor-pointer hover:text-gray-600">
                Terms of Use
              </span>{" "}
              and{" "}
              <span className="underline cursor-pointer hover:text-gray-600">
                Privacy Policy
              </span>
            </motion.p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

// <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
//   <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
//     {/* LEFT IMAGE */}
//     <div className="relative hidden md:flex items-center justify-center">
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
//         Get started absolutely free
//       </h2>
//       <p className="text-sm text-gray-500 mb-6">
//         Already have an account?{" "}
//         <span
//           className="text-orange-500 font-medium cursor-pointer"
//           onClick={() => router.push("/login")}
//         >
//           Sign in
//         </span>
//       </p>

//       {/* FORM */}
//       <form className="space-y-4">
//         <input
//           type="text"
//           placeholder="First name"
//           value={firstName}
//           onChange={(e) => setFirstName(e.target.value)}
//           className="w-full px-4 py-3 border rounded-lg outline-none
//                      text-black placeholder-gray-400
//                      focus:ring-2 focus:ring-orange-400
//                      focus:border-orange-400 transition"
//         />
//         {errors.firstName && (
//           <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>
//         )}

//         <input
//           type="email"
//           placeholder="Email address"
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

//         <input
//           type="tel"
//           placeholder="Mobile Number"
//           value={mobile}
//           onChange={(e) => {
//             const value = e.target.value.replace(/\D/g, "");
//             if (value.length <= 10) setMobile(value);
//           }}
//           className="w-full px-4 py-3 border rounded-lg outline-none
//                      text-black placeholder-gray-400
//                      focus:ring-2 focus:ring-orange-400
//                      focus:border-orange-400 transition"
//         />
//         {errors.mobile && (
//           <p className="text-sm text-red-500 mt-1">{errors.mobile}</p>
//         )}

//         <select
//           value={selectedRole}
//           onChange={(e) => setSelectedRole(e.target.value)}
//           className="w-full px-4 py-3 border rounded-lg outline-none bg-white text-black focus:ring-2
//            focus:ring-orange-400 transition appearance-none"
//         >
//           <option value="" disabled>
//             Select a role
//           </option>

//           {/* Use the state variable rolesOptions here */}
//           {rolesOptions.length > 0 &&
//             rolesOptions.map((roleName, index) => (
//               <option key={index} value={roleName}>
//                 {roleName}
//               </option>
//             ))}
//         </select>

//         {/* Password */}
//         <div className="relative">
//           <input
//             type={showPassword ? "text" : "password"}
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="w-full px-4 py-3 border rounded-lg outline-none
//                        text-black placeholder-gray-400
//                        focus:ring-2 focus:ring-orange-400
//                        focus:border-orange-400 transition"
//           />
//           <button
//             type="button"
//             onClick={() => setShowPassword(!showPassword)}
//             className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
//           >
//             {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//           </button>
//         </div>
//         {errors.password && (
//           <p className="text-sm text-red-500 mt-1">{errors.password}</p>
//         )}

//         <button
//           type="submit"
//           onClick={handleRegister}
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

//           {loading ? "Creating..." : "Create account"}
//         </button>
//       </form>

//       <p className="text-xs text-gray-500 mt-6 text-center">
//         By signing up, I agree to{" "}
//         <span className="underline cursor-pointer">Terms of Use</span> and{" "}
//         <span className="underline cursor-pointer">Privacy Policy</span>
//       </p>
//     </div>
//   </div>
// </div>
