"use client";
import {
  removeVoteAction,
  upvoteProductAction,
} from "@/lib/products/product-actions";
import { cn } from "@/lib/utils";
import { ChevronDownIcon, ChevronUpIcon, LogInIcon } from "lucide-react";
import { useOptimistic, useTransition, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth, SignInButton } from "@clerk/nextjs";

export default function VotingButton({
  hasVoted,
  voteCount,
  productId,
}: {
  hasVoted?: boolean;
  voteCount: number;
  productId: number;
}) {
  const { userId } = useAuth();
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);

  // Auto-dismiss the sign-in prompt after 3 seconds.
  useEffect(() => {
    if (!showSignInPrompt) return;
    const timer = setTimeout(() => setShowSignInPrompt(false), 3000);
    return () => clearTimeout(timer);
  }, [showSignInPrompt]);

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
    if (!userId) {
      setShowSignInPrompt(true);
      return;
    }
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

      {showSignInPrompt && (
        <SignInButton mode="modal">
          <button className="flex items-center gap-1 text-xs text-secondary font-bold underline underline-offset-2 mt-1 hover:text-secondary/80 transition-colors">
            <LogInIcon className="size-3" />
            Sign in to vote
          </button>
        </SignInButton>
      )}
    </div>
  );
}