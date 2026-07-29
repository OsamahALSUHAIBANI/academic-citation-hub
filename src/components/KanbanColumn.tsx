import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Task, ColumnId } from '@/types';
import { TaskCard } from './TaskCard';

interface KanbanColumnProps {
  id: ColumnId;
  title: string;
  tasks: Task[];
  onDeleteTask?: (id: string) => void;
}

export function KanbanColumn({ id, title, tasks, onDeleteTask }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id,
    data: {
      type: 'Column',
    }
  });

  const columnAccentColors: Record<ColumnId, string> = {
    'Backlog': 'border-t-slate-500 text-slate-300',
    'To Do': 'border-t-blue-500 text-blue-300',
    'In Progress': 'border-t-amber-500 text-amber-300',
    'Done': 'border-t-emerald-500 text-emerald-300',
  };

  return (
    <div className={`flex flex-col bg-[#141b33]/90 rounded-2xl overflow-hidden border border-slate-700/60 shadow-xl border-t-4 ${columnAccentColors[id]} min-h-[620px] backdrop-blur-md`}>
      <div className="p-4 bg-[#0d142b]/90 border-b border-slate-700/50 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-slate-100 uppercase tracking-wider text-xs">{title}</h3>
        </div>
        <span className="bg-[#1c2541] text-slate-300 text-xs font-bold py-0.5 px-2.5 rounded-full border border-slate-700/80">
          {tasks.length}
        </span>
      </div>
      
      <div ref={setNodeRef} className="p-3.5 flex-1 space-y-3 overflow-y-auto">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} onDelete={onDeleteTask} />
          ))}
        </SortableContext>
        
        {tasks.length === 0 && (
          <div className="h-32 border-2 border-dashed border-slate-800/80 rounded-xl flex items-center justify-center text-slate-500 text-xs font-medium">
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  );
}
