'use client'

import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  async function handleLogin() {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background gap-8 px-4">
      {/* 타이틀 */}
      <div className="text-center space-y-2">
        <div className="text-5xl mb-2">🌿</div>
        <h1 className="text-3xl font-extrabold text-foreground">팀 일감</h1>
        <p className="text-sm text-muted-foreground">팀원들과 함께 오늘의 일감을 관리해요</p>
      </div>

      {/* 카드 */}
      <div className="w-full max-w-sm rounded-3xl border border-border bg-card p-8 shadow-md space-y-6">
        <div className="text-center space-y-1">
          <p className="text-base font-bold text-foreground">시작하기</p>
          <p className="text-xs text-muted-foreground">Google 계정으로 바로 로그인하세요</p>
        </div>

        <button
          onClick={handleLogin}
          className="flex w-full items-center justify-center gap-3 rounded-2xl border border-border bg-white px-5 py-3 text-sm font-semibold text-[#3c4043] shadow-sm hover:bg-[#f8f9fa] active:bg-[#f1f3f4] transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Google로 계속하기
        </button>

        <p className="text-center text-xs text-muted-foreground">
          로그인 시 팀 일감 서비스 이용에 동의하게 됩니다 🍃
        </p>
      </div>
    </div>
  )
}
