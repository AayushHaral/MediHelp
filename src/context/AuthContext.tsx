import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser } from '../types';
import { DEFAULT_AUTH_USERS } from '../data/mockData';
import { useLanguage } from './LanguageContext';

interface AuthContextType {
  currentUser: AuthUser | null;
  isLoggedIn: boolean;
  login: (user: AuthUser) => void;
  loginWithCredentials: (emailOrPhone: string, pass: string) => boolean;
  logout: () => void;
  registerUser: (newUser: Omit<AuthUser, 'id' | 'avatarInitials'>) => AuthUser;
  switchUser: (userId: string) => void;
  availableUsers: AuthUser[];
}

const AUTH_STORAGE_KEY = 'pharmacompare_auth_current_user';
const USERS_STORAGE_KEY = 'pharmacompare_all_users';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setSeniorMode, textSize, setTextSize } = useLanguage();

  const [availableUsers, setAvailableUsers] = useState<AuthUser[]>(() => {
    try {
      const saved = localStorage.getItem(USERS_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}
    return DEFAULT_AUTH_USERS;
  });

  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}
    return DEFAULT_AUTH_USERS[0]; // Default logged in as Sarah Jenkins for rich demo preview
  });

  // Persist current user
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch {}
  }, [currentUser]);

  // Persist available users
  useEffect(() => {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(availableUsers));
    } catch {}
  }, [availableUsers]);

  const login = (user: AuthUser) => {
    setCurrentUser(user);
    if (user.isSeniorEligible) {
      setSeniorMode(true);
      if (textSize === 'normal') {
        setTextSize('large');
      }
    }
  };

  const loginWithCredentials = (emailOrPhone: string, _pass: string): boolean => {
    const trimmed = emailOrPhone.trim().toLowerCase();
    const found = availableUsers.find(
      (u) =>
        u.email.toLowerCase() === trimmed ||
        (u.phone && u.phone.replace(/\D/g, '') === trimmed.replace(/\D/g, '')) ||
        (u.memberId && u.memberId.toLowerCase() === trimmed)
    );

    if (found) {
      login(found);
      return true;
    }

    // If not found in mock list, generate a verified patient session for demo
    const initials = trimmed.slice(0, 2).toUpperCase() || 'PT';
    const dynamicUser: AuthUser = {
      id: `user-${Date.now()}`,
      name: emailOrPhone.includes('@') ? emailOrPhone.split('@')[0] : 'Verified Patient',
      email: emailOrPhone.includes('@') ? emailOrPhone : `${trimmed}@patientmail.org`,
      phone: emailOrPhone.includes('@') ? '(415) 555-0182' : emailOrPhone,
      role: 'patient',
      insuranceName: 'Self-Pay Cash Discount Member',
      avatarInitials: initials,
      isSeniorEligible: false
    };

    setAvailableUsers((prev) => [dynamicUser, ...prev]);
    login(dynamicUser);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const registerUser = (data: Omit<AuthUser, 'id' | 'avatarInitials'>): AuthUser => {
    const names = data.name.trim().split(' ');
    const initials =
      names.length >= 2
        ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
        : data.name.slice(0, 2).toUpperCase();

    const newUser: AuthUser = {
      ...data,
      id: `user-${Date.now()}`,
      avatarInitials: initials || 'PT'
    };

    setAvailableUsers((prev) => [newUser, ...prev]);
    login(newUser);
    return newUser;
  };

  const switchUser = (userId: string) => {
    const found = availableUsers.find((u) => u.id === userId);
    if (found) {
      login(found);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoggedIn: currentUser !== null,
        login,
        loginWithCredentials,
        logout,
        registerUser,
        switchUser,
        availableUsers
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
