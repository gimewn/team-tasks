import { describe, it, expect } from 'vitest'
import { buildTaskRecord } from './tasks'

const user = { id: 'user-a' }

describe('buildTaskRecord', () => {
  describe('title 검증 실패 → ok: false', () => {
    it('title 이 undefined 이면 400 반환', () => {
      const result = buildTaskRecord({ title: undefined }, user)
      expect(result).toEqual({ ok: false, error: 'title is required', status: 400 })
    })

    it('title 이 빈 문자열이면 400 반환', () => {
      const result = buildTaskRecord({ title: '' }, user)
      expect(result).toEqual({ ok: false, error: 'title is required', status: 400 })
    })

    it('title 이 공백만 있으면 400 반환', () => {
      const result = buildTaskRecord({ title: '   ' }, user)
      expect(result).toEqual({ ok: false, error: 'title is required', status: 400 })
    })
  })

  describe('정상 입력 → ok: true', () => {
    it('assignee_id 제공 시 record 에 그대로 사용', () => {
      const result = buildTaskRecord({ title: 'hello', assignee_id: 'user-b' }, user)
      expect(result).toEqual({
        ok: true,
        record: { title: 'hello', created_by: 'user-a', assignee_id: 'user-b' },
      })
    })

    it('title 앞뒤 공백을 trim 한다', () => {
      const result = buildTaskRecord({ title: '  hello  ', assignee_id: 'user-b' }, user)
      expect(result).toEqual({
        ok: true,
        record: { title: 'hello', created_by: 'user-a', assignee_id: 'user-b' },
      })
    })

    it('assignee_id 없으면 user.id 로 폴백', () => {
      const result = buildTaskRecord({ title: 'hello' }, user)
      expect(result).toEqual({
        ok: true,
        record: { title: 'hello', created_by: 'user-a', assignee_id: 'user-a' },
      })
    })

    it('assignee_id 가 빈 문자열이면 폴백하지 않고 그대로 사용', () => {
      const result = buildTaskRecord({ title: 'hello', assignee_id: '' }, user)
      expect(result).toEqual({
        ok: true,
        record: { title: 'hello', created_by: 'user-a', assignee_id: '' },
      })
    })
  })
})
