// NOTE: 비인증 요청은 이 파일의 401 전에 middleware가 307(/login)로 redirect한다.
// API 클라이언트는 redirect:'manual' 로 호출하거나 Cookie 헤더를 반드시 포함해야 한다.
import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { buildTaskRecord } from '@/lib/tasks'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const assigneeId = searchParams.get('assignee_id')

  let query = supabase.from('tasks').select('*').order('created_at', { ascending: false })
  if (status) query = query.eq('status', status)
  if (assigneeId) query = query.eq('assignee_id', assigneeId)

  const { data, error } = await query
  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data)
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'unauthorized' }, { status: 401 })

  const body = await request.json()
  const result = buildTaskRecord(body, user)
  if (!result.ok) {
    return Response.json({ error: result.error }, { status: result.status })
  }

  const { data, error } = await supabase
    .from('tasks')
    .insert(result.record)
    .select()
    .single()

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data, { status: 201 })
}
