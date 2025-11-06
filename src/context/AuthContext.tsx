'use client'; // This must be a Client Component

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

// 1. Define the Context's Shape
interface AuthContextType {
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

// Default value for the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 2. Create the Provider Component
export function AuthProvider({ children }: { children: ReactNode }) {
  // Try to initialize from localStorage to persist login across page reloads
  const [accessToken, setAccessToken] = useState<string | null>(
    typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
  );
  const router = useRouter();

  const isAuthenticated = !!accessToken;

  const login = (token: string) => {
    setAccessToken(token);
    localStorage.setItem('accessToken', token);
  };

  const logout = () => {
    setAccessToken(null);
    localStorage.removeItem('accessToken');
    router.push('/login'); // Redirect to login page after logout
  };

  return (
    <AuthContext.Provider value={{ accessToken, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. Custom Hook for easy consumption
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}