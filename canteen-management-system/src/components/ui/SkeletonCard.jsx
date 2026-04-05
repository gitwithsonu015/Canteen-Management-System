"use client";

export function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-md animate-pulse">
      <div className="h-48 bg-dark-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-dark-200 rounded-full w-3/4" />
        <div className="h-3 bg-dark-100 rounded-full w-1/2" />
        <div className="h-3 bg-dark-100 rounded-full w-2/3" />
        <div className="h-10 bg-dark-100 rounded-xl mt-4" />
      </div>
    </div>
  );
}

export function SkeletonList({ count = 4 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex gap-4 rounded-2xl bg-white p-4 shadow-sm animate-pulse">
          <div className="h-20 w-20 shrink-0 rounded-xl bg-dark-200" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-dark-200 rounded-full w-3/4" />
            <div className="h-3 bg-dark-100 rounded-full w-1/2" />
            <div className="h-3 bg-dark-100 rounded-full w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonStatCard() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-md animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-3 bg-dark-200 rounded-full w-24" />
          <div className="h-8 bg-dark-200 rounded-full w-32" />
        </div>
        <div className="h-14 w-14 rounded-2xl bg-dark-200" />
      </div>
    </div>
  );
}
