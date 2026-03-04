export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-black" />
      <p className="mt-4 text-sm text-gray-500">Loading...</p>
    </div>
  )
}
