import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, User, LogOut, PenTool } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center font-bold text-xl shadow-lg shadow-purple-500/20">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white hidden sm:block">Shab-e-Firaq</span>
          </Link>

          <div className="flex items-center space-x-4">
            <Link to="/novels" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
              Library
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-2 sm:space-x-4">
                <Link to="/writer" className="text-blue-400 hover:text-white px-3 py-2 rounded-md text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-2">
                  <PenTool className="w-4 h-4" />
                  <span className="hidden sm:inline">Write</span>
                </Link>
                <Link to="/dashboard" className="text-zinc-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>
                <button
                  onClick={logout}
                  className="text-zinc-500 hover:text-red-400 p-2 rounded-md transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="inline-flex items-center justify-center px-6 py-2.5 text-xs font-bold uppercase tracking-widest transition-colors rounded-full bg-purple-600 text-white hover:bg-purple-700"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
