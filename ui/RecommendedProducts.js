"use client";

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import ProductCard from "@/ui/ProductCard";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/slices/cartSlice";
import { toast } from "react-toastify";

export default function RecommendedProducts() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((a) => a.auth);

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

  const isOutOfStock = (product) => product.inStock === false;

  const addToCartAction = async (product, qty = 1) => {
    if (!user) {
      toast.warning("Please login to add product to cart");
      router.push("/login");
      throw new Error("User not logged in");
    }

    try {
      let variantId = null;

      if (product.productType === "variable_product") {
        const firstVariant = product.variants?.find(
          (v) => v.variant_isActive && v.variant_totalStock > 0,
        );
        variantId = firstVariant?._id;
      }

      await dispatch(
        addToCart({ productId: product._id, variantId, qty }),
      ).unwrap();
      console.log("✅ Added to cart");
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
              image={getProductImage(product)}
              name={product?.name}
              category={product?.categoryId?.name ?? "Uncategorized"}
              shortDescription={product?.shortDescription}
              price={getProductPrice(product)}
              originalPrice={product?.simpleProduct?.sp_price}
              discount={product?.discountPercentage}
              rating={Math.round(product.rating?.average || 0)}
              reviews={product.rating?.count || 0}
              outOfStock={isOutOfStock(product)}
              onNavigate={() => router.push(`/products/${product._id}`)}
              onAddToCart={() => addToCartAction(product)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}