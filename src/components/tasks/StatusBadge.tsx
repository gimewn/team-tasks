import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { TaskStatus } from '@/lib/types';
import { STATUS_LABELS } from '@/lib/types';

const statusStyles: Record<TaskStatus, string> = {
  todo: 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-100',
  in_progress: 'bg-olive-100 text-olive-700 border-olive-200 hover:bg-olive-100',
  review: 'bg-vpink-100 text-vpink-700 border-vpink-200 hover:bg-vpink-100',
  done: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50',
};

interface StatusBadgeProps {
  status: TaskStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn('text-xs font-medium', statusStyles[status], className)}
    >
      {STATUS_LABELS[status]}
    </Badge>
  );
}
