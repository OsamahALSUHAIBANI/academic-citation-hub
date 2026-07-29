import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '@/types';
import { Calendar, AlignLeft, Trash2 } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onDelete?: (id: string) => void;
}

export function TaskCard({ task, onDelete }: TaskCardProps) {
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
    High: 'bg-[#f43f5e]/15 text-[#f43f5e] border-[#f43f5e]/40 shadow-[0_0_10px_rgba(244,63,94,0.15)]',
    Medium: 'bg-[#f59e0b]/15 text-[#f59e0b] border-[#f59e0b]/40 shadow-[0_0_10px_rgba(245,158,11,0.15)]',
    Low: 'bg-[#3b82f6]/15 text-[#3b82f6] border-[#3b82f6]/40 shadow-[0_0_10px_rgba(59,130,246,0.15)]',
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-30 bg-[#1c2541]/50 border-2 border-blue-500/50 rounded-xl h-[120px] w-full shadow-lg"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="group relative bg-[#1c2541]/80 hover:bg-[#1c2541] border border-slate-700/60 hover:border-blue-500/40 rounded-xl p-4 cursor-grab active:cursor-grabbing transition-all duration-200 shadow-lg hover:shadow-xl backdrop-blur-sm"
    >
      <div className="flex justify-between items-start mb-2 gap-2">
        <h4 className="text-sm font-semibold text-slate-100 leading-snug">
          {task.title}
        </h4>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${priorityColors[task.priority]} whitespace-nowrap shrink-0`}>
          {task.priority}
        </span>
      </div>
      
      {task.description && (
        <p className="text-xs text-slate-400 line-clamp-2 mb-3 flex items-start gap-1.5">
          <AlignLeft className="w-3 h-3 mt-0.5 shrink-0 text-slate-500" />
          <span className="flex-1">{task.description}</span>
        </p>
      )}

      <div className="flex items-center justify-between text-[10px] text-slate-400 mt-auto pt-2.5 border-t border-slate-700/50">
        <div className="flex items-center gap-1.5 font-medium">
          <Calendar className="w-3.5 h-3.5 text-blue-400" />
          <span>{task.date}</span>
        </div>

        {onDelete && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-all rounded"
            title="Delete Task"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
