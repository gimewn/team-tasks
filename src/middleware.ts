import { NextRequest, NextResponse } from 'next/server'
import { createMiddlewareClient } from '@/lib/supabase/middleware'

export async function middleware(req: NextRequest) {
  const { supabase, res } = createMiddlewareClient(req)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    const loginUrl = req.nextUrl.clone()
    loginUrl.pathname = '/login'
    return NextResponse.redirect(loginUrl)
  }

  return res
}

export const config = {
  matcher: ['/', '/api/tasks', '/api/tasks/:path*', '/api/comments', '/api/comments/:path*', '/api/profile'],
}
