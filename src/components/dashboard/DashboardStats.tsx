'use client';

import { CheckCircleIcon, ClipboardListIcon, AlertCircleIcon, PlayCircleIcon } from 'lucide-react';
import { StatsCard } from './StatsCard';
import type { Task } from '@/lib/types';
import { isOverdue } from '@/lib/utils';

interface DashboardStatsProps {
  tasks: Task[];
}

export function DashboardStats({ tasks }: DashboardStatsProps) {
  const total = tasks.length;
  const inProgress = tasks.filter((t) => t.status === 'in_progress').length;
  const done = tasks.filter((t) => t.status === 'done').length;
  const overdue = tasks.filter((t) => isOverdue(t.dueDate) && t.status !== 'done').length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard
        title="전체 일감"
        value={total}
        description="등록된 모든 일감"
        icon={ClipboardListIcon}
        variant="default"
      />
      <StatsCard
        title="진행 중"
        value={inProgress}
        description="현재 작업 중인 일감"
        icon={PlayCircleIcon}
        variant="primary"
      />
      <StatsCard
        title="완료"
        value={done}
        description={`완료율 ${total > 0 ? Math.round((done / total) * 100) : 0}%`}
        icon={CheckCircleIcon}
        variant="accent"
      />
      <StatsCard
        title="기한 초과"
        value={overdue}
        description="마감일이 지난 일감"
        icon={AlertCircleIcon}
        variant={overdue > 0 ? 'danger' : 'default'}
      />
    </div>
  );
}
