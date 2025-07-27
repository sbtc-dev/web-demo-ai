"use client"

import { useEffect } from "react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
          <div className="text-red-500 text-6xl mb-4">🚨</div>
          <h2 className="text-2xl font-bold mb-4 text-center">Critical Error</h2>
          <p className="text-gray-600 mb-6 text-center max-w-md">
            We apologize for the inconvenience. A critical error has occurred.
          </p>
          <button
            onClick={reset}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}