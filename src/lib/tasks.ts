type TaskInsertRecord = {
  title: string
  created_by: string
  assignee_id: string
}

type BuildTaskRecordResult =
  | { ok: true; record: TaskInsertRecord }
  | { ok: false; error: string; status: number }

export function buildTaskRecord(
  body: { title?: unknown; assignee_id?: unknown },
  user: { id: string },
): BuildTaskRecordResult {
  const title = body.title as string | undefined
  const assignee_id = body.assignee_id as string | undefined

  if (!title?.trim()) {
    return { ok: false, error: 'title is required', status: 400 }
  }

  return {
    ok: true,
    record: {
      title: title.trim(),
      created_by: user.id,
      assignee_id: assignee_id ?? user.id,
    },
  }
}
