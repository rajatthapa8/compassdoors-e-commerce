/**
 * Utility functions to get server URLs without double slashes
 */

/**
 * Get the server-side URL (for API calls from server components)
 * Removes trailing slashes to prevent double slashes in URLs
 */
export const getServerSideURL = (): string => {
  let url =
    process.env.NEXT_PUBLIC_SERVER_URL ||
    process.env.PAYLOAD_PUBLIC_SERVER_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    'http://localhost:3000'

  // Add https:// protocol if missing (for Vercel URLs)
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`
  }

  // Remove trailing slash to prevent double slashes
  return url.replace(/\/$/, '')
}

/**
 * Get the client-side URL (for API calls from client components)
 */
export const getClientSideURL = (): string => {
  if (typeof window !== 'undefined') {
    // Browser environment - use current origin
    return window.location.origin
  }

  // Fallback to server-side URL
  return getServerSideURL()
}

/**
 * Helper to construct API URLs properly
 * @param path - API path (e.g., '/api/users/me' or 'api/users/me')
 */
export const getAPIUrl = (path: string): string => {
  const baseUrl = getServerSideURL()

  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  return `${baseUrl}${normalizedPath}`
}

/**
 * Helper for media URLs
 * @param filename - Media filename or path
 */
export const getMediaUrl = (filename: string): string => {
  const baseUrl = getServerSideURL()

  // Handle already complete URLs
  if (filename.startsWith('http://') || filename.startsWith('https://')) {
    return filename
  }

  // Ensure filename starts with /
  const normalizedPath = filename.startsWith('/') ? filename : `/${filename}`

  return `${baseUrl}${normalizedPath}`
}

// import { canUseDOM } from './canUseDOM'

// export const getServerSideURL = () => {
//   let url = process.env.NEXT_PUBLIC_SERVER_URL

//   if (!url && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
//     return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
//   }

//   if (!url) {
//     url = 'http://localhost:3000'
//   }

//   return url
// }

// export const getClientSideURL = () => {
//   if (canUseDOM) {
//     const protocol = window.location.protocol
//     const domain = window.location.hostname
//     const port = window.location.port

//     return `${protocol}//${domain}${port ? `:${port}` : ''}`
//   }

//   if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
//     return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
//   }

//   return process.env.NEXT_PUBLIC_SERVER_URL || ''
// }
