import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('profiles')
    .select('id, display_name, emoji')
    .eq('id', user.id)
    .single()
  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data)
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'unauthorized' }, { status: 401 })

  const body = await request.json()
  const patch: { emoji?: string; display_name?: string } = {}
  if ('emoji' in body && typeof body.emoji === 'string') patch.emoji = body.emoji
  if ('display_name' in body && typeof body.display_name === 'string') patch.display_name = body.display_name

  if (Object.keys(patch).length === 0) {
    return Response.json({ error: 'no fields to update' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('profiles')
    .upsert({ id: user.id, ...patch })
    .select()
    .single()
  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data)
}
