import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function MovieListSkeleton() {
  return (
    <div className="grid gap-4">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex md:flex-col gap-4">
              <Skeleton className="w-20 h-20 rounded-xl" />

              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-60" />
              </div>
            </div>

            <div className="flex gap-2 self-end">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
