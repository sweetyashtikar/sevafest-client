'use client';

import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { hydrateAuth } from "@/redux/slices/authSlice";

export default function AuthHydrator() {
  const dispatch = useDispatch();
  const hydratedRef = useRef(false);
  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;

    try {
      const auth = localStorage.getItem("auth");
      if (!auth) return;

      const parsed = JSON.parse(auth);


      if (!parsed?.token || !parsed?.user) {
        console.warn("⚠️ Invalid auth in storage, clearing");
        localStorage.removeItem("auth");
        return;
      }

      console.log("🔁 [AUTH] Hydrating from localStorage", parsed);

      dispatch(
        hydrateAuth({
          user: parsed.user,
          token: parsed.token,
        })
      );
    } catch (err) {
      console.error("❌ Failed to hydrate auth", err);
      localStorage.removeItem("auth");
    }
  }, [dispatch]);

  return null;
}
