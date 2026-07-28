import { AdminPageSkeleton } from "@/components/products/product-skeleton";
import SectionHeader from "@/components/shared/section-header";
import { ShieldIcon } from "lucide-react";

export default function AdminLoading() {
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
        <AdminPageSkeleton />
      </div>
    </div>
  );
}
