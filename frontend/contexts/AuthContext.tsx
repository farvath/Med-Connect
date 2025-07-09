"use client"

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { IUserProfile } from '@/types/user';
import { checkAuth } from '@/lib/api';

interface AuthContextType {
  user: IUserProfile | null;
  isLoggedIn: boolean;
  loading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IUserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const res: IUserProfile | null = await checkAuth();
      
      if (res && res.name && res.specialty) {
        // Format dates for form inputs if they exist
        const formattedEducation = res.education?.map(edu => ({
          ...edu,
          startDate: edu.startDate ? new Date(edu.startDate).toISOString().split('T')[0] : '',
          endDate: edu.endDate ? new Date(edu.endDate).toISOString().split('T')[0] : undefined,
        })) || [];
        
        const formattedExperience = res.experience?.map(exp => ({
          ...exp,
          startDate: exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : '',
          endDate: exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : undefined,
        })) || [];

        setUser({
          ...res,
          education: formattedEducation,
          experience: formattedExperience
        });
      } else {
        setUser(null);
      }
    } catch (err) {
      // Completely suppress authentication errors (401)
      const error = err as any;
      if (error?.status !== 401 && !error?.isAuthError) {
        console.error("Error fetching user:", err);
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    await fetchUser();
  };

  const logout = () => {
    setUser(null);
    // Clear any stored tokens/cookies if needed
  };

  useEffect(() => {
    let mounted = true;
    
    const loadUser = async () => {
      if (mounted) {
        await fetchUser();
      }
    };
    
    loadUser();
    
    return () => {
      mounted = false;
    };
  }, []);

  const isLoggedIn = Boolean(user?.name && user?.specialty);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, loading, refreshUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
