"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { apiClient } from "@/services/apiClient";
import { useRouter } from "next/navigation";

import Login from "@/assets/images/login.jpg"


export default function Page() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [rolesOptions, setRolesOptions] = useState([])
  const [selectedRole, setSelectedRole] = useState("");

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");

  const getRoles = async () => {
    try {
      const response = await apiClient("/role", {
        method: "GET",
      });
      console.log("response", response)
      if (response?.success === true) {
        const rolesList = response.data.map(item => item.role);
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
    if(!mobile.trim()){
       errors.mobile = "mobile is required";
    }else if(mobile.length !== 10){
      errors.mobile = "enter a valid mobile number";
    }

    if (!password.trim()) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    return errors;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrors("");

    const validationErrors = validateRegisterForm({
      firstName,
      email,
      mobile,
      password,
      selectedRole
    });

    setErrors(validationErrors);
    console.log(validationErrors)

    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);

    try {
      const payload = {
        username: firstName,
        email,
        password,
        mobile,
        role : selectedRole

      };

      const res = await apiClient("/users/", {
        method: "POST",
        body: payload,
      });

      if (res.success === true) {
        alert("Account created successfully");
      }
      if(selectedRole !== "customer"){
        alert("you shall receive a mail when the admin activates your account")
      }
      router.push("/login");
    } catch (err) {
      console.log("ERR FULL:", err);
      alert(err?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* LEFT IMAGE */}
        <div className="relative hidden md:flex items-center justify-center">
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
            Get started absolutely free
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Already have an account?{" "}
            <span
              className="text-orange-500 font-medium cursor-pointer"
              onClick={() => router.push("/login")}
            >
              Sign in
            </span>
          </p>

          {/* FORM */}
          <form className="space-y-4">
            <input
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg outline-none
                         text-black placeholder-gray-400
                         focus:ring-2 focus:ring-orange-400
                         focus:border-orange-400 transition"
            />
            {errors.firstName && (
              <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>
            )}

            <input
              type="email"
              placeholder="Email address"
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

            <input
              type="tel"
              placeholder="Mobile Number"
              value={mobile}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, ""); 
                if (value.length <= 10) setMobile(value); 
            }}
              className="w-full px-4 py-3 border rounded-lg outline-none
                         text-black placeholder-gray-400
                         focus:ring-2 focus:ring-orange-400
                         focus:border-orange-400 transition"
            />
            {errors.mobile && (
              <p className="text-sm text-red-500 mt-1">{errors.mobile}</p>
            )}

            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg outline-none bg-white text-black focus:ring-2 focus:ring-orange-400 transition appearance-none"
            >
              <option value="" disabled>Select a role</option>

              {/* Use the state variable rolesOptions here */}
              {rolesOptions.length > 0 && rolesOptions.map((roleName, index) => (
                <option key={index} value={roleName}>
                  {roleName}
                </option>
              ))}
            </select>

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              onClick={handleRegister}
              disabled={loading}
              className={`w-full mt-4 flex items-center justify-center gap-2
              font-semibold py-3 rounded-lg transition
              ${loading
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

              {loading ? "Creating..." : "Create account"}
            </button>
          </form>

          <p className="text-xs text-gray-500 mt-6 text-center">
            By signing up, I agree to{" "}
            <span className="underline cursor-pointer">Terms of Use</span> and{" "}
            <span className="underline cursor-pointer">Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
}
