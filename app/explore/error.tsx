"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircleIcon, RefreshCwIcon } from "lucide-react";

export default function ExploreError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="py-20">
      <div className="wrapper">
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center space-y-4">
          <AlertCircleIcon className="size-12 text-destructive/60" />
          <h2 className="text-2xl font-bold">Failed to load products</h2>
          <p className="text-muted-foreground max-w-md">
            Something went wrong while fetching the product list. Please try again.
          </p>
          <Button onClick={unstable_retry} variant="outline">
            <RefreshCwIcon className="size-4" />
            Try again
          </Button>
        </div>
      </div>
    </div>
  );
}
