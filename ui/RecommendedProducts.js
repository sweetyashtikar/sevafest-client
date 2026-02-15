"use client";

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import ProductCard from "@/ui/ProductCard";
import { apiClient } from "@/services/apiClient";

export default function RecommendedProducts() {
  const router = useRouter();

  const recommended = useSelector(
    (state) => state.recommendation.recommended
  );

  const getProductPrice = (product) => {
    if (product?.effectivePrice != null) return product.effectivePrice;
    if (product?.simpleProduct?.sp_specialPrice != null)
      return product.simpleProduct.sp_specialPrice;
    if (product?.simpleProduct?.sp_price != null)
      return product.simpleProduct.sp_price;
    return null;
  };

  const addToCart = async (productId, qty = 1) => {
    try {
      const res = await apiClient("/viewCart/addtoCart", {
        method: "POST",
        body: {
          productId,
          qty,
        },
      });

      if (res?.success) {
        console.log("✅ Added to cart");
      }
    } catch (err) {
      console.error("Add to cart error", err);
    }
  };

  if (!recommended || recommended.length === 0) return null;

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-semibold mb-6 text-black">
        🔥 Recommended For You
      </h2>

      <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide">
        {recommended.map((product) => (
          <div key={product._id} className="min-w-[260px]">
            <ProductCard
              image={product?.mainImage}
              name={product?.name}
              category={product?.categoryId?.name ?? "Uncategorized"}
              shortDescription={product?.shortDescription}
              price={getProductPrice(product)}
              originalPrice={product?.simpleProduct?.sp_price}
              discount={product?.discountPercentage}
              rating={Math.round(product.rating?.average || 0)}
              reviews={product.rating?.count || 0}
              onNavigate={() =>
                router.push(`/products/${product._id}`)
              }
              onAddToCart={() => addToCart(product._id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
