import { auth } from "@clerk/nextjs/server";
import SectionHeader from "@/components/shared/section-header";
import ProductExplorer from "@/components/products/product-explorer";
import {
  getAllApprovedProducts,
  getUserVotedProductIds,
} from "@/lib/products/product-selection";
import { CompassIcon } from "lucide-react";

export default async function ExplorePage() {
  const { userId } = await auth();

  const [products, votedProductIds] = await Promise.all([
    getAllApprovedProducts(),
    userId ? getUserVotedProductIds(userId) : Promise.resolve([]),
  ]);

  return (
    <div className="py-20">
      <div className="wrapper">
        <div className="mb-12">
          <SectionHeader
            title="Explore All Products"
            icon={CompassIcon}
            description="Browse and discover amazing projects from our community"
          />
        </div>
        <ProductExplorer products={products} votedProductIds={votedProductIds} />
      </div>
    </div>
  );
}