'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { createClient } from '@/lib/supabase/client'

const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false })

interface Props {
  email: string
  initialEmoji: string
}

export function PageHeader({ email, initialEmoji }: Props) {
  const [userEmoji, setUserEmoji] = useState(initialEmoji)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const pickerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  async function pickEmoji(emoji: string) {
    const prev = userEmoji
    setUserEmoji(emoji)
    setShowEmojiPicker(false)
    const res = await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emoji }),
    })
    if (res.ok) {
      router.refresh()
    } else {
      setUserEmoji(prev)
    }
  }

  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-extrabold text-foreground flex items-center gap-2">
          💬 팀 일감
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">내가 만들거나 내게 배정된 일감이에요.</p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <div className="relative" ref={pickerRef}>
          <button
            onClick={() => setShowEmojiPicker(v => !v)}
            title="내 이모티콘 변경"
            className="flex items-center gap-1.5 rounded-2xl border border-border bg-card px-3 py-1.5 text-sm font-medium hover:bg-accent transition-colors shadow-sm"
          >
            <span className="text-lg leading-none">{userEmoji}</span>
            <span className="text-muted-foreground text-xs hidden sm:inline max-w-[120px] truncate">{email}</span>
          </button>

          {showEmojiPicker && (
            <div className="absolute right-0 top-11 z-50 shadow-2xl rounded-3xl overflow-hidden">
              <EmojiPicker
                onEmojiClick={(data) => pickEmoji(data.emoji)}
                width={320}
                height={420}
              />
            </div>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="rounded-2xl border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-accent transition-colors shadow-sm"
        >
          로그아웃
        </button>
      </div>
    </div>
  )
}
