import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { TaskCategory } from '@/lib/types';
import { CATEGORY_LABELS } from '@/lib/types';

const categoryStyles: Record<TaskCategory, string> = {
  feature: 'bg-violet-50 text-violet-600 border-violet-200 hover:bg-violet-50',
  bug: 'bg-red-50 text-red-600 border-red-200 hover:bg-red-50',
  design: 'bg-vpink-50 text-vpink-600 border-vpink-200 hover:bg-vpink-50',
  docs: 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-50',
  infra: 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-100',
  other: 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-50',
};

interface CategoryBadgeProps {
  category: TaskCategory;
  className?: string;
}

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn('text-xs font-medium', categoryStyles[category], className)}
    >
      {CATEGORY_LABELS[category]}
    </Badge>
  );
}
