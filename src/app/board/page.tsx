"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { KanbanBoard } from '@/components/KanbanBoard';
import { NewTaskModal } from '@/components/NewTaskModal';
import { Task } from '@/types';
import { LogOut, Plus, User, Calendar, BookOpen, CheckCircle2, RefreshCw } from 'lucide-react';

export default function BoardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string>('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/');
      return;
    }
    try {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);

      // Fetch user tasks
      fetch(`/api/tasks?email=${encodeURIComponent(parsed.email)}`)
        .then(res => res.json())
        .then(data => {
          setTasks(data.tasks || []);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching tasks:', err);
          setLoading(false);
        });
    } catch {
      localStorage.removeItem('user');
      router.push('/');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  const handleTasksChange = async (newTasks: Task[]) => {
    // Instant UI update
    setTasks(newTasks);
    setSaveStatus('Saving...');
    
    // Persist to server
    if (user?.email) {
      try {
        const res = await fetch('/api/tasks', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email, tasks: newTasks }),
        });
        if (res.ok) {
          setSaveStatus('Saved');
          setTimeout(() => setSaveStatus(''), 2000);
        } else {
          setSaveStatus('Error saving');
        }
      } catch (err) {
        console.error('Failed to persist tasks', err);
        setSaveStatus('Error saving');
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

  const handleDeleteTask = async (taskId: string) => {
    const newTasks = tasks.filter(t => t.id !== taskId);
    await handleTasksChange(newTasks);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b132b] flex flex-col items-center justify-center text-white">
        <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4" />
        <p className="text-slate-400 text-sm font-medium animate-pulse">Loading workspace...</p>
      </div>
    );
  }

  const name = user?.profileInfo?.name || user?.name || user?.email || 'Researcher';
  const dob = user?.profileInfo?.dateOfBirth || user?.dateOfBirth;

  return (
    <main className="min-h-screen bg-[#0b132b] text-slate-100 flex flex-col font-sans">
      {/* Top Header Bar */}
      <header className="bg-[#141b33]/80 border-b border-slate-800 backdrop-blur-xl sticky top-0 z-40 shadow-lg">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 border border-blue-400/30 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-lg font-extrabold bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent leading-tight">
                  Academic Citation Hub
                </h1>
                <p className="text-[10px] text-slate-400 font-medium tracking-wide">Kanban Workspace</p>
              </div>
            </div>

            {/* Logged in User info header section */}
            <div className="hidden md:flex items-center gap-3 text-xs text-slate-300 border-l border-slate-700/80 pl-5 py-1">
              <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                <User className="w-3.5 h-3.5 text-blue-400" />
                <span>{name}</span>
              </div>
              {dob && (
                <div className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>DOB: {dob}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {saveStatus && (
              <span className="text-xs text-slate-400 flex items-center gap-1.5 animate-fadeIn">
                {saveStatus === 'Saving...' ? (
                  <RefreshCw className="w-3.5 h-3.5 text-blue-400 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                )}
                {saveStatus}
              </span>
            )}

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Plus className="w-4 h-4" />
              <span>New Task</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-rose-400 transition-all bg-slate-800/40 hover:bg-rose-500/10 px-3.5 py-2.5 rounded-xl border border-slate-700/50 hover:border-rose-500/30"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Board Content */}
      <div className="flex-1 max-w-[1600px] w-full mx-auto px-6 py-8">
        <KanbanBoard 
          tasks={tasks} 
          onTasksChange={handleTasksChange} 
          onDeleteTask={handleDeleteTask}
        />
      </div>

      {/* Modal */}
      <NewTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleCreateTask}
      />
    </main>
  );
}
