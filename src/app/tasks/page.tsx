'use client';

import { useState } from 'react';
import { LayoutGridIcon, ListIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { TaskBoard } from '@/components/tasks/TaskBoard';
import { TaskList } from '@/components/tasks/TaskList';
import { TaskFilters } from '@/components/tasks/TaskFilters';
import { TaskDetail } from '@/components/tasks/TaskDetail';
import { TaskForm } from '@/components/tasks/TaskForm';
import { useTaskStore } from '@/lib/store';
import { filterTasks } from '@/lib/utils';
import type { Task, TaskStatus, FilterState } from '@/lib/types';

const DEFAULT_FILTER: FilterState = {
  search: '',
  status: 'all',
  priority: 'all',
  category: 'all',
  assigneeId: 'all',
};

type ViewMode = 'board' | 'list';

export default function TasksPage() {
  const { tasks, members, addTask, updateTask, deleteTask, moveTask } = useTaskStore();

  const [viewMode, setViewMode] = useState<ViewMode>('board');
  const [filter, setFilter] = useState<FilterState>(DEFAULT_FILTER);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [formTask, setFormTask] = useState<Task | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus | undefined>();

  const filtered = filterTasks(tasks, filter);
  const getMember = (id: string | null) => members.find((m) => m.id === id);

  const openDetail = (task: Task) => {
    setSelectedTask(task);
    setDetailOpen(true);
  };

  const openNewTask = (status?: TaskStatus) => {
    setFormTask(null);
    setDefaultStatus(status);
    setFormOpen(true);
  };

  const handleEdit = (task: Task) => {
    setDetailOpen(false);
    setFormTask(task);
    setFormOpen(true);
  };

  const handleSave = (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const payload = defaultStatus && !formTask
      ? { ...data, status: defaultStatus }
      : data;

    if (formTask) {
      updateTask(formTask.id, payload);
    } else {
      addTask(payload);
    }
    setFormTask(null);
    setDefaultStatus(undefined);
  };

  const handleMove = (id: string, status: TaskStatus) => {
    moveTask(id, status);
    if (selectedTask?.id === id) {
      setSelectedTask((prev) => prev ? { ...prev, status } : null);
    }
  };

  const subtitle = `전체 ${tasks.length}개${filtered.length !== tasks.length ? ` · 필터 ${filtered.length}개` : ''}`;

  return (
    <>
      <Header title="일감 관리" subtitle={subtitle} onNewTask={() => openNewTask()} />

      <div className="p-6 space-y-5">
        {/* Controls bar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-0">
            <TaskFilters filter={filter} members={members} onChange={setFilter} />
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-1 bg-white border border-border rounded-lg p-1 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className={`h-7 px-2.5 ${viewMode === 'board' ? 'bg-olive-100 text-olive-700 hover:bg-olive-100' : 'text-muted-foreground'}`}
              onClick={() => setViewMode('board')}
            >
              <LayoutGridIcon className="size-4 mr-1.5" />
              보드
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`h-7 px-2.5 ${viewMode === 'list' ? 'bg-olive-100 text-olive-700 hover:bg-olive-100' : 'text-muted-foreground'}`}
              onClick={() => setViewMode('list')}
            >
              <ListIcon className="size-4 mr-1.5" />
              목록
            </Button>
          </div>
        </div>

        {/* Board / List view */}
        {viewMode === 'board' ? (
          <TaskBoard
            tasks={filtered}
            members={members}
            onTaskClick={openDetail}
            onAddTask={openNewTask}
            onMoveTask={handleMove}
          />
        ) : (
          <TaskList
            tasks={filtered}
            members={members}
            onTaskClick={openDetail}
          />
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
          setDefaultStatus(undefined);
        }}
        onSave={handleSave}
        members={members}
        initial={formTask}
      />
    </>
  );
}
