"use client";

import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { apiClient } from "@/services/apiClient";
import { toast } from "react-toastify";
import ProductCard from "@/ui/ProductCard";
import { fetchCart } from "@/redux/slices/cartSlice";

export default function RecommendedProducts() {
  const router = useRouter();
  const { user } = useSelector((a) => a.auth);
  const dispatch = useDispatch();
  const recommended = useSelector((state) => state.recommendation.recommended);

  const getProductPrice = (product) => {
    if (product?.effectivePrice != null) return product.effectivePrice;
    if (product?.simpleProduct?.sp_specialPrice != null)
      return product.simpleProduct.sp_specialPrice;
    if (product?.simpleProduct?.sp_price != null)
      return product.simpleProduct.sp_price;
    return null;
  };

  const getProductImage = (product) => {
    if (product?.mainImage) return product.mainImage;

    if (product?.variants?.length > 0) {
      const variantImage = product.variants?.[0]?.variant_images?.[0];
      if (variantImage) return variantImage;
    }

    return null;
  };

  const addToCart = async (product, qty = 1) => {
    if (!user) {
      toast.warning("Please login to add product to cart");
      router.push("/login");
      throw new Error("User not logged in");
    }

    try {
      const payload = {
        productId: product._id,
        qty,
      };

      if (product.productType === "variable_product") {
        payload.variantId = product?.variants?.[0]?._id;
      }

      const res = await apiClient("/viewCart/addtoCart", {
        method: "POST",
        body: payload,
      });

      if (res?.success) {
        dispatch(fetchCart());
        toast.success("Product added to cart ");
      } else {
        toast.error(res?.message || "Failed to add item to cart");
      }
      return res;
    } catch (err) {
      console.error("Add to cart error", err);
      toast.error("Something went wrong while adding to cart");
    }
  };

  if (!recommended || recommended.length === 0) return null;

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-semibold mb-6 text-black">
        Suggest For You
      </h2>

      <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide">
        {recommended.map((product) => (
          <div key={product._id} className="min-w-[260px]">
            <ProductCard
              image={getProductImage(product)}
              name={product?.name}
              category={product?.categoryId?.name ?? "Uncategorized"}
              shortDescription={product?.shortDescription}
              price={getProductPrice(product)}
              originalPrice={product?.simpleProduct?.sp_price}
              discount={product?.discountPercentage}
              rating={Math.round(product.rating?.average || 0)}
              reviews={product.rating?.count || 0}
              onNavigate={() => router.push(`/products/${product._id}`)}
              onAddToCart={() => addToCart(product)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
