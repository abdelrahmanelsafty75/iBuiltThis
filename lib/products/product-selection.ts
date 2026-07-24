import { db } from "@/db";
import { products } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { connection } from "next/server";

const RECENTLY_LAUNCHED_DAYS = 7;

// Cached: used for the static featured section and generateStaticParams.
export async function getFeaturedProducts() {
  "use cache";
  return db
    .select()
    .from(products)
    .where(eq(products.status, "approved"))
    .orderBy(desc(products.voteCount));
}

// Cached: fetches every product regardless of status (e.g. admin views).
export async function getAllProducts() {
  "use cache";
  return db.select().from(products);
}

// Not cached: fetches all approved products for use in dynamic sections.
export async function getAllApprovedProducts() {
  return db
    .select()
    .from(products)
    .where(eq(products.status, "approved"));
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