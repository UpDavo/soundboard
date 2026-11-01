import { ResponsiveGrid, Skeleton } from "@/components/ui";

export function SoundBoardSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-5">
      <Skeleton className="h-12 rounded-full sm:max-w-sm" />
      <ResponsiveGrid>
        {Array.from({ length: count }).map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-[28px]" />
        ))}
      </ResponsiveGrid>
    </div>
  );
}
