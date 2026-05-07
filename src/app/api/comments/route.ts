import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const taskId = searchParams.get('task_id')

  let query = supabase.from('comments').select('*').order('created_at', { ascending: true })
  if (taskId) query = query.eq('task_id', taskId)

  const { data: comments, error } = await query
  if (error) return Response.json({ error: error.message }, { status: 500 })

  const creatorIds = [...new Set(comments.map((c) => c.created_by))]
  const { data: profiles } = creatorIds.length
    ? await supabase.from('profiles').select('id, display_name, emoji').in('id', creatorIds)
    : { data: [] }

  const profileMap = Object.fromEntries((profiles ?? []).map((p) => [p.id, p]))
  const result = comments.map((c) => ({ ...c, profiles: profileMap[c.created_by] ?? null }))

  return Response.json(result)
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'unauthorized' }, { status: 401 })

  const body = await request.json()
  const { task_id, body: commentBody } = body
  if (!task_id) return Response.json({ error: 'task_id is required' }, { status: 400 })
  if (!commentBody?.trim()) return Response.json({ error: 'body is required' }, { status: 400 })

  const { data, error } = await supabase
    .from('comments')
    .insert({ task_id, body: commentBody.trim(), created_by: user.id })
    .select()
    .single()

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data, { status: 201 })
}
