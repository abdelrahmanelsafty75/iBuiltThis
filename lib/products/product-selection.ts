import { db } from "@/db";
import { products } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { connection } from "next/server";

const RECENTLY_LAUNCHED_DAYS = 7;

// Cached: used for the static featured section and generateStaticParams.
export async function getFeaturedProducts() {
    "use cache";
  const productsData = await db.select().from(products).where(eq(products.status, "approved")).orderBy(desc(products.voteCount));
  return productsData ?? [];
}

// Cached: fetches every product regardless of status (e.g. admin views).
export async function getAllProducts() {
  "use cache";
  const   productsData = await db.select().from(products);
  return productsData ?? [];
}

// Not cached: fetches all approved products for use in dynamic sections.
export async function getAllApprovedProducts() {
  const productsData = await db
    .select()
    .from(products)
    .where(eq(products.status, "approved"));
  return productsData ?? [];
}

// Dynamic: connection() opts this out of the static shell so the data is
// always fresh, and it must be wrapped in <Suspense> at the call site.
export async function getRecentlyLaunchedProducts() {
  await connection();
  const productsData = await getAllApprovedProducts();

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - RECENTLY_LAUNCHED_DAYS);

  return productsData.filter(
    (product) =>
      product.createdAt && new Date(product.createdAt) >= oneWeekAgo
  );
}

export async function getProductBySlug(slug: string) {
  const product = await db
  .select()
  .from(products)
  .where(eq(products.slug, slug))
  .limit(1);
 
  return product?.[0] ?? null;
}
