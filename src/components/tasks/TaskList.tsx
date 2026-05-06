'use client';

import { useState } from 'react';
import { ChevronUpIcon, ChevronDownIcon, ChevronsUpDownIcon } from 'lucide-react';
import { cn, formatDate, isOverdue, isDueSoon } from '@/lib/utils';
import type { Task, TeamMember } from '@/lib/types';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { CategoryBadge } from './CategoryBadge';
import { MemberAvatar } from './MemberAvatar';
import { CalendarIcon } from 'lucide-react';

type SortKey = 'title' | 'status' | 'priority' | 'dueDate' | 'createdAt';
type SortDir = 'asc' | 'desc';

const PRIORITY_ORDER = { urgent: 0, high: 1, medium: 2, low: 3 };
const STATUS_ORDER = { todo: 0, in_progress: 1, review: 2, done: 3 };

function SortIcon({ col, sortKey, dir }: { col: SortKey; sortKey: SortKey; dir: SortDir }) {
  if (col !== sortKey) return <ChevronsUpDownIcon className="size-3.5 opacity-40" />;
  return dir === 'asc'
    ? <ChevronUpIcon className="size-3.5 text-olive-600" />
    : <ChevronDownIcon className="size-3.5 text-olive-600" />;
}

interface TaskListProps {
  tasks: Task[];
  members: TeamMember[];
  onTaskClick: (task: Task) => void;
}

export function TaskList({ tasks, members, onTaskClick }: TaskListProps) {
  const [sortKey, setSortKey] = useState<SortKey>('createdAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const getMember = (id: string | null) => members.find((m) => m.id === id);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sorted = [...tasks].sort((a, b) => {
    let cmp = 0;
    switch (sortKey) {
      case 'title': cmp = a.title.localeCompare(b.title, 'ko'); break;
      case 'status': cmp = STATUS_ORDER[a.status] - STATUS_ORDER[b.status]; break;
      case 'priority': cmp = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]; break;
      case 'dueDate':
        if (!a.dueDate && !b.dueDate) cmp = 0;
        else if (!a.dueDate) cmp = 1;
        else if (!b.dueDate) cmp = -1;
        else cmp = a.dueDate.localeCompare(b.dueDate);
        break;
      case 'createdAt': cmp = a.createdAt.localeCompare(b.createdAt); break;
    }
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const TH = ({ col, label }: { col: SortKey; label: string }) => (
    <th
      className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide cursor-pointer select-none hover:text-foreground"
      onClick={() => handleSort(col)}
    >
      <div className="flex items-center gap-1.5">
        {label}
        <SortIcon col={col} sortKey={sortKey} dir={sortDir} />
      </div>
    </th>
  );

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <p className="text-sm">조건에 맞는 일감이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-white shadow-sm">
      <table className="w-full">
        <thead className="border-b border-border bg-muted/30">
          <tr>
            <TH col="title" label="제목" />
            <TH col="status" label="상태" />
            <TH col="priority" label="우선순위" />
            <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">분류</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">담당자</th>
            <TH col="dueDate" label="마감일" />
            <TH col="createdAt" label="생성일" />
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {sorted.map((task) => {
            const member = getMember(task.assigneeId);
            const overdue = isOverdue(task.dueDate) && task.status !== 'done';
            const dueSoon = isDueSoon(task.dueDate) && task.status !== 'done';

            return (
              <tr
                key={task.id}
                onClick={() => onTaskClick(task)}
                className="hover:bg-olive-50/40 cursor-pointer transition-colors"
              >
                <td className="px-4 py-3.5">
                  <div className="flex items-start gap-2">
                    <span className="text-sm font-medium text-foreground leading-snug line-clamp-2 max-w-[280px]">
                      {task.title}
                    </span>
                  </div>
                  {task.tags.length > 0 && (
                    <div className="flex gap-1 mt-1">
                      {task.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <StatusBadge status={task.status} />
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <PriorityBadge priority={task.priority} />
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <CategoryBadge category={task.category} />
                </td>
                <td className="px-4 py-3.5">
                  {member ? (
                    <div className="flex items-center gap-2">
                      <MemberAvatar member={member} size="sm" showTooltip={false} />
                      <span className="text-sm text-muted-foreground whitespace-nowrap">{member.name}</span>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">-</span>
                  )}
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap">
                  {task.dueDate ? (
                    <div className={cn(
                      'flex items-center gap-1.5 text-sm font-medium',
                      overdue ? 'text-red-500' : dueSoon ? 'text-amber-500' : 'text-muted-foreground'
                    )}>
                      <CalendarIcon className="size-3.5" />
                      {formatDate(task.dueDate)}
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">-</span>
                  )}
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap text-sm text-muted-foreground">
                  {formatDate(task.createdAt)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
