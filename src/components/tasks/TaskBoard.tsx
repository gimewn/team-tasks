'use client';

import { useState } from 'react';
import { PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Task, TaskStatus, TeamMember } from '@/lib/types';
import { STATUS_LABELS } from '@/lib/types';
import { TaskCard } from './TaskCard';

const COLUMNS: { status: TaskStatus; color: string; headerBg: string; dotColor: string }[] = [
  {
    status: 'todo',
    color: 'border-gray-200',
    headerBg: 'bg-gray-50',
    dotColor: 'bg-gray-400',
  },
  {
    status: 'in_progress',
    color: 'border-olive-200',
    headerBg: 'bg-olive-50',
    dotColor: 'bg-olive-500',
  },
  {
    status: 'review',
    color: 'border-vpink-200',
    headerBg: 'bg-vpink-50',
    dotColor: 'bg-vpink-400',
  },
  {
    status: 'done',
    color: 'border-emerald-200',
    headerBg: 'bg-emerald-50',
    dotColor: 'bg-emerald-500',
  },
];

interface TaskBoardProps {
  tasks: Task[];
  members: TeamMember[];
  onTaskClick: (task: Task) => void;
  onAddTask: (status?: TaskStatus) => void;
  onMoveTask: (id: string, status: TaskStatus) => void;
}

export function TaskBoard({ tasks, members, onTaskClick, onAddTask, onMoveTask }: TaskBoardProps) {
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const getMember = (id: string | null) =>
    members.find((m) => m.id === id);

  const columnTasks = (status: TaskStatus) =>
    tasks.filter((t) => t.status === status);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggingId(taskId);
  };

  const handleDragOver = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(status);
  };

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (taskId) onMoveTask(taskId, status);
    setDragOverColumn(null);
    setDraggingId(null);
  };

  const handleDragEnd = () => {
    setDragOverColumn(null);
    setDraggingId(null);
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 min-h-[600px]">
      {COLUMNS.map(({ status, color, headerBg, dotColor }) => {
        const colTasks = columnTasks(status);
        const isOver = dragOverColumn === status;

        return (
          <div
            key={status}
            className={cn(
              'flex flex-col min-w-[280px] w-[280px] rounded-xl border transition-colors duration-200',
              color,
              isOver ? 'bg-olive-50/60 border-olive-300' : 'bg-white/60'
            )}
            onDragOver={(e) => handleDragOver(e, status)}
            onDragLeave={() => setDragOverColumn(null)}
            onDrop={(e) => handleDrop(e, status)}
          >
            {/* Column header */}
            <div className={cn('flex items-center justify-between px-4 py-3 rounded-t-xl border-b', headerBg, color.replace('border-', 'border-b-'))}>
              <div className="flex items-center gap-2">
                <span className={cn('size-2 rounded-full', dotColor)} />
                <span className="text-sm font-semibold text-foreground">
                  {STATUS_LABELS[status]}
                </span>
                <span className={cn(
                  'text-xs font-bold px-1.5 py-0.5 rounded-full',
                  isOver ? 'bg-olive-200 text-olive-800' : 'bg-white/80 text-muted-foreground'
                )}>
                  {colTasks.length}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="size-7 text-muted-foreground hover:text-olive-700 hover:bg-white/80"
                onClick={() => onAddTask(status)}
              >
                <PlusIcon className="size-4" />
              </Button>
            </div>

            {/* Cards */}
            <div className="flex flex-col gap-2.5 p-3 flex-1">
              {colTasks.map((task) => (
                <div
                  key={task.id}
                  className={cn(
                    'transition-opacity duration-150',
                    draggingId === task.id && 'opacity-40'
                  )}
                >
                  <TaskCard
                    task={task}
                    member={getMember(task.assigneeId)}
                    onClick={() => onTaskClick(task)}
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    onDragEnd={handleDragEnd}
                  />
                </div>
              ))}

              {/* Drop zone hint */}
              {isOver && colTasks.length === 0 && (
                <div className="flex-1 rounded-lg border-2 border-dashed border-olive-300 flex items-center justify-center min-h-[80px]">
                  <span className="text-sm text-olive-500">여기에 놓기</span>
                </div>
              )}

              {/* Empty state */}
              {!isOver && colTasks.length === 0 && (
                <button
                  onClick={() => onAddTask(status)}
                  className="text-center py-6 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/30 border-2 border-dashed border-transparent hover:border-border"
                >
                  + 일감 추가
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
