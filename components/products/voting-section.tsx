import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { votes } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import VotingButton from "@/components/products/voting-button";

interface VotingSectionProps {
  productId: number;
  voteCount: number;
}

// This is an intentionally uncached Server Component.
// It lives inside a <Suspense> boundary inside the cached ProductPage,
// so the product data shell is served from cache while this streams in
// per-request with the correct per-user hasVoted state.
export default async function VotingSection({
  productId,
  voteCount,
}: VotingSectionProps) {
  const { userId } = await auth();

  let hasVoted = false;
  if (userId) {
    const existing = await db
      .select({ id: votes.id })
      .from(votes)
      .where(and(eq(votes.userId, userId), eq(votes.productId, productId)))
      .limit(1);

    hasVoted = existing.length > 0;
  }

  return (
    <VotingButton productId={productId} voteCount={voteCount} hasVoted={hasVoted} />
  );
}
