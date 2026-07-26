"use client";

import { CheckCircleIcon, XCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  approveProductAction,
  rejectProductAction,
} from "@/lib/admin/admin-actions";
import { ProductType } from "@/types";

type AdminActionsProps = {
  status: ProductType["status"];
  productId: ProductType["id"];
};

export default function AdminActions({ status, productId }: AdminActionsProps) {
  const handleApprove = async () => {
    await approveProductAction(productId);
  };

  const handleReject = async () => {
    await rejectProductAction(productId);
  };

  return (
    <div className="space-y-2">
      {status === "pending" && (
        <div className="flex gap-2">
          <Button
            variant="destructive"
            className="hover:cursor-pointer"
            onClick={handleReject}
          >
            <XCircleIcon className="size-4" />
            Reject
          </Button>
          <Button
            variant="default"
            className="hover:cursor-pointer"
            onClick={handleApprove}
          >
            <CheckCircleIcon className="size-4" />
            Approve
          </Button>
        </div>
      )}
    </div>
  );
}
