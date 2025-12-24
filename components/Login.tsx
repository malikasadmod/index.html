
import React, { useState } from 'react';
import { Lock, User, PlusCircle } from 'lucide-react';

interface LoginProps {
  onLogin: (username: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simplified login for the demo
    if (username && password) {
      onLogin(username);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-emerald-500 mb-6 shadow-xl shadow-emerald-500/20">
             <PlusCircle className="text-white w-12 h-12" strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Khan Medical Complex</h1>
          <p className="text-slate-400 mt-2">Inventory & Billing Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-8 space-y-6 border border-slate-100">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <User size={18} />
              </span>
              <input
                type="text"
                required
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 transition-all outline-none"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                <Lock size={18} />
              </span>
              <input
                type="password"
                required
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 transition-all outline-none"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input type="checkbox" className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded" />
              <label className="ml-2 block text-sm text-gray-600">Remember me</label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-emerald-600/20 transition-all active:scale-[0.98]"
          >
            Sign In to Dashboard
          </button>
        </form>

        <p className="text-center text-slate-500 text-sm mt-8">
          &copy; {new Date().getFullYear()} Khan Medical Complex. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
