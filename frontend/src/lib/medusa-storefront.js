import { createStorefrontClient } from "@medusajs/storefront-client"

export const store = createStorefrontClient({
  baseUrl: process.env.NEXT_PUBLIC_MEDUSA_URL,
  publishableApiKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
  // можно добавить sales channel, если нужен
})
