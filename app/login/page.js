"use client";

import Image from "next/image";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { apiClient } from "@/services/apiClient";
import { useRouter } from "next/navigation";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "@/redux/slices/authSlice";

import Login from "@/assets/images/login.jpg";
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

    // Validate Email OR Mobile based on active tab
    if (loginType === "email") {
      if (!email.trim()) {
        errors.email = "Email is required";
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          errors.email = "Enter a valid email address";
        }
      }
    } else {
      if (!mobile.trim()) {
        errors.mobile = "Mobile is required";
      } else if (mobile.length !== 10) {
        errors.mobile = "Enter a valid 10-digit mobile number";
      }
    }

    if (!password.trim()) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

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
          id: res.user.id,
          name: res.user.username,
          email: res.user.email,
          role: res.user.role?.id || res.user.role,
        };

        console.log("res", minimalUser);

        document.cookie = `user=${encodeURIComponent(
          JSON.stringify(minimalUser),
        )}; path=/; SameSite=Lax`;

        alert("Login successfully");

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
      alert(err?.message || "Registration failed. Try again.");
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
            Get started absolutely free
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Already have an account?{" "}
            <span
              className="text-orange-500 font-medium cursor-pointer"
              onClick={() => router.push("/register")}
            >
              Sign Up
            </span>
          </p>

          {/* TAB SWITCHER */}
          <div className="flex mb-6 border-b">
            <button
              type="button"
              className={`flex-1 py-2 text-center font-medium transition ${
                loginType === "email"
                  ? "border-b-2 border-orange-500 text-orange-500"
                  : "text-gray-400"
              }`}
              onClick={() => {
                setLoginType("email");
                setErrors({});
              }}
            >
              Email
            </button>
            <button
              type="button"
              className={`flex-1 py-2 text-center font-medium transition ${
                loginType === "mobile"
                  ? "border-b-2 border-orange-500 text-orange-500"
                  : "text-gray-400"
              }`}
              onClick={() => setLoginType("mobile")}
            >
              Mobile
            </button>
          </div>

          {/* FORM */}
          <form className="space-y-4" onSubmit={handleLogin}>
            {loginType === "email" ? (
              <div>
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
              </div>
            ) : (
              <div>
                <input
                  type="tel"
                  placeholder="Mobile Number"
                  value={mobile}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    if (val.length <= 10) setMobile(val);
                  }}
                  className="w-full px-4 py-3 border rounded-lg outline-none
                         text-black placeholder-gray-400
                         focus:ring-2 focus:ring-orange-400
                         focus:border-orange-400 transition"
                />
                {errors.mobile && (
                  <p className="text-sm text-red-500 mt-1">{errors.mobile}</p>
                )}
              </div>
            )}
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

            <div className="flex justify-end mt-2">
              <span
                className="text-sm text-orange-500 cursor-pointer hover:underline"
                onClick={() => router.push("/forgot-password")}
              >
                Forgot password?
              </span>
            </div>

            <button
              type="submit"
              onClick={handleLogin}
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

              {loading ? "Wait..." : "Login"}
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
