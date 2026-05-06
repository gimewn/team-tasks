'use client';

import { CalendarIcon, GripVertical } from 'lucide-react';
import { cn, formatDate, isOverdue, isDueSoon } from '@/lib/utils';
import type { Task, TeamMember } from '@/lib/types';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { CategoryBadge } from './CategoryBadge';
import { MemberAvatar } from './MemberAvatar';

interface TaskCardProps {
  task: Task;
  member?: TeamMember;
  onClick: () => void;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: () => void;
  compact?: boolean;
}

export function TaskCard({ task, member, onClick, onDragStart, onDragEnd, compact }: TaskCardProps) {
  const overdue = isOverdue(task.dueDate) && task.status !== 'done';
  const dueSoon = isDueSoon(task.dueDate) && task.status !== 'done';

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
      className={cn(
        'group bg-white rounded-xl border border-border shadow-sm cursor-pointer',
        'transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-olive-200',
        'active:scale-[0.98]',
        compact ? 'p-3' : 'p-4'
      )}
    >
      {/* Header: category + drag handle */}
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <CategoryBadge category={task.category} />
        <GripVertical className="size-4 text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5" />
      </div>

      {/* Title */}
      <h3 className={cn(
        'font-semibold text-foreground leading-snug mb-1.5',
        compact ? 'text-sm' : 'text-sm'
      )}>
        {task.title}
      </h3>

      {/* Description */}
      {!compact && task.description && (
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Priority */}
      <div className="mb-3">
        <PriorityBadge priority={task.priority} />
      </div>

      {/* Tags */}
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
            >
              {tag}
            </span>
          ))}
          {task.tags.length > 3 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
              +{task.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Footer: assignee + due date */}
      <div className="flex items-center justify-between pt-2 border-t border-border/60">
        <div>
          {member ? (
            <MemberAvatar member={member} size="sm" />
          ) : (
            <div className="size-6 rounded-full border-2 border-dashed border-muted-foreground/30" />
          )}
        </div>
        {task.dueDate && (
          <div className={cn(
            'flex items-center gap-1 text-[11px] font-medium',
            overdue ? 'text-red-500' : dueSoon ? 'text-amber-500' : 'text-muted-foreground'
          )}>
            <CalendarIcon className="size-3" />
            {formatDate(task.dueDate)}
          </div>
        )}
      </div>
    </div>
  );
}
