"use client";

import { useState } from 'react';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Task, ColumnId } from '@/types';
import { KanbanColumn } from './KanbanColumn';
import { TaskCard } from './TaskCard';

interface KanbanBoardProps {
  tasks: Task[];
  onTasksChange: (tasks: Task[]) => void;
}

const COLUMNS: ColumnId[] = ['Backlog', 'To Do', 'In Progress', 'Done'];

export function KanbanBoard({ tasks, onTasksChange }: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: any) => {
    const { active } = event;
    const task = tasks.find(t => t.id === active.id);
    if (task) setActiveTask(task);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === 'Task';
    const isOverTask = over.data.current?.type === 'Task';
    const isOverColumn = COLUMNS.includes(overId as ColumnId);

    if (!isActiveTask) return;

    // Moving task over another task
    if (isActiveTask && isOverTask) {
      const activeIndex = tasks.findIndex(t => t.id === activeId);
      const overIndex = tasks.findIndex(t => t.id === overId);

      if (tasks[activeIndex].columnId !== tasks[overIndex].columnId) {
        const newTasks = [...tasks];
        newTasks[activeIndex].columnId = tasks[overIndex].columnId;
        const moved = arrayMove(newTasks, activeIndex, overIndex);
        onTasksChange(moved);
        return;
      }
      
      const moved = arrayMove(tasks, activeIndex, overIndex);
      onTasksChange(moved);
    }

    // Moving task to an empty column
    if (isActiveTask && isOverColumn) {
      const activeIndex = tasks.findIndex(t => t.id === activeId);
      const newTasks = [...tasks];
      newTasks[activeIndex].columnId = overId as ColumnId;
      const moved = arrayMove(newTasks, activeIndex, newTasks.length - 1);
      onTasksChange(moved);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {COLUMNS.map(col => (
          <KanbanColumn
            key={col}
            id={col}
            title={col}
            tasks={tasks.filter(t => t.columnId === col)}
          />
        ))}
      </div>

      <DragOverlay
        dropAnimation={{
          sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } }),
        }}
      >
        {activeTask ? <TaskCard task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
