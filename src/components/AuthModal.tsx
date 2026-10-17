'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { X, Sparkles, LogIn, UserPlus, LogOut, ShieldCheck, Mail, Lock, User } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { 
    user, 
    isAuthModalOpen, 
    closeAuthModal, 
    loginWithEmail, 
    signUpWithEmail, 
    quickCreatorLogin, 
    logout 
  } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    if (mode === 'login') {
      const res = await loginWithEmail(email, password);
      if (!res.success) {
        setErrorMessage(res.error || 'Invalid credentials');
      }
    } else {
      const res = await signUpWithEmail(email, password, name || 'Creator');
      if (!res.success) {
        setErrorMessage(res.error || 'Failed to sign up');
      }
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div 
        className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-150 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-black text-white mb-3 shadow-md">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <h2 className="text-2xl font-bold font-editorial text-gray-950 tracking-tight">
            {user ? 'Creator Account' : mode === 'login' ? 'Creator Sign In' : 'Create Creator Account'}
          </h2>
          <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
            {user 
              ? 'Manage your trending YouTube affiliate lookbooks and daily drops.'
              : 'Sign in to access your Creator Studio, add new fashion hauls, and track clicks.'}
          </p>
        </div>

        {/* If Already Logged In */}
        {user ? (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-black text-white font-bold flex items-center justify-center text-sm">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-gray-900 truncate">{user.name}</h4>
                  <span className="text-[10px] uppercase font-bold bg-black text-white px-2 py-0.5 rounded-full">
                    Creator
                  </span>
                </div>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <a
                href="/admin"
                onClick={closeAuthModal}
                className="w-full py-3 px-4 rounded-xl bg-black text-white text-xs font-bold text-center hover:bg-gray-900 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Go to Creator Studio Dashboard</span>
              </a>

              <button
                onClick={async () => {
                  await logout();
                  closeAuthModal();
                }}
                className="w-full py-2.5 px-4 rounded-xl border border-gray-200 text-gray-700 text-xs font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Quick 1-Click Login for Puneet */}
            <div className="mb-5 p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-amber-950 block">
                    ✨ 1-Click Creator Access
                  </span>
                  <span className="text-[11px] text-amber-800">
                    Direct access as Puneet Verma (Creator)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={quickCreatorLogin}
                  className="px-3.5 py-1.5 rounded-xl bg-black hover:bg-gray-800 text-white text-xs font-bold transition-all shadow-xs shrink-0"
                >
                  Quick Login
                </button>
              </div>
            </div>

            <div className="relative flex py-2 items-center mb-4">
              <div className="flex-grow border-t border-gray-200" />
              <span className="shrink mx-3 text-[11px] text-gray-400 font-medium uppercase tracking-wider">
                Or With Email
              </span>
              <div className="flex-grow border-t border-gray-200" />
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Your Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      required
                      placeholder="Puneet Verma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-black focus:ring-1 focus:ring-black"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    required
                    placeholder="puneet@trenddrop.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-black focus:ring-1 focus:ring-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:border-black focus:ring-1 focus:ring-black"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-black text-white text-xs font-bold hover:bg-gray-900 transition-all shadow-md disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
              >
                {mode === 'login' ? (
                  <>
                    <LogIn className="w-3.5 h-3.5" />
                    <span>{loading ? 'Signing in...' : 'Sign In as Creator'}</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>{loading ? 'Creating...' : 'Create Creator Account'}</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-5 text-center">
              <button
                type="button"
                onClick={() => {
                  setMode(mode === 'login' ? 'signup' : 'login');
                  setErrorMessage('');
                }}
                className="text-xs text-gray-500 hover:text-gray-900 transition-colors font-medium"
              >
                {mode === 'login' 
                  ? "Don't have an account yet? Create one"
                  : 'Already have an account? Sign In'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
