import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, isAfter, isBefore, addDays, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { Task } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return '-';
  return format(parseISO(dateStr), 'M월 d일', { locale: ko });
}

export function formatDateTime(dateStr: string): string {
  return format(parseISO(dateStr), 'yyyy.MM.dd HH:mm', { locale: ko });
}

export function isOverdue(dueDate: string | null): boolean {
  if (!dueDate) return false;
  return isBefore(parseISO(dueDate), new Date());
}

export function isDueSoon(dueDate: string | null, days = 3): boolean {
  if (!dueDate) return false;
  const due = parseISO(dueDate);
  return isAfter(due, new Date()) && isBefore(due, addDays(new Date(), days));
}

export function generateId(): string {
  return `task-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function filterTasks(tasks: Task[], filter: {
  search: string;
  status: string;
  priority: string;
  category: string;
  assigneeId: string;
}): Task[] {
  return tasks.filter((task) => {
    if (filter.search) {
      const q = filter.search.toLowerCase();
      if (
        !task.title.toLowerCase().includes(q) &&
        !task.description.toLowerCase().includes(q) &&
        !task.tags.some((t) => t.toLowerCase().includes(q))
      ) {
        return false;
      }
    }
    if (filter.status !== 'all' && task.status !== filter.status) return false;
    if (filter.priority !== 'all' && task.priority !== filter.priority) return false;
    if (filter.category !== 'all' && task.category !== filter.category) return false;
    if (filter.assigneeId !== 'all' && task.assigneeId !== filter.assigneeId) return false;
    return true;
  });
}
