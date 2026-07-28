"use server";

import { db } from "@/db";
import { products } from "@/db/schema";
import { ProductType } from "@/types";
import { eq } from "drizzle-orm";
import { updateTag } from "next/cache";
import { assertAdmin } from "@/lib/admin/assert-admin";

export const approveProductAction = async (productId: ProductType["id"]) => {
  try {
    await assertAdmin();

    await db
      .update(products)
      .set({ status: "approved", approvedAt: new Date() })
      .where(eq(products.id, productId));

    // Expire all product list caches (landing, explore, admin) and
    // the specific product detail page immediately.
    updateTag("products");
    updateTag(`product-${productId}`);

    return {
      success: true,
      message: "Product approved successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message:
        error instanceof Error && error.message === "Forbidden"
          ? "You do not have permission to perform this action."
          : "Failed to approve product",
    };
  }
};

export const rejectProductAction = async (productId: ProductType["id"]) => {
  try {
    await assertAdmin();

    await db
      .update(products)
      .set({ status: "rejected" })
      .where(eq(products.id, productId));

    updateTag("products");
    updateTag(`product-${productId}`);

    return {
      success: true,
      message: "Product rejected successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message:
        error instanceof Error && error.message === "Forbidden"
          ? "You do not have permission to perform this action."
          : "Failed to reject product",
    };
  }
};

export const deleteProductAction = async (productId: ProductType["id"]) => {
  try {
    await assertAdmin();

    await db.delete(products).where(eq(products.id, productId));

    updateTag("products");

    return {
      success: true,
      message: "Product deleted successfully",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message:
        error instanceof Error && error.message === "Forbidden"
          ? "You do not have permission to perform this action."
          : "Failed to delete product",
    };
  }
};
