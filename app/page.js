"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { apiClient } from "@/services/apiClient";
import { fetchActiveCategories } from "@/redux/slices/categorySlice";
import { Loader } from "@/ui/Loader";

const HomeBannerSlider = dynamic(() => import("@/ui/HomeBannerSlider"), {
  ssr: false,
  loading: () => <div className="h-96 animate-puls rounded-xl" />,
});

const TopTrendingProducts = dynamic(() => import("@/ui/TopTrendingProducts"), {
  ssr: false,
  loading: () => <div className="h-96 animate-pulse rounded-xl" />,
});

const Swiper = dynamic(() => import("@/ui/Swiper"), {
  ssr: false,
  loading: () => <div className="h-96 animate-pulse rounded-xl" />,
});

const PlanCard = dynamic(() => import("@/components/plans/PlanCard"), {
  ssr: false,
  loading: () => <div className="h-96 animate-puls rounded-xl" />,
});

const ProductsRow = dynamic(() => import("@/ui/ProductsRow"), {
  ssr: false,
  loading: () => <div className="h-96 animate-pulse rounded-xl" />,
});

export default function Page() {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [banners, setBanners] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const fetchData = async () => {
    setIsDataLoading(true);
    try {
      const [prodRes, bannerRes] = await Promise.all([
        apiClient(`product?page=1&limit=1000`),
        apiClient(`banners?page=1&limit=1000`),
      ]);

      if (prodRes?.success) setProducts(prodRes.data.products || []);
      if (bannerRes?.success) setBanners(bannerRes.data || []);
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    dispatch(fetchActiveCategories());
  }, [dispatch]);

  console.log("products", products);

  return (
    <>
      {isPageLoading && <Loader fullScreen={true} />}
      <main className="min-h-screen bg-white">
        <div className="py-5  " />
        <HomeBannerSlider banners={banners} />
        <Swiper />
        <PlanCard />
        <TopTrendingProducts products={products} loading={isDataLoading} />
        <ProductsRow name="Sahyadri Elaichi Tea" products={products} />
        <ProductsRow name="Combo Offers" products={products} />
        <ProductsRow name="Chochlate" products={products} />
        <ProductsRow
          name="Biscuits, Drinks & Packaged Foods"
          products={products}
        />
      </main>
    </>
  );
}
