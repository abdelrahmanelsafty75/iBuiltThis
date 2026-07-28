"use client";
import {
  removeVoteAction,
  upvoteProductAction,
} from "@/lib/products/product-actions";
import { cn } from "@/lib/utils";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useOptimistic, useTransition } from "react";
import { Button } from "@/components/ui/button";

export default function VotingButton({
  hasVoted,
  voteCount,
  productId,
}: {
  hasVoted?: boolean;
  voteCount: number;
  productId: number;
}) {
  // Props are the single source of truth. After a server action the RSC
  // re-renders and pushes the authoritative DB values back as fresh props.
  // useOptimistic applies an instant local delta while the transition is
  // pending; it automatically reverts to the (now-fresh) props when done.
  const [optimistic, setOptimistic] = useOptimistic(
    { count: voteCount, voted: hasVoted ?? false },
    (state, action: "upvote" | "remove") =>
      action === "upvote"
        ? { count: state.count + 1, voted: true }
        : { count: Math.max(0, state.count - 1), voted: false }
  );

  const [isPending, startTransition] = useTransition();

  const handleUpvote = () => {
    startTransition(async () => {
      setOptimistic("upvote");
      await upvoteProductAction(productId);
    });
  };

  const handleRemoveVote = () => {
    startTransition(async () => {
      setOptimistic("remove");
      await removeVoteAction(productId);
    });
  };

  return (
    <div
      className="flex flex-col items-center gap-1 shrink-0"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <Button
        onClick={handleUpvote}
        variant="ghost"
        size="icon-sm"
        disabled={isPending || optimistic.voted}
        className={cn(
          "h-8 w-8 text-primary",
          optimistic.voted
            ? "bg-primary/10 text-primary hover:bg-primary/20"
            : "hover:bg-primary/10 hover:text-primary"
        )}
      >
        <ChevronUpIcon className="size-5" />
      </Button>
      <span className="text-sm font-semibold transition-colors text-foreground">
        {optimistic.count}
      </span>
      <Button
        onClick={handleRemoveVote}
        variant="ghost"
        size="icon-sm"
        disabled={isPending || !optimistic.voted}
        className={cn(
          "h-8 w-8 text-primary",
          optimistic.voted
            ? "hover:text-destructive"
            : "opacity-50 cursor-not-allowed"
        )}
      >
        <ChevronDownIcon className="size-5" />
      </Button>
    </div>
  );
}