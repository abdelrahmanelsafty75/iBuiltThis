import AdminProductCard from "@/components/admin/admin-product-card";
import StatsCard from "@/components/admin/stats-card";
import EmptyState from "@/components/shared/empty-state";
import SectionHeader from "@/components/shared/section-header";
import { getAllProducts } from "@/lib/products/product-selection";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { InboxIcon, ShieldIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AdminPageSkeleton } from "@/components/products/product-skeleton";

async function AdminContent() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const isAdmin = (user.publicMetadata?.isAdmin as boolean) ?? false;

  if (!isAdmin) {
    redirect("/");
  }

  const allProducts = await getAllProducts();
  const approvedProducts = allProducts.filter(
    (product) => product.status === "approved"
  );
  const pendingProducts = allProducts.filter(
    (product) => product.status === "pending"
  );
  const rejectedProducts = allProducts.filter(
    (product) => product.status === "rejected"
  );

  return (
    <>
      <StatsCard
        approved={approvedProducts.length}
        pending={pendingProducts.length}
        rejected={rejectedProducts.length}
        all={allProducts.length}
      />

      <section className="my-12">
        <div className="section-header-with-count">
          <h2 className="text-2xl font-bold">
            Pending Products ({pendingProducts.length})
          </h2>
        </div>
        <div className="space-y-4">
          {pendingProducts.length === 0 && (
            <EmptyState
              message="No pending products to review"
              icon={InboxIcon}
            />
          )}
          {pendingProducts.map((product) => (
            <AdminProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="my-12">
        <div className="section-header-with-count">
          <h2 className="text-2xl font-bold">All Products</h2>
        </div>
        <div className="space-y-4">
          {allProducts.map((product) => (
            <AdminProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </>
  );
}


export default function AdminPage() {
  return (
    <div className="py-20">
      <div className="wrapper">
        <div className="mb-12">
          <SectionHeader
            title="Product Admin"
            icon={ShieldIcon}
            description="Review and manage submitted products"
          />
        </div>
        <Suspense fallback={<AdminPageSkeleton />}>
          <AdminContent />
        </Suspense>
      </div>
    </div>
  );
}
