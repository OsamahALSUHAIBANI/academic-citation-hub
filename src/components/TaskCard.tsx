import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '@/types';
import { Calendar, AlignLeft } from 'lucide-react';

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const priorityColors = {
    High: 'bg-[#f43f5e]/10 text-[#f43f5e] border-[#f43f5e]/30',
    Medium: 'bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/30',
    Low: 'bg-[#3b82f6]/10 text-[#3b82f6] border-[#3b82f6]/30',
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-30 bg-slate-800/50 border-2 border-indigo-500/50 rounded-xl h-[120px] w-full"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="glass-card rounded-xl p-4 cursor-grab active:cursor-grabbing hover:border-slate-500/50 transition-colors group relative bg-[#1c2541]/80 shadow-md"
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-sm font-semibold text-slate-200 leading-tight pr-2">
          {task.title}
        </h4>
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${priorityColors[task.priority]} whitespace-nowrap`}>
          {task.priority}
        </span>
      </div>
      
      {task.description && (
        <p className="text-xs text-slate-400 line-clamp-2 mb-3 flex items-start gap-1.5">
          <AlignLeft className="w-3 h-3 mt-0.5 shrink-0 opacity-70" />
          <span className="flex-1">{task.description}</span>
        </p>
      )}

      <div className="flex items-center justify-between text-[10px] text-slate-500 mt-auto pt-2 border-t border-slate-700/50">
        <div className="flex items-center gap-1.5 font-medium">
          <Calendar className="w-3 h-3" />
          {task.date}
        </div>
      </div>
    </div>
  );
}
