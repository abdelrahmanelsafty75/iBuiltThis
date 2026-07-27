"use client";

import { useState, useTransition } from "react";
import { CheckCircleIcon, Loader2Icon, XCircleIcon } from "lucide-react";
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
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleApprove = () => {
    setError(null);
    startTransition(async () => {
      const result = await approveProductAction(productId);
      if (!result.success) setError(result.message);
    });
  };

  const handleReject = () => {
    setError(null);
    startTransition(async () => {
      const result = await rejectProductAction(productId);
      if (!result.success) setError(result.message);
    });
  };

  return (
    <div className="space-y-2">
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
      {status === "pending" && (
        <div className="flex gap-2">
          <Button
            variant="destructive"
            disabled={isPending}
            onClick={handleReject}
          >
            {isPending ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              <XCircleIcon className="size-4" />
            )}
            Reject
          </Button>
          <Button
            variant="default"
            disabled={isPending}
            onClick={handleApprove}
          >
            {isPending ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              <CheckCircleIcon className="size-4" />
            )}
            Approve
          </Button>
        </div>
      )}
    </div>
  );
}
