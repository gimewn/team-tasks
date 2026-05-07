export default function Loading() {
  return (
    <main className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-2xl space-y-8 animate-pulse">
        {/* 헤더 스켈레톤 */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="h-8 w-32 rounded-2xl bg-muted" />
            <div className="h-4 w-52 rounded-xl bg-muted" />
          </div>
          <div className="h-9 w-36 rounded-2xl bg-muted" />
        </div>
        {/* 입력 폼 스켈레톤 */}
        <div className="flex gap-2">
          <div className="h-10 flex-1 rounded-2xl bg-muted" />
          <div className="h-10 w-16 rounded-2xl bg-muted" />
        </div>
        {/* 일감 카드 스켈레톤 */}
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-14 rounded-3xl bg-muted" />
        ))}
      </div>
    </main>
  )
}
