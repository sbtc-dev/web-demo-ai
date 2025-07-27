export default function OrderSuccessLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon Skeleton */}
          <div className="h-16 w-16 bg-gray-200 rounded-full mx-auto mb-6 animate-pulse" />

          {/* Title Skeleton */}
          <div className="h-8 bg-gray-200 rounded mx-auto mb-4 w-64 animate-pulse" />

          {/* Subtitle Skeleton */}
          <div className="h-6 bg-gray-200 rounded mx-auto mb-8 w-96 animate-pulse" />

          {/* Order Details Card Skeleton */}
          <div className="bg-white rounded-lg border p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="h-5 bg-gray-200 rounded w-32 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-48 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-44 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-52 animate-pulse" />
              </div>
              <div className="space-y-3">
                <div className="h-5 bg-gray-200 rounded w-28 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-44 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-48 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Action Buttons Skeleton */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="h-12 bg-gray-200 rounded w-40 animate-pulse" />
              <div className="h-12 bg-gray-200 rounded w-32 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}