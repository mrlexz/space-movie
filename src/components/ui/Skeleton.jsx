export function CardSkeleton() {
  return (
    <div className="rounded-xl overflow-hidden bg-cinema-card">
      <div className="aspect-[2/3] skeleton" />
      <div className="p-3 space-y-2">
        <div className="h-4 skeleton rounded w-3/4" />
        <div className="h-3 skeleton rounded w-1/3" />
      </div>
    </div>
  );
}

export function MovieGridSkeleton({ count = 12 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="relative h-screen skeleton">
      <div className="absolute inset-0 bg-gradient-to-r from-cinema-black to-transparent" />
      <div className="absolute bottom-32 left-12 space-y-4 w-96">
        <div className="h-6 skeleton rounded w-24" />
        <div className="h-12 skeleton rounded" />
        <div className="h-4 skeleton rounded" />
        <div className="h-4 skeleton rounded w-4/5" />
        <div className="flex gap-3 mt-4">
          <div className="h-12 w-32 skeleton rounded-lg" />
          <div className="h-12 w-32 skeleton rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="min-h-screen">
      <div className="h-[60vh] skeleton" />
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <div className="flex gap-8">
          <div className="w-48 h-72 skeleton rounded-xl flex-shrink-0" />
          <div className="flex-1 space-y-4">
            <div className="h-8 skeleton rounded w-1/2" />
            <div className="h-4 skeleton rounded w-1/4" />
            <div className="h-4 skeleton rounded" />
            <div className="h-4 skeleton rounded" />
            <div className="h-4 skeleton rounded w-3/4" />
          </div>
        </div>
      </div>
    </div>
  );
}
