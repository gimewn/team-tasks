'use client';

import { CalendarIcon, EditIcon, Trash2Icon, ArrowRightIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { cn, formatDate, formatDateTime, isOverdue, isDueSoon } from '@/lib/utils';
import type { Task, TeamMember, TaskStatus } from '@/lib/types';
import { STATUS_LABELS } from '@/lib/types';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { CategoryBadge } from './CategoryBadge';
import { MemberAvatar } from './MemberAvatar';

const STATUS_FLOW: TaskStatus[] = ['todo', 'in_progress', 'review', 'done'];

interface TaskDetailProps {
  task: Task | null;
  member?: TeamMember;
  open: boolean;
  onClose: () => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, status: TaskStatus) => void;
}

export function TaskDetail({
  task,
  member,
  open,
  onClose,
  onEdit,
  onDelete,
  onMove,
}: TaskDetailProps) {
  if (!task) return null;

  const overdue = isOverdue(task.dueDate) && task.status !== 'done';
  const dueSoon = isDueSoon(task.dueDate) && task.status !== 'done';
  const currentIdx = STATUS_FLOW.indexOf(task.status);
  const nextStatus = currentIdx < STATUS_FLOW.length - 1 ? STATUS_FLOW[currentIdx + 1] : null;

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-base leading-relaxed pr-6">{task.title}</SheetTitle>
          <div className="flex flex-wrap gap-2 pt-1">
            <StatusBadge status={task.status} />
            <PriorityBadge priority={task.priority} />
            <CategoryBadge category={task.category} />
          </div>
        </SheetHeader>

        <div className="space-y-5">
          {/* Description */}
          {task.description && (
            <div>
              <p className="text-xs text-muted-foreground mb-1.5 font-medium uppercase tracking-wide">설명</p>
              <p className="text-sm text-foreground leading-relaxed">{task.description}</p>
            </div>
          )}

          <Separator />

          {/* Meta info */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium">담당자</span>
              {member ? (
                <div className="flex items-center gap-2">
                  <MemberAvatar member={member} size="sm" showTooltip={false} />
                  <span className="text-sm">{member.name}</span>
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">미배정</span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium">마감일</span>
              {task.dueDate ? (
                <div className={cn(
                  'flex items-center gap-1.5 text-sm font-medium',
                  overdue ? 'text-red-500' : dueSoon ? 'text-amber-500' : 'text-foreground'
                )}>
                  <CalendarIcon className="size-3.5" />
                  {formatDate(task.dueDate)}
                  {overdue && <span className="text-xs">(기한 초과)</span>}
                  {dueSoon && !overdue && <span className="text-xs">(임박)</span>}
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">미설정</span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium">생성일</span>
              <span className="text-sm text-muted-foreground">{formatDateTime(task.createdAt)}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium">수정일</span>
              <span className="text-sm text-muted-foreground">{formatDateTime(task.updatedAt)}</span>
            </div>
          </div>

          {/* Tags */}
          {task.tags.length > 0 && (
            <>
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground mb-2 font-medium">태그</p>
                <div className="flex flex-wrap gap-1.5">
                  {task.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2.5 py-1 rounded-full bg-olive-50 text-olive-700 border border-olive-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Move to next status */}
          {nextStatus && task.status !== 'done' && (
            <Button
              variant="outline"
              className="w-full border-olive-200 text-olive-700 hover:bg-olive-50"
              onClick={() => onMove(task.id, nextStatus)}
            >
              <ArrowRightIcon className="size-4 mr-2" />
              {STATUS_LABELS[nextStatus]}(으)로 이동
            </Button>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              className="flex-1"
              onClick={() => onEdit(task)}
            >
              <EditIcon className="size-4 mr-2" />
              수정
            </Button>

            <AlertDialog>
              <AlertDialogTrigger render={<Button variant="outline" size="icon" className="text-destructive hover:bg-destructive/10 border-destructive/30" />}>
                <Trash2Icon className="size-4" />
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>일감 삭제</AlertDialogTitle>
                  <AlertDialogDescription>
                    <strong>&ldquo;{task.title}&rdquo;</strong> 일감을 삭제할까요?
                    이 작업은 되돌릴 수 없습니다.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>취소</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive hover:bg-destructive/90"
                    onClick={() => {
                      onDelete(task.id);
                      onClose();
                    }}
                  >
                    삭제
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
