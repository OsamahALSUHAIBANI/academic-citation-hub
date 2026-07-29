"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { KanbanBoard } from '@/components/KanbanBoard';
import { NewTaskModal } from '@/components/NewTaskModal';
import { Task } from '@/types';
import { LogOut, Plus } from 'lucide-react';

export default function BoardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/');
      return;
    }
    const parsed = JSON.parse(storedUser);
    setUser(parsed);

    // Fetch tasks
    fetch(`/api/tasks?email=${parsed.email}`)
      .then(res => res.json())
      .then(data => {
        setTasks(data.tasks || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching tasks:', err);
        setLoading(false);
      });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  const handleTasksChange = async (newTasks: Task[]) => {
    // Optimistic UI update
    setTasks(newTasks);
    
    // Persist
    if (user) {
      try {
        await fetch('/api/tasks', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email, tasks: newTasks }),
        });
      } catch (err) {
        console.error('Failed to persist tasks', err);
      }
    }
  };

  const handleCreateTask = async (taskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
    };
    const newTasks = [...tasks, newTask];
    await handleTasksChange(newTasks);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b132b] flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0b132b] text-slate-200">
      <header className="bg-[#141b33]/50 border-b border-white/5 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
              Kanban Hub
            </h1>
            <div className="hidden md:flex items-center gap-3 text-sm text-slate-400 border-l border-white/10 pl-4">
              <span className="font-medium text-slate-300">{user?.profileInfo?.name || user?.email}</span>
              {user?.profileInfo?.dateOfBirth && (
                <>
                  <span className="w-1 h-1 rounded-full bg-slate-600" />
                  <span>DOB: {user.profileInfo.dateOfBirth}</span>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all shadow-lg shadow-blue-500/20 transform hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
              New Task
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <KanbanBoard tasks={tasks} onTasksChange={handleTasksChange} />
      </div>

      <NewTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreateTask}
      />
    </main>
  );
}
