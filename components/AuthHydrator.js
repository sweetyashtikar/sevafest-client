'use client';

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { hydrateAuth, logout } from "@/redux/slices/authSlice";
import { getCookie } from "@/utils/getCookies"; 

export default function AuthHydrator() {
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("🟡 AuthHydrator mounted");

    const token = getCookie("token");
    const userStr = getCookie("user");

    console.log("🍪 token:", token);
    console.log("🍪 userStr:", userStr);

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);

        dispatch(
          hydrateAuth({
            token,
            user,
          })
        );

        console.log("✅ Redux hydrated from cookies");
      } catch (e) {
        console.error("❌ user JSON parse failed", e);
        dispatch(logout());
      }
    } else {
      console.warn("⚠️ Cookies missing → logout");
      dispatch(logout());
    }
  }, [dispatch]);

  return null;
}
