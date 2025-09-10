'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  fullName: string;
  email: string;
  walletAddress: string;
  // The user's own referral code, which they can share with others
  referralCode?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  signup: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('deep-protocol-user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        setUser(null);
      }
    }
  }, []);

  const signup = (userData: User) => {
    // Generate a 6-character uppercase alphanumeric referral code with at least one letter and one number
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const allChars = letters + numbers;
    // Ensure at least one letter and one number
    const codeArr = [
      letters.charAt(Math.floor(Math.random() * letters.length)),
      numbers.charAt(Math.floor(Math.random() * numbers.length))
    ];
    // Fill the rest with random chars
    for (let i = 0; i < 4; i++) {
      codeArr.push(allChars.charAt(Math.floor(Math.random() * allChars.length)));
    }
    // Shuffle the array
    for (let i = codeArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [codeArr[i], codeArr[j]] = [codeArr[j], codeArr[i]];
    }
    const userReferralCode = codeArr.join('');
    console.log('Generated referral code:', userReferralCode);
    // Store the user's own referral code in localStorage for later use
    localStorage.setItem('deep-protocol-user-referral-code', userReferralCode);
    // Attach the referral code to the user object
    const userWithReferral = { ...userData, referralCode: userReferralCode };
    setUser(userWithReferral);
    localStorage.setItem('deep-protocol-user', JSON.stringify(userWithReferral));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('deep-protocol-user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      signup,
      logout
    }}>
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
