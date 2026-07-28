"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircleIcon, ArrowLeftIcon, RefreshCwIcon } from "lucide-react";

export default function ProductError({
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
    <div className="py-16">
      <div className="wrapper">
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeftIcon className="size-4" /> Back to Explore
        </Link>
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center space-y-4">
          <AlertCircleIcon className="size-12 text-destructive/60" />
          <h2 className="text-2xl font-bold">Failed to load product</h2>
          <p className="text-muted-foreground max-w-md">
            Something went wrong while loading this product. Please try again.
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
