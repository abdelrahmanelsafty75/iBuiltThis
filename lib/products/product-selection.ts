import { cache } from "react";
import { db } from "@/db";
import { products, votes } from "@/db/schema";
import { and, desc, eq, gte } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { connection } from "next/server";

const RECENTLY_LAUNCHED_DAYS = 7;

// Cached: approved products sorted by votes — used for the landing hero and generateStaticParams.
export async function getFeaturedProducts() {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  const productsData = await db
    .select()
    .from(products)
    .where(eq(products.status, "approved"))
    .orderBy(desc(products.voteCount));

  return productsData ?? [];
}

// Cached: every product regardless of status — used by the admin dashboard.
export async function getAllProducts() {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  const productsData = await db.select().from(products);
  return productsData ?? [];
}

// Cached: approved products used on the explore page.
// updateTag("products") is called on every approval/rejection/vote so the
// cache is always fresh without time-based staleness.
export async function getAllApprovedProducts() {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  const productsData = await db
    .select()
    .from(products)
    .where(eq(products.status, "approved"));

  return productsData ?? [];
}

// Per-request deduplication via React.cache: multiple listing components on
// the same page (Featured + Recently Launched) that call this with the same
// userId resolve to a single DB round-trip.
export const getUserVotedProductIds = cache(
  async (userId: string): Promise<number[]> => {
    const userVotes = await db
      .select({ productId: votes.productId })
      .from(votes)
      .where(eq(votes.userId, userId));

    return userVotes.map((v) => v.productId);
  }
);

// Dynamic: opts out of the static shell via connection(), must be wrapped in <Suspense>.
// Filters at the DB level to avoid fetching the full products table into JS memory.
export async function getRecentlyLaunchedProducts() {
  await connection();

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - RECENTLY_LAUNCHED_DAYS);

  return db
    .select()
    .from(products)
    .where(and(eq(products.status, "approved"), gte(products.createdAt, oneWeekAgo)))
    .orderBy(desc(products.createdAt));
}

// Cached per slug: tagged with "products" (global) and "product-<id>" (targeted)
// so both admin approve/reject and per-vote invalidation work precisely.
// "products" tag is always registered before any await so updateTag() can
// invalidate even a cached null result (e.g. a slug that later gets approved).
export async function getProductBySlug(slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  const product = await db
    .select()
    .from(products)
    .where(and(eq(products.slug, slug), eq(products.status, "approved")))
    .limit(1);

  const result = product?.[0] ?? null;

  if (result) {
    cacheTag(`product-${result.id}`);
  }

  return result;
}
