import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  description?: string;
  icon: LucideIcon;
  trend?: { value: number; positive: boolean };
  variant?: 'default' | 'primary' | 'accent' | 'warning' | 'danger';
}

const variantStyles = {
  default: 'bg-white border-border',
  primary: 'bg-olive-600 border-olive-700 text-white',
  accent: 'bg-vpink-100 border-vpink-200',
  warning: 'bg-amber-50 border-amber-200',
  danger: 'bg-red-50 border-red-200',
};

const iconStyles = {
  default: 'bg-olive-50 text-olive-600',
  primary: 'bg-olive-500 text-white',
  accent: 'bg-vpink-200 text-vpink-700',
  warning: 'bg-amber-100 text-amber-600',
  danger: 'bg-red-100 text-red-600',
};

const titleStyles = {
  default: 'text-muted-foreground',
  primary: 'text-olive-100',
  accent: 'text-vpink-600',
  warning: 'text-amber-600',
  danger: 'text-red-600',
};

const valueStyles = {
  default: 'text-foreground',
  primary: 'text-white',
  accent: 'text-vpink-800',
  warning: 'text-amber-800',
  danger: 'text-red-800',
};

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  variant = 'default',
}: StatsCardProps) {
  return (
    <div className={cn(
      'rounded-xl border p-5 shadow-sm',
      variantStyles[variant]
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className={cn(
          'size-10 rounded-lg flex items-center justify-center',
          iconStyles[variant]
        )}>
          <Icon className="size-5" />
        </div>
        {trend && (
          <span className={cn(
            'text-xs font-medium px-2 py-0.5 rounded-full',
            trend.positive
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-red-100 text-red-600'
          )}>
            {trend.positive ? '▲' : '▼'} {Math.abs(trend.value)}
          </span>
        )}
      </div>
      <div className={cn('text-3xl font-bold mb-1', valueStyles[variant])}>
        {value}
      </div>
      <div className={cn('text-sm font-medium', titleStyles[variant])}>
        {title}
      </div>
      {description && (
        <p className={cn('text-xs mt-0.5 opacity-70', titleStyles[variant])}>
          {description}
        </p>
      )}
    </div>
  );
}
