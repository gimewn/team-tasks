import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { TablesUpdate } from '@/lib/database.types'

type Context = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Context) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'unauthorized' }, { status: 401 })

  const { data, error } = await supabase.from('comments').select('*').eq('id', id).single()
  if (error) {
    const status = error.code === 'PGRST116' ? 404 : 500
    return Response.json({ error: error.message }, { status })
  }
  return Response.json(data)
}

export async function PATCH(request: NextRequest, { params }: Context) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'unauthorized' }, { status: 401 })

  const body = await request.json()
  const patch: TablesUpdate<'comments'> = {}
  if ('body' in body) patch.body = body.body

  if (Object.keys(patch).length === 0) {
    return Response.json({ error: 'no fields to update' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('comments')
    .update(patch)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    const status = error.code === 'PGRST116' ? 404 : 500
    return Response.json({ error: error.message }, { status })
  }
  return Response.json(data)
}

export async function DELETE(_req: NextRequest, { params }: Context) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'unauthorized' }, { status: 401 })

  const { error } = await supabase.from('comments').delete().eq('id', id)
  if (error) return Response.json({ error: error.message }, { status: 500 })
  return new Response(null, { status: 204 })
}
