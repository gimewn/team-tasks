'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ArrowRightIcon, ClockIcon, AlertCircleIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { TaskCard } from '@/components/tasks/TaskCard';
import { TaskDetail } from '@/components/tasks/TaskDetail';
import { TaskForm } from '@/components/tasks/TaskForm';
import { useTaskStore } from '@/lib/store';
import type { Task, TaskStatus } from '@/lib/types';
import { isOverdue, isDueSoon } from '@/lib/utils';

export default function DashboardPage() {
  const { tasks, members, addTask, updateTask, deleteTask, moveTask } = useTaskStore();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [formTask, setFormTask] = useState<Task | null>(null);

  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress');
  const urgentTasks = tasks.filter(
    (t) => t.status !== 'done' && (isOverdue(t.dueDate) || isDueSoon(t.dueDate, 2) || t.priority === 'urgent')
  ).slice(0, 5);

  const today = format(new Date(), 'yyyy년 M월 d일 EEEE', { locale: ko });

  const openDetail = (task: Task) => {
    setSelectedTask(task);
    setDetailOpen(true);
  };

  const handleEdit = (task: Task) => {
    setDetailOpen(false);
    setFormTask(task);
    setFormOpen(true);
  };

  const handleSave = (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (formTask) {
      updateTask(formTask.id, data);
    } else {
      addTask(data);
    }
    setFormTask(null);
  };

  const handleMove = (id: string, status: TaskStatus) => {
    moveTask(id, status);
    if (selectedTask?.id === id) {
      setSelectedTask((prev) => prev ? { ...prev, status } : null);
    }
  };

  const getMember = (id: string | null) => members.find((m) => m.id === id);

  return (
    <>
      <Header
        title="대시보드"
        subtitle={today}
        onNewTask={() => {
          setFormTask(null);
          setFormOpen(true);
        }}
      />

      <div className="p-6 space-y-8 max-w-7xl">
        {/* Stats */}
        <DashboardStats tasks={tasks} />

        {/* In Progress */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ClockIcon className="size-4 text-olive-600" />
              <h2 className="text-base font-semibold text-foreground">진행 중인 일감</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-olive-100 text-olive-700 font-medium">
                {inProgressTasks.length}
              </span>
            </div>
            <Link href="/tasks">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground text-xs">
                전체 보기
                <ArrowRightIcon className="size-3.5 ml-1" />
              </Button>
            </Link>
          </div>

          {inProgressTasks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {inProgressTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  member={getMember(task.assigneeId)}
                  onClick={() => openDetail(task)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-sm text-muted-foreground bg-white rounded-xl border border-border">
              진행 중인 일감이 없습니다.
            </div>
          )}
        </section>

        {/* Urgent / Due Soon */}
        {urgentTasks.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <AlertCircleIcon className="size-4 text-red-500" />
              <h2 className="text-base font-semibold text-foreground">주의가 필요한 일감</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-600 font-medium">
                {urgentTasks.length}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {urgentTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  member={getMember(task.assigneeId)}
                  onClick={() => openDetail(task)}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      <TaskDetail
        task={selectedTask}
        member={selectedTask ? getMember(selectedTask.assigneeId) : undefined}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        onEdit={handleEdit}
        onDelete={deleteTask}
        onMove={handleMove}
      />

      <TaskForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setFormTask(null);
        }}
        onSave={handleSave}
        members={members}
        initial={formTask}
      />
    </>
  );
}
