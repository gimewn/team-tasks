// @vitest-environment node
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { waitForDevServer, signInTestUser, getAdminSupabase } from './integration-helpers'

const BASE = 'http://localhost:3000'

let cookieHeader: string
let userId: string

beforeAll(async () => {
  await waitForDevServer()
  ;({ cookieHeader, userId } = await signInTestUser())
})

// ────────────────────────────────────────────
// GET /api/tasks
// ────────────────────────────────────────────
describe('GET /api/tasks', () => {
  it('비인증 → 307 redirect to /login', async () => {
    const res = await fetch(`${BASE}/api/tasks`, { redirect: 'manual' })
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toContain('/login')
  })

  it('인증 → 200 + 배열', async () => {
    const res = await fetch(`${BASE}/api/tasks`, {
      headers: { cookie: cookieHeader },
    })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(Array.isArray(body)).toBe(true)
  })
})

// ────────────────────────────────────────────
// POST /api/tasks
// ────────────────────────────────────────────
describe('POST /api/tasks', () => {
  const createdIds: string[] = []

  afterAll(async () => {
    if (createdIds.length === 0) return
    const admin = getAdminSupabase()
    await admin.from('tasks').delete().in('id', createdIds)
  })

  it('비인증 → 307 redirect to /login', async () => {
    const res = await fetch(`${BASE}/api/tasks`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title: 'should-not-create' }),
      redirect: 'manual',
    })
    expect(res.status).toBe(307)
  })

  it('title 없음 → 400', async () => {
    const res = await fetch(`${BASE}/api/tasks`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', cookie: cookieHeader },
      body: JSON.stringify({}),
    })
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toBe('title is required')
  })

  it('정상 body → 201 + task 객체', async () => {
    const res = await fetch(`${BASE}/api/tasks`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', cookie: cookieHeader },
      body: JSON.stringify({ title: 'integration-test task' }),
    })
    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.id).toBeDefined()
    expect(body.title).toBe('integration-test task')
    expect(body.created_by).toBe(userId)
    expect(body.assignee_id).toBe(userId)
    createdIds.push(body.id)
  })

  it('assignee_id 지정 → 201 + 지정된 assignee', async () => {
    const res = await fetch(`${BASE}/api/tasks`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', cookie: cookieHeader },
      body: JSON.stringify({ title: 'assignee test', assignee_id: userId }),
    })
    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.assignee_id).toBe(userId)
    createdIds.push(body.id)
  })
})

// ────────────────────────────────────────────
// GET /api/tasks/:id
// ────────────────────────────────────────────
describe('GET /api/tasks/:id', () => {
  let taskId: string

  beforeAll(async () => {
    const admin = getAdminSupabase()
    const { data } = await admin
      .from('tasks')
      .insert({ title: 'get-by-id test', created_by: userId, assignee_id: userId })
      .select()
      .single()
    taskId = data!.id
  })

  afterAll(async () => {
    const admin = getAdminSupabase()
    await admin.from('tasks').delete().eq('id', taskId)
  })

  it('비인증 → 307', async () => {
    const res = await fetch(`${BASE}/api/tasks/${taskId}`, { redirect: 'manual' })
    expect(res.status).toBe(307)
  })

  it('존재하는 id → 200 + task', async () => {
    const res = await fetch(`${BASE}/api/tasks/${taskId}`, {
      headers: { cookie: cookieHeader },
    })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.id).toBe(taskId)
    expect(body.title).toBe('get-by-id test')
  })

  it('없는 id → 404', async () => {
    const res = await fetch(`${BASE}/api/tasks/00000000-0000-0000-0000-000000000000`, {
      headers: { cookie: cookieHeader },
    })
    expect(res.status).toBe(404)
  })
})

// ────────────────────────────────────────────
// PATCH /api/tasks/:id
// ────────────────────────────────────────────
describe('PATCH /api/tasks/:id', () => {
  let taskId: string

  beforeAll(async () => {
    const admin = getAdminSupabase()
    const { data } = await admin
      .from('tasks')
      .insert({ title: 'patch test', created_by: userId, assignee_id: userId })
      .select()
      .single()
    taskId = data!.id
  })

  afterAll(async () => {
    const admin = getAdminSupabase()
    await admin.from('tasks').delete().eq('id', taskId)
  })

  it('비인증 → 307', async () => {
    const res = await fetch(`${BASE}/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ status: 'done' }),
      redirect: 'manual',
    })
    expect(res.status).toBe(307)
  })

  it('필드 없음 → 400', async () => {
    const res = await fetch(`${BASE}/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json', cookie: cookieHeader },
      body: JSON.stringify({}),
    })
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toBe('no fields to update')
  })

  it('status 변경 → 200 + 변경된 값', async () => {
    const res = await fetch(`${BASE}/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json', cookie: cookieHeader },
      body: JSON.stringify({ status: 'done' }),
    })
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.status).toBe('done')
  })
})

// ────────────────────────────────────────────
// DELETE /api/tasks/:id
// ────────────────────────────────────────────
describe('DELETE /api/tasks/:id', () => {
  let taskId: string

  beforeAll(async () => {
    const admin = getAdminSupabase()
    const { data } = await admin
      .from('tasks')
      .insert({ title: 'delete test', created_by: userId, assignee_id: userId })
      .select()
      .single()
    taskId = data!.id
  })

  it('비인증 → 307', async () => {
    const res = await fetch(`${BASE}/api/tasks/${taskId}`, {
      method: 'DELETE',
      redirect: 'manual',
    })
    expect(res.status).toBe(307)
  })

  it('인증 → 204', async () => {
    const res = await fetch(`${BASE}/api/tasks/${taskId}`, {
      method: 'DELETE',
      headers: { cookie: cookieHeader },
    })
    expect(res.status).toBe(204)
  })
})
