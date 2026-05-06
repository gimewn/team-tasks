'use client';

import { SearchIcon, XIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { FilterState, TeamMember } from '@/lib/types';
import { STATUS_LABELS, PRIORITY_LABELS, CATEGORY_LABELS } from '@/lib/types';

const DEFAULT_FILTER: FilterState = {
  search: '',
  status: 'all',
  priority: 'all',
  category: 'all',
  assigneeId: 'all',
};

interface TaskFiltersProps {
  filter: FilterState;
  members: TeamMember[];
  onChange: (filter: FilterState) => void;
}

export function TaskFilters({ filter, members, onChange }: TaskFiltersProps) {
  const hasActiveFilters =
    filter.search !== '' ||
    filter.status !== 'all' ||
    filter.priority !== 'all' ||
    filter.category !== 'all' ||
    filter.assigneeId !== 'all';

  const update = (partial: Partial<FilterState>) =>
    onChange({ ...filter, ...partial });

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {/* Search */}
      <div className="relative min-w-[200px] flex-1">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="일감 검색..."
          value={filter.search}
          onChange={(e) => update({ search: e.target.value })}
          className="pl-9 h-9 bg-white"
        />
      </div>

      {/* Status */}
      <Select
        value={filter.status}
        onValueChange={(v) => update({ status: v as FilterState['status'] })}
      >
        <SelectTrigger className="h-9 w-[130px] bg-white text-sm">
          <SelectValue placeholder="상태" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">전체 상태</SelectItem>
          {(Object.keys(STATUS_LABELS) as Array<keyof typeof STATUS_LABELS>).map((key) => (
            <SelectItem key={key} value={key}>{STATUS_LABELS[key]}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Priority */}
      <Select
        value={filter.priority}
        onValueChange={(v) => update({ priority: v as FilterState['priority'] })}
      >
        <SelectTrigger className="h-9 w-[120px] bg-white text-sm">
          <SelectValue placeholder="우선순위" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">전체 우선순위</SelectItem>
          {(Object.keys(PRIORITY_LABELS) as Array<keyof typeof PRIORITY_LABELS>).map((key) => (
            <SelectItem key={key} value={key}>{PRIORITY_LABELS[key]}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Category */}
      <Select
        value={filter.category}
        onValueChange={(v) => update({ category: v as FilterState['category'] })}
      >
        <SelectTrigger className="h-9 w-[110px] bg-white text-sm">
          <SelectValue placeholder="분류" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">전체 분류</SelectItem>
          {(Object.keys(CATEGORY_LABELS) as Array<keyof typeof CATEGORY_LABELS>).map((key) => (
            <SelectItem key={key} value={key}>{CATEGORY_LABELS[key]}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Assignee */}
      <Select
        value={filter.assigneeId}
        onValueChange={(v) => update({ assigneeId: v ?? 'all' })}
      >
        <SelectTrigger className="h-9 w-[120px] bg-white text-sm">
          <SelectValue placeholder="담당자" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">전체 담당자</SelectItem>
          {members.map((m) => (
            <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Reset */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          className="h-9 text-muted-foreground hover:text-foreground"
          onClick={() => onChange(DEFAULT_FILTER)}
        >
          <XIcon className="size-4 mr-1" />
          초기화
        </Button>
      )}
    </div>
  );
}
