'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Tables } from '@/lib/database.types'
import { createClient } from '@/lib/supabase/client'

type Task = Tables<'tasks'>

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [email, setEmail] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null)
    })
  }, [])

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  async function loadTasks() {
    const res = await fetch('/api/tasks')
    if (res.ok) setTasks(await res.json())
    setLoading(false)
  }

  useEffect(() => { loadTasks() }, [])

  async function addTask(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    setSubmitting(true)
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    })
    if (res.ok) {
      const created: Task = await res.json()
      setTasks((prev) => [created, ...prev])
      setTitle('')
    }
    setSubmitting(false)
  }

  async function toggleStatus(task: Task) {
    const next = task.status === 'todo' ? 'done' : 'todo'
    const res = await fetch(`/api/tasks/${task.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: next }),
    })
    if (res.ok) {
      const updated: Task = await res.json()
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
    }
  }

  async function deleteTask(id: string) {
    const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' })
    if (res.ok) setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <main className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">팀 일감</h1>
            <p className="mt-1 text-sm text-muted-foreground">내가 만들거나 내게 배정된 일감만 표시됩니다.</p>
          </div>
          {email && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">{email}</span>
              <button
                onClick={handleLogout}
                className="rounded-md border border-border px-3 py-1.5 text-sm text-foreground hover:bg-secondary"
              >
                로그아웃
              </button>
            </div>
          )}
        </div>

        {/* 추가 폼 */}
        <form onSubmit={addTask} className="flex gap-2">
          <input
            type="text"
            placeholder="새 일감 제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={submitting}
            className="flex-1 rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!title.trim()}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            추가
          </button>
        </form>

        {/* 일감 목록 */}
        {loading ? (
          <p className="text-sm text-muted-foreground">불러오는 중…</p>
        ) : tasks.length === 0 ? (
          <p className="text-sm text-muted-foreground">등록된 일감이 없습니다.</p>
        ) : (
          <ul className="space-y-2">
            {tasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3"
              >
                {/* 상태 토글 */}
                <button
                  onClick={() => toggleStatus(task)}
                  title={task.status === 'todo' ? '완료로 변경' : '미완료로 변경'}
                  className="shrink-0"
                >
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      task.status === 'done'
                        ? 'bg-olive-100 text-olive-700'
                        : 'bg-secondary text-secondary-foreground'
                    }`}
                  >
                    {task.status === 'done' ? '완료' : '진행 중'}
                  </span>
                </button>

                {/* 제목 */}
                <span
                  className={`flex-1 text-sm ${
                    task.status === 'done'
                      ? 'text-muted-foreground line-through'
                      : 'text-foreground'
                  }`}
                >
                  {task.title}
                </span>

                {/* 삭제 */}
                <button
                  onClick={() => deleteTask(task.id)}
                  title="삭제"
                  className="shrink-0 text-muted-foreground hover:text-destructive"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}
