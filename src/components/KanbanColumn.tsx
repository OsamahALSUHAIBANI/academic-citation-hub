import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Task, ColumnId } from '@/types';
import { TaskCard } from './TaskCard';

interface KanbanColumnProps {
  id: ColumnId;
  title: string;
  tasks: Task[];
}

export function KanbanColumn({ id, title, tasks }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id,
    data: {
      type: 'Column',
    }
  });

  return (
    <div className="flex flex-col bg-[#141b33]/80 rounded-xl overflow-hidden border border-slate-700/50 shadow-2xl h-full min-h-[600px] backdrop-blur-sm">
      <div className="p-4 bg-[#0d142b] border-b border-slate-700/50 flex justify-between items-center shrink-0">
        <h3 className="font-semibold text-slate-200 uppercase tracking-wide text-xs">{title}</h3>
        <span className="bg-slate-800 text-slate-400 text-xs py-0.5 px-2.5 rounded-full border border-slate-700/50">
          {tasks.length}
        </span>
      </div>
      
      <div ref={setNodeRef} className="p-4 flex-1 space-y-3 overflow-y-auto">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
