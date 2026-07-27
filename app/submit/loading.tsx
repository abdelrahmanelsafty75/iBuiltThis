import { Skeleton } from "@/components/ui/skeleton";

const FIELD_COUNT = 6;

export default function SubmitLoading() {
  return (
    <section className="py-20">
      <div className="wrapper">
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-3">
            <Skeleton className="size-6 rounded" />
            <Skeleton className="h-9 w-64" />
          </div>
          <Skeleton className="h-5 w-96" />
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          {Array.from({ length: FIELD_COUNT }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          ))}
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      </div>
    </section>
  );
}
