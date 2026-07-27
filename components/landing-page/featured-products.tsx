import { auth } from "@clerk/nextjs/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowUpRightIcon, StarIcon } from "lucide-react";
import SectionHeader from "@/components/shared/section-header";
import ProductCard from "../products/product-card";
import {
  getFeaturedProducts,
  getUserVotedProductIds,
} from "@/lib/products/product-selection";

export default async function FeaturedProducts() {
  const { userId } = await auth();

  const [featProducts, votedProductIds] = await Promise.all([
    getFeaturedProducts(),
    userId ? getUserVotedProductIds(userId) : Promise.resolve([]),
  ]);

  const votedSet = new Set(votedProductIds);

  return (
    <section className="py-20">
      <div className="wrapper">
        <div className="flex items-center justify-between mb-8">
          <SectionHeader
            title="Featured Today"
            icon={StarIcon}
            description="Top picks from our community this week"
          />
          <Button
            variant="outline"
            className="hidden sm:flex"
            render={<Link href="/explore" />}
            nativeButton={false}
          >
            View All <ArrowUpRightIcon className="size-4" />
          </Button>
        </div>
        <div className="grid-wrapper">
          {featProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              hasVoted={votedSet.has(product.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}


