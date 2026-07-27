import { Skeleton } from "@/components/ui/skeleton";

const SKELETON_COUNT = 6;

export default function ExploreLoading() {
  return (
    <div className="py-20">
      <div className="wrapper">
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-3">
            <Skeleton className="size-6 rounded" />
            <Skeleton className="h-9 w-56" />
          </div>
          <Skeleton className="h-5 w-80" />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Skeleton className="h-10 flex-1" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-28" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>

        <Skeleton className="h-4 w-32 mb-6" />

        <div className="grid-wrapper">
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <div key={i} className="border rounded-lg p-6 min-h-50 space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
                <Skeleton className="h-20 w-10 rounded" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-5 w-14 rounded-full" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
