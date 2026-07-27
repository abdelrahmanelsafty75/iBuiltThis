"use client";

import { useState, useTransition } from "react";
import { Loader2Icon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteProductAction } from "@/lib/admin/admin-actions";
import { ProductType } from "@/types";

export default function AdminDeleteButton({
  productId,
}: {
  productId: ProductType["id"];
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const handleFirstClick = () => {
    setError(null);
    setConfirmed(true);
  };

  const handleConfirm = () => {
    startTransition(async () => {
      const result = await deleteProductAction(productId);
      if (!result.success) {
        setError(result.message);
        setConfirmed(false);
      }
    });
  };

  const handleCancel = () => setConfirmed(false);

  if (confirmed) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Are you sure?</span>
        <Button
          variant="destructive"
          size="sm"
          disabled={isPending}
          onClick={handleConfirm}
        >
          {isPending ? (
            <Loader2Icon className="size-4 animate-spin" />
          ) : (
            <Trash2Icon className="size-4" />
          )}
          Yes, delete
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={isPending}
          onClick={handleCancel}
        >
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
      <Button variant="outline" onClick={handleFirstClick}>
        <Trash2Icon className="size-4" />
        Delete
      </Button>
    </div>
  );
}
