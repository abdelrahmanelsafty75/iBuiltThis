'use server';

import { auth, currentUser } from "@clerk/nextjs/server";
import { productSchema } from "./product-validation";
import { products, votes } from "@/db/schema";
import { db } from "@/db";
import { FormState } from "@/types";
import { and, eq, sql } from "drizzle-orm";
import { updateTag } from "next/cache";

const ALREADY_VOTED_MESSAGE = "You have already voted on this product.";


export const addProductAction = async (formData: FormData): Promise<FormState> => {
  try {
    const { userId, orgId } = await auth();

    if (!userId) {
      return {
        success: false,
        message: "You must be signed in to submit a product.",
        errors: undefined,
      };
    }

    if (!orgId) {
      return {
        success: false,
        message: "You must be a member of an organization to submit a product.",
        errors: undefined,
      };
    }

    const rawFormData = Object.fromEntries(formData.entries());

    const validatedData = productSchema.safeParse(rawFormData);
    if (!validatedData.success) {
      return {
        success: false,
        errors: validatedData.error.flatten().fieldErrors,
        message: "Invalid data.",
      };
    }

    const { name, slug, tagline, description, websiteUrl, tags } = validatedData.data;
    const tagsArray = tags ? tags.filter((tag) => typeof tag === "string") : [];

    const user = await currentUser();
    const emailAddress =
      user?.emailAddresses[0]?.emailAddress || user?.username || "Anonymous";

    await db.insert(products).values({
      name,
      slug,
      tagline,
      description,
      websiteUrl,
      tags: tagsArray,
      status: "pending",
      submittedBy: emailAddress,
      organizationId: orgId,
      userId,
    });

    // Immediately expire the products cache so the admin dashboard shows the
    // new pending submission without waiting for time-based revalidation.
    updateTag("products");

    return {
      success: true,
      message: "Product submitted successfully, it will be reviewed shortly.",
      errors: undefined,
    };
  } catch (error) {
    console.error(error);

    const dbError = (error as { cause?: { code?: string } })?.cause;
    const isUniqueConstraintViolation = dbError?.code === "23505";

    if (isUniqueConstraintViolation) {
      return {
        success: false,
        errors: {
          slug: ["A product with this slug already exists. Please choose a different one."],
        },
        message: "A product with this slug already exists.",
      };
    }

    return {
      success: false,
      errors: undefined,
      message: "Failed to submit product.",
    };
  }
};

export const upvoteProductAction = async (productId: number) => {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        message: "You must be signed in to upvote a product.",
      };
    }

    await db.transaction(async (tx) => {
      // Step 1: Record the vote. The unique index on (userId, productId)
      // guarantees a user can only vote once. A violation rolls back the
      // entire transaction, so the voteCount is never touched.
      // With drizzle/postgres-js the driver wraps the DB error, so the
      // postgres error code lives on error.cause.code, not error.code.
      try {
        await tx.insert(votes).values({ userId, productId });
      } catch (error) {
        const pgCode =
          (error as { code?: string }).code ??
          (error as { cause?: { code?: string } }).cause?.code;
        if (pgCode === "23505") {
          throw new Error(ALREADY_VOTED_MESSAGE);
        }
        throw error;
      }

      // Step 2: Only reached if the insert succeeded — safe to increment.
      await tx
        .update(products)
        .set({ voteCount: sql`GREATEST(0, vote_count + 1)` })
        .where(eq(products.id, productId));
    });

    // Invalidate both the targeted product entry and all listing caches
    // (featured, explore, admin) so they show the updated count immediately.
    updateTag(`product-${productId}`);
    updateTag("products");

    return {
      success: true,
      message: "Product upvoted successfully.",
    };
  } catch (error) {
    if (error instanceof Error && error.message === ALREADY_VOTED_MESSAGE) {
      return {
        success: false,
        message: ALREADY_VOTED_MESSAGE,
      };
    }
    console.error(error);
    return {
      success: false,
      message: "Failed to upvote product.",
    };
  }
};

const NOT_VOTED_MESSAGE = "You have not voted on this product.";

// Removes an existing upvote: deletes the vote row and decrements the count.
export const removeVoteAction = async (productId: number) => {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        message: "You must be signed in to remove a vote.",
      };
    }

    await db.transaction(async (tx) => {
      // Step 1: Delete the vote row. If nothing was deleted the user never
      // voted — roll back so the count is never touched.
      const deleted = await tx
        .delete(votes)
        .where(and(eq(votes.userId, userId), eq(votes.productId, productId)))
        .returning({ id: votes.id });

      if (deleted.length === 0) {
        throw new Error(NOT_VOTED_MESSAGE);
      }

      // Step 2: Only reached if the row was deleted — safe to decrement.
      await tx
        .update(products)
        .set({ voteCount: sql`GREATEST(0, vote_count - 1)` })
        .where(eq(products.id, productId));
    });

    updateTag(`product-${productId}`);
    updateTag("products");

    return {
      success: true,
      message: "Vote removed successfully.",
    };
  } catch (error) {
    if (error instanceof Error && error.message === NOT_VOTED_MESSAGE) {
      return { success: false, message: NOT_VOTED_MESSAGE };
    }
    console.error(error);
    return { success: false, message: "Failed to remove vote." };
  }
};
