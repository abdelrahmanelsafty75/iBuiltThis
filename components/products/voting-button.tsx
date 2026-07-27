"use client";
import {
  removeVoteAction,
  upvoteProductAction,
} from "@/lib/products/product-actions";
import { cn } from "@/lib/utils";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useOptimistic, useTransition, useState } from "react";
import { Button } from "@/components/ui/button";

export default function VotingButton({
  hasVoted,
  voteCount: initialVoteCount,
  productId,
}: {
  hasVoted?: boolean;
  voteCount: number;
  productId: number;
}) {
  // useState is the persistent source of truth on the client side.
  // It is updated only when the server action confirms success, so the
  // count sticks on cards (explore/home) where no server re-render pushes
  // fresh props after a vote.
  const [persisted, setPersisted] = useState({
    count: initialVoteCount,
    voted: hasVoted ?? false,
  });

  // useOptimistic wraps the persisted state for instant visual feedback.
  // If the action fails, it automatically reverts to `persisted`.
  const [optimistic, setOptimistic] = useOptimistic(
    persisted,
    (state, action: "upvote" | "remove") =>
      action === "upvote"
        ? { count: state.count + 1, voted: true }
        : { count: Math.max(0, state.count - 1), voted: false }
  );

  const [isPending, startTransition] = useTransition();

  const handleUpvote = () => {
    startTransition(async () => {
      setOptimistic("upvote");
      const result = await upvoteProductAction(productId);
      if (result.success) {
        setPersisted((s) => ({ count: s.count + 1, voted: true }));
      }
    });
  };

  const handleRemoveVote = () => {
    startTransition(async () => {
      setOptimistic("remove");
      const result = await removeVoteAction(productId);
      if (result.success) {
        setPersisted((s) => ({ count: Math.max(0, s.count - 1), voted: false }));
      }
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