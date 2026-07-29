"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Calendar, ArrowRight, Eye, EyeOff, ShieldCheck, Sparkles, BookOpen } from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    dateOfBirth: ''
  });

  // Redirect to board if user session already exists
  useEffect(() => {
    const existingUser = localStorage.getItem('user');
    if (existingUser) {
      router.push('/board');
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed. Please check your credentials.');
      }

      if (isLogin) {
        // Save user session locally
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/board');
      } else {
        // Registration successful, automatically log in or prompt to log in
        setSuccessMsg('Account created successfully! Logging you in...');
        setTimeout(async () => {
          try {
            const loginRes = await fetch('/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: formData.email, password: formData.password }),
            });
            const loginData = await loginRes.json();
            if (loginRes.ok && loginData.user) {
              localStorage.setItem('user', JSON.stringify(loginData.user));
              router.push('/board');
            } else {
              setIsLogin(true);
              setSuccessMsg('Registration successful! Please sign in with your password.');
            }
          } catch {
            setIsLogin(true);
            setSuccessMsg('Registration successful! Please sign in with your password.');
          }
        }, 1200);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0b132b] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Dynamic Background Glowing Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[45rem] h-[45rem] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45rem] h-[45rem] bg-indigo-500/15 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1c2541_1px,transparent_1px),linear-gradient(to_bottom,#1c2541_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-25 pointer-events-none" />

      <div className="w-full max-w-md z-10 relative">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#1c2541]/80 border border-blue-500/30 backdrop-blur-md mb-4 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
            <BookOpen className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-300">
              Academic Citation Hub
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            {isLogin ? 'Welcome Back' : 'Get Started'}
          </h1>
          <p className="text-slate-400 mt-2 text-sm max-w-xs mx-auto">
            {isLogin 
              ? 'Sign in to access your citations, research notes, and Kanban workspace' 
              : 'Create an account to manage your academic citations and research tasks'}
          </p>
        </div>

        {/* Glowing Slate Glass Card */}
        <div className="bg-[#1c2541]/70 backdrop-blur-xl border border-slate-700/60 rounded-2xl p-8 shadow-[0_0_50px_rgba(11,19,43,0.9)] relative transition-all duration-300">
          
          {/* Form Mode Toggle Tabs */}
          <div className="grid grid-cols-2 p-1 bg-[#0b132b]/80 border border-slate-800 rounded-xl mb-6 relative">
            <button
              type="button"
              onClick={() => {
                setIsLogin(true);
                setError('');
                setSuccessMsg('');
              }}
              className={`py-2.5 text-xs font-semibold rounded-lg transition-all duration-200 ${
                isLogin
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLogin(false);
                setError('');
                setSuccessMsg('');
              }}
              className={`py-2.5 text-xs font-semibold rounded-lg transition-all duration-200 ${
                !isLogin
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Register
            </button>
          </div>

          {/* Feedback Messages */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-center gap-2.5 animate-fadeIn">
              <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2.5 animate-fadeIn">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Auth Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      name="name"
                      required={!isLogin}
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Jane Doe"
                      className="w-full bg-[#0b132b]/80 border border-slate-700/80 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Date of Birth
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="date"
                      name="dateOfBirth"
                      required={!isLogin}
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="w-full bg-[#0b132b]/80 border border-slate-700/80 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-100 outline-none transition-all [color-scheme:dark]"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="researcher@university.edu"
                  className="w-full bg-[#0b132b]/80 border border-slate-700/80 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-[#0b132b]/80 border border-slate-700/80 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl py-2.5 pl-10 pr-10 text-sm text-slate-100 placeholder-slate-500 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm rounded-xl shadow-[0_0_25px_rgba(59,130,246,0.35)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-6 flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isLogin ? 'Sign In to Workspace' : 'Create Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Bottom Switch Link */}
          <div className="mt-6 text-center border-t border-slate-800 pt-5">
            <p className="text-xs text-slate-400">
              {isLogin ? "Don't have an account yet?" : "Already registered?"}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setSuccessMsg('');
                }}
                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors focus:outline-none"
              >
                {isLogin ? 'Register now' : 'Sign in here'}
              </button>
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-xs text-slate-500 mt-6 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>Secure local storage backed by server files</span>
        </p>
      </div>
    </main>
  );
}
