import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: "production",
  apiVersion: "2025-01-03",
  // Only use token server-side for security
  token: typeof window === 'undefined' ? process.env.SANITY_API_TOKEN : undefined,
  useCdn: false, // Set to false to avoid CORS issues when using authentication
})
