import { auth } from "@clerk/nextjs/server";
import { CalendarIcon, RocketIcon } from "lucide-react";
import SectionHeader from "../shared/section-header";
import ProductCard from "../products/product-card";
import EmptyState from "../shared/empty-state";
import {
  getRecentlyLaunchedProducts,
  getUserVotedProductIds,
} from "@/lib/products/product-selection";

export default async function RecentlyLaunchedProducts() {
  const { userId } = await auth();

  const [recentlyLaunchedProducts, votedProductIds] = await Promise.all([
    getRecentlyLaunchedProducts(),
    userId ? getUserVotedProductIds(userId) : Promise.resolve([]),
  ]);

  const votedSet = new Set(votedProductIds);

  return (
    <section className="py-20 bg-muted/8">
      <div className="wrapper space-y-12">
        <SectionHeader
          title="Recently Launched"
          icon={RocketIcon}
          description="Discover the latest products from our community"
        />

        {recentlyLaunchedProducts.length > 0 ? (
          <div className="grid-wrapper">
            {recentlyLaunchedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                hasVoted={votedSet.has(product.id)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            message="No products launched in the last week. Check back soon for new launches."
            icon={CalendarIcon}
          />
        )}
      </div>
    </section>
  );
}