import AdminProductCard from "@/components/admin/admin-product-card";
import AdminStatsGrid from "@/components/admin/stats-card";
import EmptyState from "@/components/shared/empty-state";
import SectionHeader from "@/components/shared/section-header";
import { getAllProducts } from "@/lib/products/product-selection";
import { assertAdmin } from "@/lib/admin/assert-admin";
import { InboxIcon, ShieldIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AdminPageSkeleton } from "@/components/products/product-skeleton";
import { notFound } from "next/navigation";

async function AdminContent() {
  try {
    await assertAdmin();
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    redirect(message === "Unauthorized" ? notFound() : "/");
  }

  const allProducts = await getAllProducts();
  const approvedProducts = allProducts.filter((p) => p.status === "approved");
  const pendingProducts = allProducts.filter((p) => p.status === "pending");
  const rejectedProducts = allProducts.filter((p) => p.status === "rejected");
  const reviewedProducts = allProducts.filter((p) => p.status !== "pending");

  return (
    <>
      <AdminStatsGrid
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
          <h2 className="text-2xl font-bold">
            Approved &amp; Rejected ({reviewedProducts.length})
          </h2>
        </div>
        <div className="space-y-4">
          {reviewedProducts.length === 0 ? (
            <EmptyState message="No reviewed products yet" icon={InboxIcon} />
          ) : (
            reviewedProducts.map((product) => (
              <AdminProductCard key={product.id} product={product} />
            ))
          )}
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
