"use client";

import React, { useEffect, useState } from "react";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Phone,
  Lock,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { apiClient } from "@/services/apiClient";

const Page = () => {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [rolesOptions, setRolesOptions] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const getRoles = async () => {
    try {
      const response = await apiClient("/role", {
        method: "GET",
      });
      console.log("response", response);
      if (response?.success === true) {
        const rolesList = response.data
          .filter((item) => item.role.toLowerCase() === "vendor")
          .map((item) => item.role);

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

  const clearState = () => {
    setFirstName("");
    setEmail("");
    setMobile("");
    setSelectedRole("");
    setPassword("");
    setErrors("");
  };

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
      errors.mobile = "mobile is required";
    } else if (mobile.length !== 10) {
      errors.mobile = "enter a valid mobile number";
    }

    if (!password.trim()) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    if (!selectedRole) {
      errors.selectedRole = "Role is required";
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors("");

    const validationErrors = validateRegisterForm({
      firstName,
      email,
      mobile,
      password,
      selectedRole,
    });

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      Object.values(validationErrors).forEach((error) => {
        toast.error(error);
      });
      return;
    }

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
        clearState();
        toast.success("Account created successfully");
      }
    } catch (err) {
      console.log("ERR FULL:", err);
      toast.error(err?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-white overflow-hidden">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex lg:w-1/2 bg-blue-600 relative items-center justify-center p-12 text-white"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full -mr-20 -mt-20 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-700 rounded-full -ml-32 -mb-32 opacity-30"></div>

        <div className="relative z-10 max-w-md">
          <h1 className="text-5xl font-bold leading-tight">
            Grow your business with our{" "}
            <span className="text-blue-200">Vendor Network.</span>
          </h1>
          <p className="mt-6 text-lg text-blue-100">
            Thousands of vendors are already selling. Join the community and
            start earning today.
          </p>

          <div className="mt-10 space-y-4">
            {["Quick Onboarding", "Lowest Commission", "24/7 Support"].map(
              (text, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="text-blue-300" size={24} />
                  <span className="text-lg font-medium">{text}</span>
                </div>
              ),
            )}
          </div>
        </div>
      </motion.div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md bg-white p-8 md:p-10 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-gray-100"
        >
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Get Started</h2>
            <p className="text-gray-500 mt-2">
              Create your vendor account in minutes.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700 ml-1">
                Full Name
              </label>
              <div className="relative group">
                <User
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors"
                  size={20}
                />
                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter your name"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 text-black py-3 
                  pl-10 pr-4 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-600"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2
                   text-gray-400 group-focus-within:text-blue-600 transition-colors"
                  size={20}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="name@company.com"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 outline-none 
                   text-black transition-all focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-600"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700 ml-1">
                Mobile Number
              </label>
              <div className="relative group">
                <Phone
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 text-black transition-colors"
                  size={20}
                />
                <input
                  type="tel"
                  name="mobileNumber"
                  placeholder="+91 00000 00000"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 outline-none transition-all text-black
                   focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-600"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700 ml-1">
                Select Role
              </label>

              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 px-4 outline-none 
                focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-600 text-black"
              >
                <option value="">Select role</option>
                {rolesOptions.map((role, index) => (
                  <option key={index} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700 ml-1">
                Password
              </label>
              <div className="relative group">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors"
                  size={20}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-12 outline-none transition-all
                   focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-600 text-black"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-4 bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 hover:shadow-lg
               hover:shadow-blue-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              Register Now
              <ArrowRight size={20} />
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Page;
