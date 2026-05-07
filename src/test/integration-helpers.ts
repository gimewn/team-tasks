import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'

export async function waitForDevServer(): Promise<void> {
  const url = 'http://localhost:3000'
  try {
    await fetch(url, { signal: AbortSignal.timeout(3000) })
  } catch {
    throw new Error(
      `개발 서버(${url})에 접근할 수 없습니다.\n별도 터미널에서 npm run dev 먼저 띄우세요.`,
    )
  }
}

export async function signInTestUser(): Promise<{ cookieHeader: string; userId: string }> {
  const captured: Record<string, string> = {}

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return Object.entries(captured).map(([name, value]) => ({ name, value }))
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            captured[name] = value
          })
        },
      },
    },
  )

  const { data, error } = await supabase.auth.signInWithPassword({
    email: process.env.TEST_USER_EMAIL!,
    password: process.env.TEST_USER_PASSWORD!,
  })

  if (error || !data.user) {
    throw new Error(`테스트 유저 로그인 실패: ${error?.message}`)
  }

  const cookieHeader = Object.entries(captured)
    .map(([name, value]) => `${name}=${value}`)
    .join('; ')

  return { cookieHeader, userId: data.user.id }
}

export function getAdminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  )
}
