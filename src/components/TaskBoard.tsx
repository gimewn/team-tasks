'use client'

import { useState } from 'react'
import type { Tables } from '@/lib/database.types'

type Task = Tables<'tasks'>
type Comment = Tables<'comments'> & { profiles: { display_name: string; emoji: string } | null }

const DEFAULT_EMOJI = '🍅'

interface Props {
  initialTasks: Task[]
}

export function TaskBoard({ initialTasks }: Props) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [title, setTitle] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const [expandedTaskIds, setExpandedTaskIds] = useState<Set<string>>(new Set())
  const [commentsByTask, setCommentsByTask] = useState<Record<string, Comment[]>>({})
  const [commentInput, setCommentInput] = useState<Record<string, string>>({})
  const [postingComment, setPostingComment] = useState<Record<string, boolean>>({})

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
      setTasks(prev => [created, ...prev])
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
      setTasks(prev => prev.map(t => t.id === updated.id ? updated : t))
    }
  }

  async function deleteTask(id: string) {
    const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' })
    if (res.ok) setTasks(prev => prev.filter(t => t.id !== id))
  }

  async function toggleComments(taskId: string) {
    const isOpen = expandedTaskIds.has(taskId)
    if (isOpen) {
      setExpandedTaskIds(prev => { const s = new Set(prev); s.delete(taskId); return s })
      return
    }
    setExpandedTaskIds(prev => new Set(prev).add(taskId))
    if (commentsByTask[taskId]) return
    const res = await fetch(`/api/comments?task_id=${taskId}`)
    if (res.ok) {
      const data: Comment[] = await res.json()
      setCommentsByTask(prev => ({ ...prev, [taskId]: data }))
    }
  }

  async function addComment(taskId: string) {
    const body = commentInput[taskId]?.trim()
    if (!body) return
    setPostingComment(prev => ({ ...prev, [taskId]: true }))
    const res = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task_id: taskId, body }),
    })
    if (res.ok) {
      const created: Comment = await res.json()
      setCommentsByTask(prev => ({ ...prev, [taskId]: [...(prev[taskId] ?? []), created] }))
      setCommentInput(prev => ({ ...prev, [taskId]: '' }))
    }
    setPostingComment(prev => ({ ...prev, [taskId]: false }))
  }

  async function deleteComment(taskId: string, commentId: string) {
    const res = await fetch(`/api/comments/${commentId}`, { method: 'DELETE' })
    if (res.ok) {
      setCommentsByTask(prev => ({
        ...prev,
        [taskId]: prev[taskId].filter(c => c.id !== commentId),
      }))
    }
  }

  return (
    <>
      {/* 일감 추가 폼 */}
      <form onSubmit={addTask} className="flex gap-2">
        <input
          type="text"
          placeholder="🌱 새 일감 제목을 입력하세요"
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={submitting}
          className="flex-1 rounded-2xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 shadow-sm"
        />
        <button
          type="submit"
          disabled={!title.trim() || submitting}
          className="rounded-2xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity shadow-sm"
        >
          추가
        </button>
      </form>

      {/* 일감 목록 */}
      {tasks.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-12">🍃 아직 일감이 없어요. 첫 일감을 추가해 보세요!</p>
      ) : (
        <ul className="space-y-3">
          {tasks.map(task => {
            const isExpanded = expandedTaskIds.has(task.id)
            const comments = commentsByTask[task.id] ?? []
            const isDone = task.status === 'done'
            return (
              <li key={task.id} className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 px-5 py-3.5">
                  <button
                    onClick={() => toggleStatus(task)}
                    title={isDone ? '미완료로 변경' : '완료로 변경'}
                    className="shrink-0"
                  >
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold whitespace-nowrap ${
                        isDone
                          ? 'bg-accent text-accent-foreground'
                          : 'bg-secondary text-secondary-foreground'
                      }`}
                    >
                      {isDone ? '🍂 완료' : '🌱 진행 중'}
                    </span>
                  </button>

                  <button
                    onClick={() => toggleComments(task.id)}
                    className="flex flex-1 items-center gap-2 min-w-0 text-left"
                  >
                    <span
                      className={`flex-1 text-sm font-semibold ${
                        isDone ? 'text-muted-foreground line-through' : 'text-foreground'
                      }`}
                    >
                      {task.title}
                    </span>
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`shrink-0 text-muted-foreground transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>

                  <button
                    onClick={() => deleteTask(task.id)}
                    title="삭제"
                    className="shrink-0 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                    </svg>
                  </button>
                </div>

                {isExpanded && (
                  <div className="border-t border-border bg-muted/60 px-5 py-4 space-y-3">
                    {comments.length === 0 ? (
                      <p className="text-xs text-muted-foreground">🌼 아직 댓글이 없어요.</p>
                    ) : (
                      <ul className="space-y-2.5">
                        {comments.map(c => (
                          <li key={c.id} className="flex items-start gap-2">
                            <div className="flex-1 min-w-0">
                              <span className="text-xs font-bold text-foreground mr-1.5">
                                {c.profiles?.emoji ?? DEFAULT_EMOJI} {c.profiles?.display_name || '알 수 없음'}
                              </span>
                              <span className="text-sm text-foreground">{c.body}</span>
                            </div>
                            <span className="shrink-0 text-xs text-muted-foreground whitespace-nowrap mt-0.5">
                              {new Date(c.created_at).toLocaleString('ko-KR', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <button
                              onClick={() => deleteComment(task.id, c.id)}
                              className="shrink-0 text-xs text-muted-foreground hover:text-destructive transition-colors mt-0.5"
                            >
                              삭제
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="flex gap-2 pt-1">
                      <input
                        type="text"
                        placeholder="댓글을 남겨 보세요 🍀"
                        value={commentInput[task.id] ?? ''}
                        onChange={e => setCommentInput(prev => ({ ...prev, [task.id]: e.target.value }))}
                        onKeyDown={e => { if (e.key === 'Enter') addComment(task.id) }}
                        disabled={postingComment[task.id]}
                        className="flex-1 rounded-2xl border border-border bg-card px-4 py-1.5 text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                      />
                      <button
                        onClick={() => addComment(task.id)}
                        disabled={!commentInput[task.id]?.trim() || postingComment[task.id]}
                        className="rounded-2xl bg-primary px-4 py-1.5 text-sm font-bold text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-opacity"
                      >
                        등록
                      </button>
                    </div>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </>
  )
}
