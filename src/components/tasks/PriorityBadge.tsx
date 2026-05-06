import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { TaskPriority } from '@/lib/types';
import { PRIORITY_LABELS } from '@/lib/types';

const priorityStyles: Record<TaskPriority, string> = {
  low: 'bg-sky-50 text-sky-600 border-sky-200 hover:bg-sky-50',
  medium: 'bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-50',
  high: 'bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-50',
  urgent: 'bg-red-50 text-red-600 border-red-200 hover:bg-red-50',
};

const priorityDots: Record<TaskPriority, string> = {
  low: 'bg-sky-400',
  medium: 'bg-amber-400',
  high: 'bg-orange-500',
  urgent: 'bg-red-500',
};

interface PriorityBadgeProps {
  priority: TaskPriority;
  className?: string;
  showDot?: boolean;
}

export function PriorityBadge({ priority, className, showDot = true }: PriorityBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn('text-xs font-medium gap-1.5', priorityStyles[priority], className)}
    >
      {showDot && (
        <span className={cn('size-1.5 rounded-full', priorityDots[priority])} />
      )}
      {PRIORITY_LABELS[priority]}
    </Badge>
  );
}
