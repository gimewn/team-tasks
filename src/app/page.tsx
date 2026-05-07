import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PageHeader } from '@/components/PageHeader'
import { TaskBoard } from '@/components/TaskBoard'

const DEFAULT_EMOJI = '🍅'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [tasksResult, profileResult] = await Promise.all([
    supabase.from('tasks').select('*').order('created_at', { ascending: false }),
    supabase.from('profiles').select('id, display_name, emoji').eq('id', user.id).single(),
  ])

  return (
    <main className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-2xl space-y-8">
        <PageHeader
          email={user.email ?? ''}
          initialEmoji={profileResult.data?.emoji ?? DEFAULT_EMOJI}
        />
        <TaskBoard initialTasks={tasksResult.data ?? []} />
      </div>
    </main>
  )
}
