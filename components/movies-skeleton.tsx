import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function MovieCardSkeleton() {
  return (
    <Card className="p-4">
      {/* Poster skeleton */}
      <div className="relative w-full h-48 overflow-hidden rounded-lg">
        <Skeleton className="w-full h-full" />
      </div>

      {/* Content skeleton */}
      <div className="flex-1 mt-4">
        {/* Title */}
        <Skeleton className="h-6 w-3/4 mb-2" />
        {/* Metadata */}
        <Skeleton className="h-4 w-full" />
      </div>

      {/* Buttons skeleton */}
      <div className="flex gap-2 self-end mt-4">
        <Skeleton className="h-9 w-9" />
        <Skeleton className="h-9 w-9" />
      </div>
    </Card>
  );
}

export function MovieGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <MovieCardSkeleton key={i} />
      ))}
    </>
  );
}
