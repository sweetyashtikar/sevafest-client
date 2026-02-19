"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/services/apiClient";


export default function Page() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiClient('/order/get/deliveryBoys');
        console.log("res", res)
      } catch (err) {
        console.log("err", err);
      }
    };
    fetchData();
  }, []);
  return <></>;
}
