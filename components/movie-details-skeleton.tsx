import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function MovieDetailsSkeleton() {
  return (
    <Card>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6 sm:p-8">
        {/* Poster skeleton */}
        <div className="md:col-span-1">
          <div className="relative w-full aspect-2/3 rounded-lg overflow-hidden">
            <Skeleton className="w-full h-full" />
          </div>
        </div>

        {/* Details skeleton */}
        <div className="md:col-span-2 space-y-6">
          {/* Title and rating */}
          <div>
            <Skeleton className="h-10 w-3/4 mb-2" />
            <div className="flex flex-wrap items-center gap-8 mb-4">
              <Skeleton className="h-7 w-16" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-8 w-12" />
              </div>
            </div>
          </div>

          {/* Director */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-6 w-48" />
          </div>

          {/* Runtime */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-6 w-32" />
          </div>

          {/* Genre */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-16" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-16" />
            </div>
          </div>

          {/* Cast */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-12" />
            <Skeleton className="h-6 w-full" />
          </div>

          {/* Review stats */}
          <Alert>
            <AlertDescription>
              <Skeleton className="h-5 w-64" />
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>

      <Separator />

      {/* Synopsis skeleton */}
      <div className="px-6 sm:px-8 py-6 sm:py-8">
        <Skeleton className="h-8 w-32 mb-4" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-3/4" />
        </div>
      </div>
    </Card>
  );
}
