'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'creator' | 'user';
  avatarUrl?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  loginWithEmail: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<{ success: boolean; error?: string }>;
  quickCreatorLogin: () => void;
  logout: () => Promise<void>;
  savedProductIds: string[];
  toggleSaveProduct: (productId: string) => void;
  isProductSaved: (productId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_USER_KEY = 'trenddrop_auth_user';
const SAVED_ITEMS_KEY = 'trenddrop_saved_outfits';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [savedProductIds, setSavedProductIds] = useState<string[]>([]);

  useEffect(() => {
    // 1. Load saved wishlist items
    try {
      const storedSaved = localStorage.getItem(SAVED_ITEMS_KEY);
      if (storedSaved) {
        setSavedProductIds(JSON.parse(storedSaved));
      }
    } catch (e) {
      console.error('Failed to parse saved outfits', e);
    }

    // 2. Check local session immediately for zero-latency load
    checkLocalSession();

    // 3. Fallback safety timer so UI never gets stuck in loading
    const safetyTimer = setTimeout(() => {
      setLoading(false);
    }, 800);

    // 4. Check Supabase auth session if configured
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession()
        .then(({ data: { session } }) => {
          clearTimeout(safetyTimer);
          if (session?.user) {
            setUser({
              id: session.user.id,
              email: session.user.email || 'creator@trenddrop.com',
              name: session.user.user_metadata?.name || 'Puneet Verma',
              role: 'creator'
            });
          }
          setLoading(false);
        })
        .catch((err) => {
          clearTimeout(safetyTimer);
          console.warn('Supabase auth getSession error', err);
          setLoading(false);
        });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || 'creator@trenddrop.com',
            name: session.user.user_metadata?.name || 'Puneet Verma',
            role: 'creator'
          });
        }
      });

      return () => {
        clearTimeout(safetyTimer);
        subscription.unsubscribe();
      };
    } else {
      clearTimeout(safetyTimer);
      setLoading(false);
    }
  }, []);

  const checkLocalSession = () => {
    try {
      const storedUser = localStorage.getItem(LOCAL_USER_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        // Default guest / unauthenticated
        setUser(null);
      }
    } catch (e) {
      console.error('Error checking local user', e);
    }
  };

  const loginWithEmail = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    // If Supabase is configured, use real Supabase Auth
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: pass
        });
        if (error) {
          setLoading(false);
          return { success: false, error: error.message };
        }
        if (data.user) {
          const authUser: AuthUser = {
            id: data.user.id,
            email: data.user.email || email,
            name: data.user.user_metadata?.name || 'Puneet Verma',
            role: 'creator'
          };
          setUser(authUser);
          localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(authUser));
          setIsAuthModalOpen(false);
          setLoading(false);
          return { success: true };
        }
      } catch (err: any) {
        setLoading(false);
        return { success: false, error: err.message };
      }
    }

    // Local authentication fallback for zero-barrier setup
    if (email && pass) {
      const isCreator = email.toLowerCase().includes('puneet') || email.toLowerCase().includes('admin') || email.toLowerCase().includes('creator');
      const authUser: AuthUser = {
        id: `usr-${Date.now()}`,
        email,
        name: isCreator ? 'Puneet Verma' : email.split('@')[0],
        role: isCreator ? 'creator' : 'user'
      };
      setUser(authUser);
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(authUser));
      setIsAuthModalOpen(false);
      setLoading(false);
      return { success: true };
    }

    setLoading(false);
    return { success: false, error: 'Please enter valid email and password' };
  };

  const signUpWithEmail = async (email: string, pass: string, name: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: pass,
          options: { data: { name } }
        });
        if (error) {
          setLoading(false);
          return { success: false, error: error.message };
        }
        if (data.user) {
          const authUser: AuthUser = {
            id: data.user.id,
            email: data.user.email || email,
            name,
            role: 'creator'
          };
          setUser(authUser);
          localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(authUser));
          setIsAuthModalOpen(false);
          setLoading(false);
          return { success: true };
        }
      } catch (err: any) {
        setLoading(false);
        return { success: false, error: err.message };
      }
    }

    // Local fallback
    const authUser: AuthUser = {
      id: `usr-${Date.now()}`,
      email,
      name,
      role: 'creator'
    };
    setUser(authUser);
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(authUser));
    setIsAuthModalOpen(false);
    setLoading(false);
    return { success: true };
  };

  const quickCreatorLogin = () => {
    const creatorUser: AuthUser = {
      id: 'puneet-creator-01',
      email: 'puneet@trenddrop.com',
      name: 'Puneet Verma',
      role: 'creator'
    };
    setUser(creatorUser);
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(creatorUser));
    setIsAuthModalOpen(false);
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Supabase signOut error', e);
      }
    }
    localStorage.removeItem(LOCAL_USER_KEY);
    setUser(null);
  };

  const toggleSaveProduct = (productId: string) => {
    setSavedProductIds(prev => {
      const next = prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      localStorage.setItem(SAVED_ITEMS_KEY, JSON.stringify(next));
      return next;
    });
  };

  const isProductSaved = (productId: string): boolean => {
    return savedProductIds.includes(productId);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthModalOpen,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
        loginWithEmail,
        signUpWithEmail,
        quickCreatorLogin,
        logout,
        savedProductIds,
        toggleSaveProduct,
        isProductSaved
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
