import { createBrowserClient } from '@supabase/ssr'

let browserClient:
  | ReturnType<typeof createBrowserClient>
  | undefined

export function createSupabaseBrowserClient() {
  if (!browserClient) {
    browserClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }

  return browserClient
}

// ✅ Proxy — lazy client, only created when first used not when imported
export const supabase = new Proxy(
  {} as ReturnType<typeof createBrowserClient>,
  {
    get(_, prop: string) {
      return (createSupabaseBrowserClient() as any)[prop]
    },
  }
)